import { orderBy } from '@sisense/sdk-ui/dist/chart-data-processor/table_processor';
import { EndpointDescription, NLQProvider, QQResponse } from '../chat/types/NLQProvider';
import { cJAQL } from './types/cJAQL';
import { Attribute, BaseMeasure, Dimension, Measure, createMeasure } from '@sisense/sdk-data';
import { ChartType } from '@sisense/sdk-ui';


export class CJqlNLQProvider implements NLQProvider {
	constructor(private endpoint: EndpointDescription, private dimensions: Dimension[]) {
      if (endpoint.type !== 'cJAQL')
        throw new Error('Your should provide  cJAQL compatible API endpoint');
	}

	getDimension(name: string) {
		const dimension = this.dimensions.find((dimension) => name === dimension.name);
		if (!dimension) {
			throw new Error('wrong dimension')
		}
		return dimension;
	}

	getOrderBy(dimension: Dimension, cjaql: cJAQL) {
		if (!cjaql.orderBy) return null;
    const attribs = dimension.attributes.concat(dimension.dimensions).map(({name}) => name);
    const order = (Array.isArray(cjaql.orderBy) ? cjaql.orderBy: [cjaql.orderBy]).reduce(
      (a, o) => Object.entries(o).reduce((aa, [k, v]:any) => {
        if (attribs.includes(k)) aa[k] = v;
        return aa;
      }, a),
      {}
    );
		return order;
	}

	async request(message: string): Promise<QQResponse> {
    let cjaql: cJAQL|null = null;
    try {
		  const response = await fetch(this.endpoint.endpoint, {method: "POST", body: message, redirect: 'follow'});
		  cjaql = (await response.json()) as cJAQL;
console.log(" --- cJAQL", cjaql);
    } catch(e: any) {
      if (e.response) {
        return {message: (await e.response.json()).error || "Something went wrong :(" }
      }
    }
    if (cjaql === null)
      return {message: "Not sure what you've asked, can you paraphrase?"};

    if ((cjaql as any).error) {
      return {message: (cjaql as any).error }
    }
		const result: Awaited<ReturnType<NLQProvider["request"]>> = {}

		const dimension = this.getDimension(cjaql.dimension);
    const orderBy = this.getOrderBy(dimension, cjaql);

		if (cjaql.display !== 'table') {
      const findAttrDim = (nm:string):any => dimension.attributes.concat(dimension.dimensions).find(({name}) => name == nm);

      const groupByAttrName = Array.isArray(cjaql.groupBy) ? cjaql.groupBy[0] : cjaql.groupBy;
			let groupByDimension = groupByAttrName && findAttrDim(groupByAttrName);

      //if (!groupByDimension) groupByDimension = dimension.attributes[0];

      const fields: (Measure|BaseMeasure)[] = ((cjaql.fields || []) as any[]).concat(cjaql.aggregations || []).reduce((a, fld: string | {[key: string]: string}) => {
        const findAttr = (nm: string) => {
          const ex = a.find(({name}: any) => name == nm);
          if (ex) return ex;
          const attr = findAttrDim(nm);
          if (attr) {
            a.push(attr);
            return attr;
          }
        }
        if (typeof fld == 'string') {
          findAttr(fld);
        } else {
          Object.entries(fld).map(([k, v]):any => {
            const ex = findAttr(k);
            if (ex) ex.aggregation = v;
          });
        }
        return a;
			}, [] as (Measure|BaseMeasure)[]);

      const chart: any = {
        chartType: (({barchart: "bar", linechart: "line", areachart: "area", piechart: "pie"})[cjaql.display || "barchart"] as ChartType) || "barchart",
				dataSource: cjaql.datasource,
				dimensions: (fields as any[]).map(({name, type, expression}) => ({name, type, expression})),
				dataOptions: {
          value: fields.map((m: any) => {
            const measure: any = {name: m.name};
            if (orderBy && orderBy[m.name]) measure.sortType = orderBy[m.name] == 'asc' ? 'sortAsc' : 'sortDesc';
            if (m.aggregation)
              measure.aggregation = m.aggregation;
            return measure;
          }),
          breakBy: [], //Array.isArray(cjaql.groupBy) ? cjaql.groupBy : [cjaql.groupBy],
        }};
        chart.dataOptions.category = groupByDimension ? [{
          name: groupByDimension?.name,
          type: groupByDimension?.type
        }] : [{
          name: fields[0].name,
          type: fields[0].type
        }];
			result.chart = chart;
		} else {
      result.table = {
        dataSource: cjaql.datasource,
        columns: dimension.attributes
          .filter((a) => cjaql!.fields ? cjaql!.fields.includes(a.name) : true)
          .map(({name, type, expression}) => {
            const res :any = {name, type, expression} 
            if (orderBy && orderBy[name]) res.sortType = orderBy[name] == 'asc' ? 'sortAsc' : 'sortDesc';
            return res;
          }),
      };
      if (cjaql.limit)
        result.table!.count = cjaql.limit;
      if (cjaql.offset)
        result.table!.offset = cjaql.offset;
    }

console.log("--- CSDK:", result);
		return result;
	}
}


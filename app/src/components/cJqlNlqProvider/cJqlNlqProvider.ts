import { orderBy } from '@sisense/sdk-ui/dist/chart-data-processor/table_processor';
import { NLQProvider, QQResponse } from '../chat/types/NLQProvider';
import { cJAQL } from './types/cJAQL';
import { Attribute, BaseMeasure, Dimension, Measure, createMeasure } from '@sisense/sdk-data';


export class CJqlNLQProvider implements NLQProvider {
	constructor(private endpoint: string, private dimensions: Dimension[]) {
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
      (a, o) => (([k, v]:any) => {
        if (attribs.includes(k)) a[k] = v;
        return a;
      })(Object.entries(o)),
      {}
    );
		return order;
	}

	async request(message: string): Promise<QQResponse> {
    let cjaql: cJAQL|null = null;
    try {
		  const response = await fetch(this.endpoint, {method: "POST", body: message});
		  cjaql = (await response.json()) as cJAQL;
console.log("cjaql", cjaql);
    } catch(e: any) {
      if (e.response) {
        return {message: (await e.response.json()).error || "Something went wrong :(" }
      }
    }
    if (cjaql === null)
      return {message: "Not sure what you've asked, can you paraphrase?"};

		const result: Awaited<ReturnType<NLQProvider["request"]>> = {}

		const dimension = this.getDimension(cjaql.dimension);
console.log("cjaql DIm = ", dimension);

    const orderBy = this.getOrderBy(dimension, cjaql);

		if (cjaql.display !== 'table') {
      const groupByAttrName = Array.isArray(cjaql.groupBy) ? cjaql.groupBy[0] : cjaql.groupBy;
			let groupByDimension = dimension.attributes.find(({name}) => name == groupByAttrName);
      if (!groupByDimension)
        groupByDimension = dimension.attributes[0];
      const fields: (Measure|BaseMeasure)[] = ((cjaql.fields || []) as any[]).concat(cjaql.aggregations).reduce((a, fld: string | {[key: string]: string}) => {
        const findAttr = (nm: string, add = true) => {
          const ex = a.find(({name}: any) => name == nm);
          if (ex || !add) return ex;
          const attr = dimension.attributes.find(({name}) => name == nm);
          if (attr) {
            a.push(attr);
            return attr;
          }
        }
        if (typeof fld == 'string') {
          findAttr(fld);
        } else {
console.log("entries", Object.entries(fld));
          Object.entries(fld).map(([k, v]):any => {
            const ex = findAttr(k, false);
            if (ex) ex.aggregation = v;
          });
        }
console.log("A", a);
        return a;
			}, [] as (Measure|BaseMeasure)[]);

			result.chart = {
				dataSource: cjaql.datasource,
				dimensions: (fields as any[]).map(({name, type, expression}) => ({name, type, expression})),
				dataOptions: {
					category: [{
						name: groupByDimension?.name,
						type: groupByDimension?.type
					}],
					value: fields.map((m: any) => {
            const measure: any = {name: m.name};
            if (orderBy && orderBy[m.name]) measure.sortType = orderBy[m.name] == 'asc' ? 'sortAsc' : 'sortDesc';
            if (m.aggregation)
              measure.aggregation = m.aggregation;
            return measure;
          }),
          breakBy: [], //Array.isArray(cjaql.groupBy) ? cjaql.groupBy : [cjaql.groupBy],
				}
			};
		} else {
      result.table = {
        dataSource: cjaql.datasource,
        columns: dimension.attributes.map(({name, type, expression}) => {
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

console.log("CSDK:", result);
		return result;
	}
}


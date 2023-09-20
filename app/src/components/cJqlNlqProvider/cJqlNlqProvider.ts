import { orderBy } from '@sisense/sdk-ui/dist/chart-data-processor/table_processor';
import { NLQProvider, QQResponse } from '../chat/types/NLQProvider';
import { cJAQL } from './types/cJAQL';
import { Dimension } from '@sisense/sdk-data';


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
        return {message: (await e.response.json()).message}
      }
    }
    if (cjaql === null)
      return {message: "Not sure what you've asked, can you paraphrase?"};

		const result: Awaited<ReturnType<NLQProvider["request"]>> = {}

		const dimension = this.getDimension(cjaql.dimension);
console.log("cjaql DIm = ", dimension);

    const orderBy = this.getOrderBy(dimension, cjaql);

		if (cjaql.groupBy && cjaql.aggregations) {
			const groupByDimension = this.getDimension(cjaql.groupBy);
			const aggDimensions = cjaql.aggregations.map((aggregation) => {
				const fields = Object.keys(aggregation);
				return this.getDimension(fields[0]);
			});

			result.chart = {
				dataSource: cjaql.datasource,
				dimensions: [{
					name: dimension?.name as string,
					type: dimension?.type as string,
					expression: dimension?.expression as string
				}],

				dataOptions: {
					category: [{
						name: groupByDimension?.name,
						type: groupByDimension?.type
					}],
					value: aggDimensions.map((dimension) => ({
						name: dimension.name,
						aggregation: (cjaql!.aggregations && cjaql!.aggregations[dimension.name as any]) as any,
					})),
          breakBy: []
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

//
// "category": [
// 	{
// 		"name": "Gender",
// 		"type": "string"
// 	}
// ],
// 	"value": [
// 	{
// 		"name": "Quantity",
// 		"aggregation": "sum"
// 	},
// 	{
// 		"name": "Revenue",
// 		"aggregation": "sum"
// 	}
// ],
// 	"breakBy": []
console.log("CSDK:", result);
		return result;
	}
}


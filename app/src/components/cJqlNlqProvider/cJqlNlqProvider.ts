import {NLQProvider} from '../chat/types/NLQProvider';
import {cJAQL} from './types/cJAQL';
import {Dimension} from '@sisense/sdk-data';


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

	async request(message: string) {
		const response = await fetch(this.endpoint);
		const cjaql = (await response.json()) as cJAQL;

		const result: Awaited<ReturnType<NLQProvider["request"]>> = {}

		const dimension = this.getDimension(cjaql.dimension);

		if (cjaql.groupBy && cjaql.aggregations) {
			const groupByDimension = this.getDimension(cjaql.groupBy);
			const aggDimensions = cjaql.aggregations.map((aggregation) => {
				const fileds = Object.keys(aggregation);
				this.getDimension(fieldName)
			});

			result
				.chart = {
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
					value: aggDimensions.map(dimension => ({
						name: dimension.name,
						aggregation: cjaql.aggregations?.[dimension.name] as 'sum'
					}))
				}
			};
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

		return result;
	}
}


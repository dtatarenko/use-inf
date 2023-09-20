import {NLQProvider} from '../chat/types/NLQProvider';

const wait = () => new Promise(resolve => setTimeout(resolve, 300));

export class MockNLQProvider implements NLQProvider {
	async request(message: string) {
		await wait();
		if (message.includes('chart')) {
			return {
				chart: {
					dataSource: 'Sample ECommerce',
					dimensions: [{
						name: 'Gender',
						type: 'text-attribute',
						expression: '[Commerce.Gender]',
					}, {
						name: 'Quantity',
						type: 'numeric-attribute',
						expression: '[Commerce.Quantity]',
					}, {
						name: 'Revenue',
						type: 'numeric-attribute',
						expression: '[Commerce.Revenue]',
					}],
					dataOptions: {
						"category": [
							{
								"name": "Gender",
								"type": "string"
							}
						],
						"value": [
							{
								"name": "Quantity",
								"aggregation": "sum"
							},
							{
								"name": "Revenue",
								"aggregation": "sum"
							}
						],
						"breakBy": []
					}
				}
			}
		} else if (message.includes('table')) {
			return {
				table: {
					dataSource: 'Sample ECommerce',
					columns: [
						{
							name: 'AgeRange',
							type: 'text-attribute',
							expression: '[Commerce.Age Range]',
						}, {
							name: 'Cost',
							type: 'numeric-attribute',
							expression: '[Commerce.Cost]',
						}, {
							name: 'Quantity',
							type: 'numeric-attribute',
							expression: '[Commerce.Quantity]',
						}, {
							name: 'Revenue',
							type: 'numeric-attribute',
							expression: '[Commerce.Revenue]',
						}
					],
				}
			};
		} else if (message.includes('example')) {
			return {
				debug: 'example-data'
			};
		} else {
			return {
				message: 'whatever'
			};
		}
	}
}


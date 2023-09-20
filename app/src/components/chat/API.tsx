import React from 'react'
import {createAttribute} from '@sisense/sdk-data';
import {ChartProps} from './ChartMessage';
import {TableProps} from './TableMessage';

const wait = () => new Promise(resolve => setTimeout(resolve, 300));

interface QQResponse {
	table?: TableProps
	chart?: ChartProps;
	message?: string
	debug?: any
}

/*
export async function realQQRequest(message: string): Promise<QQResponse> {
	const response = await fetch("http://example.com/movies.json");
	const movies = await response.json();
	console.log(movies);
}*/

export async function qqRequest(message: string): Promise<QQResponse> {
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
import React from 'react';
import {useExecuteQuery} from "@sisense/sdk-ui";
import * as DM from "../../data/sample-ecommerce";
import {measures, filters, createAttribute} from "@sisense/sdk-data";
import {BarChart, CartesianChartDataOptions} from "@sisense/sdk-ui";
import {DataSource, Attribute, Filter, Measure} from '@sisense/sdk-data';

export interface Dimension {
	name: string,
	type: string,
	expression: string,
}

export interface ChartProps {
	dataSource: string;
	dimensions: Dimension[];
	measures?: Measure[],
	filters?: Filter[],

	dataOptions: CartesianChartDataOptions
}

function prepareDimension(json: any) {
	return createAttribute(json)
}
export const ChartMessage = ({
								 dataSource,
								 dimensions,
								 measures = [],
								 filters = [],
								 dataOptions
							 }: ChartProps) => {
	const {data, isLoading, isError} = useExecuteQuery({
		dataSource,
		dimensions: dimensions?.map(prepareDimension),
		measures: measures,
		filters: filters,
	});
	if (isLoading) {
		return <div>Loading...</div>;
	}
	if (isError) {
		return <div>Error</div>;
	}
	if (data) {
		return <BarChart dataSet={data} dataOptions={dataOptions}/>
	}
	return null;
}

const Chart = ({isLoading, isError, data, dataOptions}: Pick<ChartProps, 'dataOptions'> & {
	data: any,
	isLoading?: boolean,
	isError?: boolean
}) => {
	if (isLoading) {
		return <div>Loading...</div>;
	}
	if (isError) {
		return <div>Error</div>;
	}
	if (data) {
		return <BarChart dataSet={data} dataOptions={dataOptions}/>
	}
}

export const useChart = ({
							 dataSource,
							 dimensions,
							 measures = [],
							 filters = [],
							 dataOptions
						 }: ChartProps) => {
	const {data, isLoading, isError} = useExecuteQuery({
		dataSource,
		dimensions: dimensions?.map(prepareDimension),
		measures: measures,
		filters: filters,
	});

	const copyChartCode = () => {
		return '<BarChart dataSet={data} dataOptions={dataOptions}/>';
	}

	return {
		copy: copyChartCode,
		component: () => <Chart isError={isError} isLoading={isError} dataOptions={dataOptions} data={data}/>
	}
}
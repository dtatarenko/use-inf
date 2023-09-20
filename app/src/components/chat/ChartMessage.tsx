import React from 'react';
import {AreaChart, ChartType, LineChart, PieChart, useExecuteQuery} from "@sisense/sdk-ui";
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
  chartType?: ChartType,

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
                 chartType,
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
    switch(chartType) {
      case 'area':
        return <AreaChart dataSet={data} dataOptions={dataOptions}/>
      case 'pie':
        return <PieChart dataSet={data} dataOptions={dataOptions}/>
      case 'line':
        return <LineChart dataSet={data} dataOptions={dataOptions}/>
      default:
		    return <BarChart dataSet={data} dataOptions={dataOptions}/>
    }
	}
	return null;
}
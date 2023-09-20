import {createAttribute, Filter, Measure} from '@sisense/sdk-data';
import {BarChart, CartesianChartDataOptions, useExecuteQuery} from '@sisense/sdk-ui';
import React, {ReactNode} from 'react';

export interface Dimension {
	name: string,
	type: string,
	expression: string,
}

export interface ExecuteQueryProps {
	dataSource: string;
	dimensions?: Dimension[];
	measures?: Measure[],
	filters?: Filter[],

	children: (data: any) => ReactNode
}


function prepareDimension(json: any) {
	return createAttribute(json)
}

export const ExecuteQuery = ({
								 dataSource,
								 dimensions,
								 measures = [],
								 filters = [],

	children
							 } : ExecuteQueryProps
) => {
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
		return children(data);
	}
}
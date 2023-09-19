import React from 'react';
import {useExecuteQuery} from "@sisense/sdk-ui";
import * as DM from "../sample-ecommerce";
import {measures, filters, createAttribute} from "@sisense/sdk-data";
import {Table, TableDataOptions} from "@sisense/sdk-ui";
import {DataSource, Attribute, Filter, Measure} from '@sisense/sdk-data';

// import {TableDataOptions} from '@sisense/sdk-ui/dist/chart-data-options/types';

export interface Dimension {
	name: string,
	type: string,
	expression: string,
}

export interface TableProps {
	dataSource: string;
	filters?: Filter[],
	columns: TableDataOptions["columns"]
}

function prepareDimension(json: any) {
	return createAttribute(json)
}

export const TableMessage = ({
								 dataSource,
								 filters = [],
								 columns
							 }: TableProps) => {
	const dimensions = columns.map(prepareDimension);

	const {data, isLoading, isError} = useExecuteQuery({
		dataSource,
		dimensions,
		filters: filters,
	});
	if (isLoading) {
		return <div>Loading...</div>;
	}
	if (isError) {
		return <div>Error</div>;
	}
	const options = {
		columns: dimensions
	}
	if (data) {
		return <Table dataSet={data} dataOptions={options}/>
	}
	return null;
}
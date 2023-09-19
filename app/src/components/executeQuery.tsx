import React from 'react';
import { useExecuteQuery } from "@sisense/sdk-ui";
import * as DM from "./sample-ecommerce";
import { BarChart, CartesianChartDataOptions } from "@sisense/sdk-ui";
import { 
  measures, 
  filters,
  DataSource, 
  Attribute, 
  Filter, 
  Measure, 
  createDimension, 
  createAttribute 
} from '@sisense/sdk-data';

type Dimensions = [{
  name: string,
  attrs: Attribute
}]

export type executeQueryParams = {
  dataModel: {
    DataSource: DataSource
    dimensions: Dimensions,
    dataOptions: CartesianChartDataOptions,
    
    measures?: Measures,
    filters?: Filters,
  },
  
  chartType?: string
  errorMsg?: string
  loadingMsg?: string,
}

export type Measures = [{
  type: string,
  attrName: Attribute
}] 

export type Filters = [{
  type: string,
  attrName: Attribute,
  value: number
}] 

const prepareDimensions = (dimenstions: Dimensions) => dimenstions.map(dimenstion => 
  createDimension({
      name: dimenstion.name,
      [dimenstion.attrs.name]: createAttribute({
        name: dimenstion.attrs.name,
        type: dimenstion.attrs.type,
        expression: dimenstion.attrs.expression,
      })
  }))

const prepareMeasures = (measuresArr: Measures) => measuresArr.map(measure => {
  switch(measure.type) {
    case 'sum':
      return measures.sum(measure.attrName);
    default:
      return measures.sum(measure.attrName);
  }
})

const prepareFilters = (filtersArr: Filters) => filtersArr.map(filter => {
  switch(filter.type) {
    case 'greaterThan':
      return filters.greaterThan(filter.attrName, filter.value);
    default:
      return filters.greaterThan(filter.attrName, filter.value);
  }
})

export const executeQuery = ({
  dataModel,
  chartType,
  errorMsg = 'Error',
  loadingMsg = 'Loading...',
}: executeQueryParams) => {
  
  const queryObject = {
      dataSource: dataModel.DataSource,
      measures: (dataModel.measures 
      && dataModel.measures.length && [...prepareMeasures(dataModel.measures)]) || [],
      dimensions: [...prepareDimensions(dataModel.dimensions)],
      filters: (dataModel.filters 
        && dataModel.filters.length && [...prepareFilters(dataModel.filters)]) || [],
    }

    const { data, isLoading, isError } = useExecuteQuery(queryObject);
      if (isLoading) {
        return <div>{loadingMsg}</div>;
      }
      if (isError) {
        return <div>{errorMsg}</div>;
      }
      if (data) {
        return <BarChart dataSet={data} dataOptions={dataModel.dataOptions}/>
      }
      return null;
}
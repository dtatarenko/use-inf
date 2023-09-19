import React from 'react';
import { useExecuteQuery } from "@sisense/sdk-ui";
import * as DM from "./sample-ecommerce";
import { measures, filters } from "@sisense/sdk-data";
import { BarChart, CartesianChartDataOptions } from "@sisense/sdk-ui";
import { DataSource, Attribute, Filter, Measure } from '@sisense/sdk-data';

export type executeQueryParams = {
  dataModel?: {
    DataSource?: string
  },
  dimensions?: Attribute[],
  dataOptions?: CartesianChartDataOptions,
  
  measures?: Measure[],
  filters?: Filter[],
  chartType?: string
  errorMsg?: string
  loadingMsg?: string,
}


export const executeQuery = ({
  dataModel = DM,
  dimensions = [DM.Commerce.Gender, DM.Commerce.Quantity, DM.Commerce.Revenue],
  dataOptions = {
    "category":[
       {
          "name":"Gender",
          "type":"string"
       }
    ],
    "value":[
       {
          "name":"Quantity",
          "aggregation":"sum"
       },
       {
          "name":"Revenue",
          "aggregation":"sum"
       }
    ],
    "breakBy":[]
  },
  measures = [],
  filters = [],
  chartType,
  errorMsg = 'Error',
  loadingMsg = 'Loading...',
}: executeQueryParams) => {
    const { data, isLoading, isError } = useExecuteQuery({
        dataSource: dataModel.DataSource,
        dimensions: dimensions,
        measures: measures,
        filters: filters,
      });
      if (isLoading) {
        return <div>{loadingMsg}</div>;
      }
      if (isError) {
        return <div>{errorMsg}</div>;
      }
      if (data) {
        return <BarChart dataSet={data} dataOptions={dataOptions}/>
      }
      return null;
}
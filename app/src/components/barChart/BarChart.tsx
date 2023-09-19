import { BarChart } from "@sisense/sdk-ui";
import { DimensionalQueryClient } from "@sisense/sdk-query-client";
import { exampleData } from "./data";

export function BarChartExample() {

  return (
    <BarChart dataSet={exampleData.data}
            dataOptions={{
              category: [exampleData.years],
              value: [exampleData.quantity, exampleData.units],
              breakBy: [],
            }}
          />
  );
}

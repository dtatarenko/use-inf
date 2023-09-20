import {TableProps} from '../TableMessage';
import {ChartProps} from '../ChartMessage';

export type NlqVariation = 'CSDK' | 'cJAQL' | 'JAQL' | 'Infusion' | 'SimplyAsk';
export type EndpointDescription = {
  endpoint: string;
  type: NlqVariation;
  authToken?: string;
};

export interface NLQProvider {
	request: (message: string) => Promise<QQResponse>;
}
export type ChartType = 'bar'|'pie'|'area'|'line';
export interface QQResponse {
	table?: TableProps
	chart?: ChartProps;
  chartType?: ChartType;
	message?: string
	debug?: any
}
import {TableProps} from '../TableMessage';
import {ChartProps} from '../ChartMessage';

export interface NLQProvider {
	request: (message: string) => Promise<QQResponse>;
}

interface QQResponse {
	table?: TableProps
	chart?: ChartProps;
	message?: string
	debug?: any
}
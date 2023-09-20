export type cJAQLClause = {[fieldName: string]: {operator: '>'|'<'|'='|'!='|'>='|'<='|'like'|'in'|'exclude', value: string}};
export type cJAQLCondition = cJAQLClause | {and?: cJAQLCondition[], or?:cJAQLCondition[]};
export type cJAQL = {
	datasource: string,
	dimension: string,
	groupBy?: string | string[],
	orderBy?: {[fieldName: string]: "desc" | "asc"}[]|{[fieldName: string]: "desc" | "asc"},
	offset?: number,
	limit?: number,
	aggregations?: {[fieldName: string]: 'first'|'avg'|'sum'|'count'}[],
	conditions?: cJAQLCondition,
  fields?: string[],
  display?: 'table'|'barchart'|'piechart'|'areachart',
};
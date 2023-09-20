export type cJAQLClause = {[fieldName: string]: {operator: '>'|'<'|'='|'!='|'>='|'<='|'like'|'in'|'exclude', value: string}};
export type cJAQLCondition = cJAQLClause | {and?: cJAQLCondition[], or?:cJAQLCondition[]};
export type cJAQL = {
	dimension: string,
	groupBy?: string,
	orderBy?: {[fieldName: string]: "desc" | "ask"}[],
	offset?: number,
	limit?: number,
	aggregations?: {[fieldName: string]: 'first'|'avg'|'sum'|'count'}[],
	conditions?: cJAQLCondition,
};
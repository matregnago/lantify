import { and, eq, sql } from "@repo/database";
import * as s from "@repo/database/schema";

export function buildStatsWhere(opts: {
	steamId?: string;
	date?: string;
	steamIdColumn: any;
	dateColumn?: any;
	extra?: any[];
}) {
	const { steamId, date = "all", steamIdColumn, dateColumn, extra } = opts;

	const conditions: any[] = [];

	if (steamId) conditions.push(eq(steamIdColumn, steamId));

	if (date !== "all") {
		if (!dateColumn)
			throw new Error("dateColumn is required when date != 'all'");
		conditions.push(
			sql`to_char(${dateColumn}::timestamp, 'Mon YYYY') = ${date}`,
		);
	}

	if (extra?.length) conditions.push(...extra);

	if (conditions.length === 0) return sql`true`;
	if (conditions.length === 1) return conditions[0];
	return and(...conditions);
}

export function withMatchJoinIfDate<TQuery extends { innerJoin: Function }>(
	base: TQuery,
	date: string,
	matchIdColumn: any,
) {
	return date === "all"
		? base
		: (base as any).innerJoin(s.matches, eq(s.matches.id, matchIdColumn));
}

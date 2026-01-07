import "dotenv/config";
import {
	and,
	asc,
	avg,
	count,
	countDistinct,
	DrizzleQueryError,
	desc,
	eq,
	gte,
	inArray,
	isNotNull,
	lte,
	ne,
	SQL,
	sql,
	sum,
} from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import * as pgCore from "drizzle-orm/pg-core";
import * as schema from "./db/schema";

export const db = drizzle(process.env.DATABASE_URL!, { schema });

// ✅ export it as a real value (prevents undefined at runtime)
export const alias = pgCore.alias;
export const unionAll = pgCore.unionAll;

export {
	eq,
	asc,
	desc,
	avg,
	sum,
	sql,
	count,
	and,
	inArray,
	countDistinct,
	gte,
	lte,
	ne,
	isNotNull,
	SQL,
	DrizzleQueryError,
};

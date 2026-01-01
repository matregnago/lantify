import "dotenv/config";
import {
	and,
	asc,
	avg,
	count,
	DrizzleQueryError,
	desc,
	eq,
	inArray,
	sql,
	sum,
} from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./db/schema";

export const db = drizzle(process.env.DATABASE_URL!, { schema });
export { eq, asc, desc, avg, sum, sql, count, and, inArray, DrizzleQueryError };

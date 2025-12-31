import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import {
  type SQL,
  eq,
  asc,
  desc,
  avg,
  sum,
  sql,
  count,
  DrizzleQueryError,
  inArray,
  and,
} from "drizzle-orm";
import * as schema from "./db/schema";

export const db = drizzle(process.env.DATABASE_URL!, { schema });
export { eq, asc, desc, avg, sum, sql, count, and, inArray, DrizzleQueryError };

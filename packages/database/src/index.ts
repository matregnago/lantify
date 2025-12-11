import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { eq, asc, desc } from "drizzle-orm";
import * as schema from "./db/schema";

export const db = drizzle(process.env.DATABASE_URL!, { schema });
export { eq, asc, desc };

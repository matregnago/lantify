import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { eq, asc, desc } from "drizzle-orm";

export const db = drizzle(process.env.DATABASE_URL!);
export { eq, asc, desc };

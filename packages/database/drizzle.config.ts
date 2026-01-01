import path from "node:path";
import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

config({
	path: path.resolve(__dirname, "../../.env"),
});

if (!process.env.DATABASE_URL) {
	throw new Error("DATABASE_URL is not set");
}

export default defineConfig({
	schema: "./src/db/schema.ts",
	out: "./drizzle",
	dialect: "postgresql",
	dbCredentials: {
		url: process.env.DATABASE_URL,
	},
});

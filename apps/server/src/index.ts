import "./bootstrap";
import { db } from "@repo/database";
import * as schema from "@repo/database/schema";

async function listMatches(request: Bun.BunRequest<"/">) {
  const matches = await db.select().from(schema.matches);

  return Response.json(matches, { status: 200 });
}

async function main() {
  const server = Bun.serve({
    routes: {
      "/": listMatches,
    },

    port: 3333,
  });
  console.log(`API running on ${server.url}`);
}

main();

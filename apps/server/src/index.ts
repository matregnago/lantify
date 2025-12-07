import { config } from "dotenv";
import { join } from "node:path";
import * as schema from "@repo/database/schema";

config({ path: join(import.meta.dir, "../../../.env") });

async function listMatches(request: Bun.BunRequest<"/">) {
  // Importação dinâmica para garantir que o .env já foi carregado
  const { db } = await import("@repo/database");

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

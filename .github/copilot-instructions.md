# Lantify - AI Coding Agent Instructions

## Project Overview
Lantify is a Counter-Strike LAN statistics platform built as a Turborepo monorepo using Bun. It parses CS2 demo files from MatchZy plugin, stores them in PostgreSQL, and displays player/match statistics via a Next.js web app.

## Architecture

### Monorepo Structure
- **apps/parser**: CS2 demo parser using `@akiver/cs-demo-analyzer`. Parses `.dem` files from `demos/` folder, outputs JSON to `output/`, and saves to database
- **apps/web**: Next.js 16 app with React Server Components, TailwindCSS, and Shadcn UI
- **packages/database**: Drizzle ORM schema and database client
- **packages/contracts**: Shared TypeScript types (DTOs) between apps
- **packages/redis**: Redis client for Steam API caching
- **packages/eslint-config**: Shared ESLint configs
- **packages/typescript-config**: Shared TypeScript configs

### Data Flow
1. Parser reads CS2 `.dem` files → analyzes with `@akiver/cs-demo-analyzer` → outputs JSON
2. JSON parsed into database via Drizzle ORM transactions ([save-demo-data.ts](../apps/parser/src/save-demo-data.ts))
3. Web app queries database using Drizzle, enriches with Steam API data (cached in Redis)
4. Server-rendered pages display statistics (Server Components pattern)

### Database Schema
Located at [packages/database/src/db/schema.ts](../packages/database/src/db/schema.ts):
- `matches`: CS2 match metadata (checksum ID, map, date)
- `teams`: Team stats per match (scores by half, winner flag)
- `players`: Extensive player stats (K/D/A, HLTV ratings, clutch stats, utility damage)
- `player_duels`: Head-to-head kill/death tracking between players

Uses Drizzle relations for type-safe joins. All foreign keys cascade on delete.

## Critical Workflows

### Setup & Development
```bash
bun install                    # Install all workspace dependencies
docker compose up -d           # Start PostgreSQL + Redis containers
cd packages/database && bun run db:push  # Push schema to database
cd apps/parser && bun run parse --skip-demo-parse  # Populate DB from existing JSONs
bun run dev                    # Start all apps (turbo dev)
```

### Database Management
```bash
cd packages/database
bun run db:push      # Push schema changes (development)
bun run db:studio    # Open Drizzle Studio (https://local.drizzle.studio)
```

### Parser Usage
```bash
cd apps/parser
bun run parse                    # Parse all .dem files in demos/ folder
bun run parse --skip-demo-parse  # Skip parsing, just import existing output/*.json files
```

## Project-Specific Conventions

### Workspace Package References
Use `@repo/*` for internal packages:
```typescript
import { db, eq } from "@repo/database";
import * as s from "@repo/database/schema";
import { PlayerProfileDTO } from "@repo/contracts";
import { redis } from "@repo/redis";
```

### Environment Configuration
All apps read from root `.env` (never app-specific .env files):
- Parser: Uses [bootstrap.ts](../apps/parser/src/bootstrap.ts) to load `../../.env`
- Web: [next.config.js](../apps/web/next.config.js) loads dotenv from `../../.env`
- Database: [drizzle.config.ts](../packages/database/drizzle.config.ts) loads from `../../.env`

Required vars in `.env.example`: `DATABASE_URL`, `REDIS_URL`, `STEAM_API_KEY`

### Next.js Patterns
- **All pages are Server Components** with `"use server"` directive ([example](../apps/web/app/(public)/profile/[id]/page.tsx))
- Data fetching in API layer at `lib/api/` (not in components)
- No client-side API calls - fetch data in page server component, pass as props
- Shadcn UI components in `components/ui/`
- Route groups: `(public)` for main app routes

### Type Safety
- **Always use Drizzle inferred types**: `typeof schema.table.$inferSelect/Insert`
- DTOs defined in `packages/contracts` extend schema types with relations
- Example: `PlayerProfileDTO` includes aggregated stats + `matchHistory` with nested relations

### Steam API Integration
Steam profiles fetched via [lib/api/steam.ts](../apps/web/lib/api/steam.ts):
- Redis caches profiles for 12 hours (43200s TTL)
- `mget`/`mset` for bulk operations
- Always check cache before API calls

### Parser Transactions
Demo data import uses single transaction ([save-demo-data.ts](../apps/parser/src/save-demo-data.ts)):
1. Insert match → get `matchId`
2. Insert teamA, teamB → get team IDs
3. Bulk insert all players with team references
4. Rollback on any failure (maintains data integrity)

Use `JSONbig` library for parsing JSON with BigInt Steam IDs (stored as strings).

## Common Tasks

### Adding New Player Stats
1. Add column to `players` table in [schema.ts](../packages/database/src/db/schema.ts)
2. Run `bun run db:push` in packages/database
3. Update parser mapping in [save-demo-data.ts](../apps/parser/src/save-demo-data.ts)
4. Update DTOs in [packages/contracts/index.ts](../packages/contracts/index.ts)
5. Update query aggregations in [lib/api/player.ts](../apps/web/lib/api/player.ts)

### Creating New Pages
1. Add route in `apps/web/app/(public)/[route]/page.tsx`
2. Use `"use server"` directive
3. Fetch data in page component (async), pass to client components as props
4. Extract reusable logic to `lib/api/`

## Key Files
- [apps/parser/src/index.ts](../apps/parser/src/index.ts): Demo parsing orchestration
- [apps/web/lib/api/player.ts](../apps/web/lib/api/player.ts): Complex Drizzle aggregation queries
- [packages/database/src/db/schema.ts](../packages/database/src/db/schema.ts): Single source of truth for data model
- [turbo.json](../turbo.json): Task dependencies and caching config
- [docker-compose.yml](../docker-compose.yml): Local PostgreSQL + Redis setup

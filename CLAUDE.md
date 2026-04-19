# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository layout

pnpm workspace + Turbo monorepo (`pnpm-workspace.yaml`, `turbo.json`). Three workspace groups:

- `apps/web` — Next.js 15 App Router (React 19, Turbopack, Tailwind v4). Package: `@doemedia/web`.
- `workers` — Long-running Node process (BullMQ + ioredis) for Meta syncs and AI pipelines. Package: `@doemedia/workers`.
- `packages/*` — Shared internal libraries consumed by both web and workers via `workspace:*`:
  - `@doemedia/db` — Drizzle ORM schemas (PostgreSQL), query helpers, `drizzle-kit` config.
  - `@doemedia/ai` — Claude + Gemini clients, prompt builders, Zod output schemas, multi-stage pipelines.
  - `@doemedia/meta-api` — Meta Marketing API wrapper (`facebook-nodejs-business-sdk`).
  - `@doemedia/ad-research` — Ad Library exploration, trend analysis, DNA multiplier.
  - `@doemedia/shared` — Types, constants (including `AI_MODELS`), Zod validators shared across the graph.

Package manager is pinned: `pnpm@10.33.0`. Internal packages export TypeScript directly from `src/` (`"main": "./src/index.ts"`), so the Next.js app lists them all under `transpilePackages` in `apps/web/next.config.ts` — add any new internal package there.

## Common commands

Run from repo root unless noted. Turbo fans out to workspaces.

```bash
pnpm install              # install all workspaces
pnpm dev                  # turbo dev (runs next dev --turbopack for web, tsx watch for workers)
pnpm build                # turbo build (type-checks + builds all)
pnpm lint                 # turbo lint (next lint for web; tsc --noEmit for libs/workers)
pnpm test                 # turbo test (no tests wired yet — task exists for future use)
```

Database (Drizzle Kit, run from `packages/db` or via root):

```bash
pnpm db:generate          # generate SQL migrations from schema changes
pnpm db:push              # push schema directly to DB (dev)
pnpm db:migrate           # apply generated migrations
pnpm --filter @doemedia/db db:studio   # open Drizzle Studio
```

Single-target commands (bypass Turbo):

```bash
pnpm --filter @doemedia/web dev
pnpm --filter @doemedia/workers dev
pnpm --filter @doemedia/ai lint        # tsc --noEmit for a single package
```

Vercel deploys only the web app: `turbo build --filter=@doemedia/web` (see `vercel.json`). The `workers` process is deployed separately (not on Vercel) and needs `REDIS_URL`.

## Architecture: the creative strategy pipeline

This is the core domain flow — reading a single file won't reveal it.

1. **Meta sync (cron, every 6h).** `workers/src/schedulers.ts` upserts a repeating `sync-all-accounts` job on the `meta-sync` queue. That fans out per-account `sync-meta-insights` jobs processed by `workers/src/jobs/sync-meta-insights.ts`, which calls `@doemedia/meta-api` `fetchDailyInsights` → `transformInsightRow` → upserts into `ad_insights_daily`. The `META_SYNC_LOOKBACK_DAYS` (7) window re-pulls recent days so attribution updates land.

2. **Weekly AI analysis (cron, Mon 6am).** `ai-analysis` queue; batch analysis runner is currently a stub (`workers/src/index.ts`).

3. **On-demand full strategy.** The canonical multi-stage pipeline lives in `packages/ai/src/pipelines/full-strategy.ts` (`runFullStrategyPipeline`). Four stages, model-routed via `AI_MODELS` in `@doemedia/shared/constants`:
   - Stage 1 — Performance analysis (Claude Sonnet, `ANALYSIS_STRATEGY`, temp 0.3) → `AnalysisOutput`.
   - Stage 2 — Strategy + briefs (Claude Sonnet, temp 0.5) → `StrategyOutput`.
   - Stage 3 — Copy per brief (Claude **Opus**, `COPY_CREATIVE`, temp 0.8, `COPY_VARIANTS_PER_BRIEF` variants) → `CopyOutput`.
   - Stage 4 — Visual concepts for IMAGE/CAROUSEL briefs (Gemini, `VISUAL`).

   Structured outputs use Claude's tool-use forcing (`tool_choice: { type: "tool", name: "output" }`) in `generateStructured` (`packages/ai/src/claude-client.ts`). Each stage has a paired Zod schema in `packages/ai/src/schemas/` and a prompt builder in `packages/ai/src/prompts/`.

   The worker job `workers/src/jobs/generate-strategy.ts` is a simpler text-only variant kept for the `ai-generation` queue; the full pipeline is the one to extend.

4. **Model routing rule.** Opus = high-leverage copy/creative. Sonnet = analysis + strategy. Gemini = anything visual/video. Always reference `AI_MODELS.*` — don't hardcode model IDs.

## Database conventions

- Schema entrypoint: `packages/db/src/schema/index.ts` — every new table must be re-exported here; `drizzle-kit` reads only this file (`packages/db/drizzle.config.ts`).
- `db` is a lazy **Proxy** (`packages/db/src/client.ts`). Importing it doesn't open a connection; access triggers `getDb()` which reads `DATABASE_URL` at first use. This is why Next.js routes and worker jobs can safely import `db` at module scope.
- Query helpers live in `packages/db/src/queries/` and are re-exported from the package root — prefer adding there over inlining Drizzle queries in route handlers.
- Per-client KPI targets (`cacTarget`, `roasTarget`, `merTarget`, `growthMode`, `funnelMix`, etc.) on `clients` are consumed by AI prompts to define "good" for each client — keep them populated when touching client creation flows.

## Web app (apps/web)

- Next.js App Router. Route groups: `(auth)` for login, `(dashboard)` for authenticated pages. `src/app/page.tsx` redirects `/` → `/clients`.
- Auth: NextAuth v5 (`src/lib/auth.ts`) with Google OAuth + a dev-only Credentials provider (password `demo`, `NODE_ENV=development` only). Optional domain allowlist via `ALLOWED_EMAIL_DOMAIN`.
- Route protection: `src/middleware.ts` re-exports `auth` as middleware with an explicit matcher — add new protected top-level paths to that matcher array, not to the middleware body.
- Path alias: `@/*` → `apps/web/src/*` (`apps/web/tsconfig.json`).
- API routes under `src/app/api/*` validate input with Zod schemas from `@doemedia/shared/validators`.
- Root layout forces `className="dark"` on `<html>`.

## Workers (workers/)

- Three BullMQ queues, each with a dedicated `Worker` and tuned concurrency (`workers/src/index.ts`): `meta-sync` (5), `ai-analysis` (2, cost-limited), `ai-generation` (3).
- Job dispatch is a `switch (job.name)` per queue — add new job names there and wire to a handler in `workers/src/jobs/`.
- Schedulers use `upsertJobScheduler` so restarts don't duplicate cron entries (`workers/src/schedulers.ts`).
- Graceful shutdown on SIGTERM/SIGINT closes all three workers.

## Env + secrets

`.env.example` documents the full set. Minimum for local dev: `DATABASE_URL` (Neon works), `NEXTAUTH_SECRET`, and whichever AI keys (`ANTHROPIC_API_KEY`, `GOOGLE_AI_API_KEY`) the feature needs. `REDIS_URL` is only required for the `workers` process. `TOKEN_ENCRYPTION_KEY` is reserved for Meta token encryption — note that `packages/meta-api/src/client.ts` `encryptToken`/`decryptToken` are still TODO stubs (tokens are currently stored as-is).

## Conventions worth keeping

- Always consume constants from `@doemedia/shared/constants` (lookback windows, cadences, `AI_MODELS`) rather than re-defining numbers inline — they're tuned for the domain.
- New shared types/validators belong in `@doemedia/shared`, not duplicated per app.
- When adding a DB table: create the schema file, export it from `schema/index.ts`, run `pnpm db:generate`, commit the generated SQL under `packages/db/drizzle/`.
- When adding a new internal package, list it in `apps/web/next.config.ts` `transpilePackages` or Next.js will fail to resolve its TS source.

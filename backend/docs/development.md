# Backend development workflow

## Prerequisites

- Node.js 20+ (for `node --experimental-strip-types` style ESM TS execution; `tsx` works on older too).
- A reachable PostgreSQL 17 instance. Local Postgres is the easiest path; any managed provider that gives you a `DATABASE_URL` works too. The project deliberately stays away from AWS RDS so you don't have to deal with VPCs / security groups / serverless wiring for a learning sandbox.
- A `.env` file alongside `package.json`.

## Environment variables

| Variable | Required | Used by | Notes |
|----------|----------|---------|-------|
| `DATABASE_URL` | yes | [`config/db.ts`](../config/db.ts), [`drizzle.config.ts`](../drizzle.config.ts) | `postgres://user:pass@host:5432/dbname` (append `?sslmode=require` for managed providers that require TLS) |
| `PORT` | no | [`server.ts`](../server.ts) | Default `3000` |
| `FRONTEND_ORIGIN` | no | [`server.ts`](../server.ts) (CORS) | Default `http://localhost:5173` |
| `NODE_ENV` | no | [`utils.ts`](../utils.ts) | Toggles the `Secure` cookie flag (`true` only in `production`) |
| `JWT_SECRET` | yes (legacy) | [`server.ts`](../server.ts) startup check | The auth flow no longer signs JWTs but the boot-time `if (!process.env.JWT_SECRET) throw ...` check is still in place. Set to any non-empty value. Remove the check when convenient. |

Example minimum `.env`:

```bash
DATABASE_URL=postgres://postgres:postgres@localhost:5432/activity_tracker
JWT_SECRET=dev-only-not-used-anywhere
FRONTEND_ORIGIN=http://localhost:5173
```

Don't commit `.env`. The repo's `.gitignore` already covers it.

## Scripts

| Script | What |
|--------|------|
| `npm run dev` | `tsx watch server.ts` — restarts on file changes, no compile step. Best for normal dev. |
| `npm start` | `node server.ts` — relies on Node's TS support; no watching. Use for production-style runs only. |
| `npm run seed` | `tsx scripts/seed.ts` — see [`database.md`](database.md) |
| `npm run typecheck` | `tsc --noEmit` — fast type check, no emit (no JS output) |
| `npm run clean:install` | Wipe `node_modules` + `package-lock.json` and reinstall |

## First-time setup

```bash
cd backend
npm install
cat > .env <<'EOF'
DATABASE_URL=postgres://postgres:postgres@localhost:5432/activity_tracker
JWT_SECRET=dev
FRONTEND_ORIGIN=http://localhost:5173
EOF

# Create the database (one-time)
createdb activity_tracker

# Push the schema (no migration files needed for first run)
npx drizzle-kit push

# Optional: load fake data
npm run seed

# Start it
npm run dev
```

Boot output should look like:

```
Database connection check: connected
Server is running on port 3000
```

If you see `not connected (...)` instead, the most common causes are:

- `DATABASE_URL` typo (port wrong, password URL-encoding issues with `@` / `:` / `/`).
- Postgres isn't accepting connections on the URL's host (`pg_hba.conf` restrictions).
- TLS mismatch with a managed Postgres — try appending `?sslmode=no-verify` for a quick check (and configure proper TLS before any non-throwaway use).

## Hot reload behaviour

`tsx watch` watches the entire backend tree. Changes to `controllers/`, `routes/`, `middleware/`, `utils.ts`, etc. trigger a full process restart (~200-500ms). Any in-flight requests get connection-reset.

Schema changes don't take effect until you also run `npx drizzle-kit push` (or `generate` + `migrate`). The `db.execute(sql\`select 1\`)` boot probe doesn't compare schema, only connectivity.

## Schema migrations workflow

For meaningful schema changes during dev:

```bash
# 1. Edit config/schema.ts
# 2. Generate a migration based on the diff
npx drizzle-kit generate

# 3. Inspect ./drizzle/<timestamp>_<name>.sql
#    Make sure it does what you expect (drizzle is conservative but not psychic)

# 4. Apply it
npx drizzle-kit migrate
```

Commit the generated SQL alongside the schema change so the history is self-contained. For local-only experimentation, `npx drizzle-kit push` skips the migration file and applies the diff directly.

## Debugging tips

- **`morgan('dev')`** prints `METHOD /path STATUS time` for every request. Combined with the rate-limited `429`s being logged, this is usually enough.
- **DB query inspection**: Drizzle has a `logger` option in the `drizzle(pool, { logger: true })` initializer if you want to see emitted SQL. Add it to [`config/db.ts`](../config/db.ts) temporarily.
- **Cookie inspection**: in `curl`, use `-c cookies.txt` to capture and `-b cookies.txt` to send. In Chrome DevTools, look at the **Application > Cookies** panel for `localhost:3000`.
- **Session inspection**: `select id, "userId", "expiresAt", "revokedAt", "deviceName" from sessions order by "createdAt" desc limit 10;` shows what the server thinks is active.

## Adding a new endpoint

1. Add (or extend) a table in [`config/schema.ts`](../config/schema.ts).
2. `npx drizzle-kit push` (dev) or `generate` + `migrate` (anything you'll commit).
3. Add a controller function in `controllers/<resource>.ts`.
4. Wire it in `routes/<resource>.ts` with the right middleware.
5. If it's a new resource, create the router file and mount it in [`server.ts`](../server.ts).
6. Add a row to [`api-reference.md`](api-reference.md).
7. Add the matching client wrapper in `frontend/src/services/<resource>.ts` (with an optional `signal?: AbortSignal` for read endpoints — see [`../../frontend/docs/data-fetching.md`](../../frontend/docs/data-fetching.md)).

## Production-ish checklist (deliberate non-goals)

If you ever wanted to ship this:

- Replace the boot-time `JWT_SECRET` check with `DATABASE_URL` (the actual required secret).
- Tighten rate limits — auth endpoints especially (try 5 / minute / IP for `/api/auth/login`).
- Add `helmet` CSP config.
- Add a global error-handling middleware (`(err, req, res, next) => ...`) and switch controllers to `next(err)`.
- Add request-ID middleware and structured logging.
- Add health endpoint at `/healthz` distinct from `/api/...`.
- Configure TLS for the `pg.Pool`.
- Add CSRF tokens (cookie-based + double-submit) for any state-changing endpoint that could be reached cross-site.
- Schema validation at the HTTP boundary (zod) instead of `as { x: string }` casts in controllers.
- Tests. There are none.

# Activity Tracker — Backend

REST-style HTTP API for the activity-tracker learning project. Express 5 + Drizzle ORM on top of PostgreSQL, with **DB-backed cookie sessions** instead of JWT or `Auth.js`.

> Part of the wider learning sandbox at [`../README.md`](../README.md). Production hardening is intentionally absent — this code is meant to be readable, not bulletproof.

## Stack

| Area | Choice |
|------|--------|
| Runtime | Node.js (ESM, `"type": "module"`) |
| Language | TypeScript 6 (`module`: `ESNext`, `moduleResolution`: `Bundler`, `strict`, `noEmit`) |
| Dev runner | `tsx watch` (no build step in dev) |
| HTTP | Express 5 |
| Database client | `pg` + Drizzle ORM (`drizzle-orm/node-postgres`) |
| Migrations / codegen | `drizzle-kit` (`drizzle.config.ts`) |
| Auth | DB-backed cookie sessions (random 32-byte token + SHA-256 hash, `cookie-parser`), `bcrypt` for passwords |
| Security / observability | `helmet`, `express-rate-limit`, `morgan`, `cors` |

> `jsonwebtoken` and `@types/express-session` are still listed in `package.json` but **no longer used** by the runtime — auth was migrated from JWTs to server-side sessions and from `express-session` to a custom `sessions` table.

## Layout

```text
backend/
├── server.ts                 Express bootstrapping + middleware order
├── config/
│   ├── db.ts                 pg Pool + drizzle client (singleton)
│   └── schema.ts             users / teams / tasks / sessions / join_requests + indexes
├── controllers/              one file per resource — pure handler functions
│   ├── auth.ts
│   ├── tasks.ts
│   ├── teams.ts
│   ├── joinRequests.ts
│   └── users.ts
├── routes/                   thin route -> controller wiring
├── middleware/index.ts       isSignedIn, isAdmin
├── scripts/seed.ts           idempotent dev seeder (npm run seed)
├── types/express.d.ts        Request augmentation (req.user, req.authSession)
├── consts.ts, utils.ts, types.ts
├── drizzle.config.ts
└── docs/                     deep-dive docs (one topic per file)
```

## Documentation

Detailed walkthroughs live under [`docs/`](docs/):

| File | What it covers |
|------|----------------|
| [`docs/architecture.md`](docs/architecture.md) | Request lifecycle, layered design, why each piece exists |
| [`docs/auth-and-sessions.md`](docs/auth-and-sessions.md) | Cookie + DB session model, why not JWT / Auth.js, attack surface |
| [`docs/database.md`](docs/database.md) | Drizzle schema, indexes, enums, `drizzle-kit` workflow, hosting notes |
| [`docs/api-reference.md`](docs/api-reference.md) | Every endpoint with auth requirement + request/response shapes |
| [`docs/middleware.md`](docs/middleware.md) | Global middleware order, `isSignedIn` / `isAdmin`, rate limiting, CORS |
| [`docs/development.md`](docs/development.md) | Env vars, scripts, dev workflow, seeding |

## Quick start

```bash
npm install
cp .env .env  # ensure DATABASE_URL etc. are set — see docs/development.md
npm run dev   # tsx watch server.ts -> http://localhost:3000
```

Smoke-test endpoints once running:

```bash
# Public health-ish: server logs "connected" on boot if DATABASE_URL is good
curl http://localhost:3000/api/teams

# Hit the auth surface
curl -X POST http://localhost:3000/api/auth/register \
  -H 'content-type: application/json' \
  -d '{"email":"me@example.com","password":"hunter22","confirmPassword":"hunter22"}' \
  -c cookies.txt
```

The full endpoint table lives in [`docs/api-reference.md`](docs/api-reference.md).

## Scripts

| Script | What it does |
|--------|--------------|
| `npm run dev` | `tsx watch server.ts` — auto-restart on file change, no compile step |
| `npm start` | `node server.ts` — Node runs `.ts` directly via the type-stripping flag (Node 22+) |
| `npm run seed` | `tsx scripts/seed.ts` — idempotent fake-data seeder |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run clean:install` | Wipe `node_modules` + lockfile, then `npm install` |

## Known issues / debt

- `JWT_SECRET` is still required at boot (`server.ts`) even though sessions don't sign anything. Safe to remove the check once the env file is cleaned up.
- `routes/teams.ts` `PUT /:teamId/leave` is **not** behind `isSignedIn`. Should be — it can flip another user's `teamId` if you forge the request. Left as a learning exercise / TODO.
- `routes/joinRequests.ts` `POST /` (`requestJoinTeam`) is also unauthenticated. Same caveat.
- See [`docs/api-reference.md`](docs/api-reference.md) for the per-route auth posture.

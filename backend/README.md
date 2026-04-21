# Activity tracker — backend

REST-style API for the activity tracker learning project: tasks, users, and JWT-based auth, built with Express and Drizzle.

## Database: AWS RDS (PostgreSQL 17)

**The production data store is Amazon RDS running PostgreSQL 17.** The application talks to RDS over SQL using the `pg` driver and Drizzle ORM. Connection configuration lives in `config/db.ts`: a single `DATABASE_URL` (typical for RDS) with TLS enabled (`ssl.rejectUnauthorized: false` is common for RDS-managed certs; tighten certificate pinning or CA configuration for stricter production setups).

Local or other Postgres instances can be used for development as long as the URL and SSL settings match your environment.

## Stack

| Area | Choice |
|------|--------|
| Runtime | Node.js (CommonJS, `"type": "commonjs"`) |
| Language | TypeScript 6, strict `tsconfig.json` (`module` / `moduleResolution`: `NodeNext`, `moduleDetection`: `force`) |
| HTTP | Express 5 |
| Database client | `pg` + **Drizzle ORM** (`drizzle-orm`, `drizzle-orm/node-postgres`) |
| Migrations / codegen | `drizzle-kit` (`drizzle.config.ts`) |
| Auth | `jsonwebtoken`, `bcrypt`, `express-session` (secret from `JWT_SECRET`) |
| Security / observability | `helmet`, `express-rate-limit`, `morgan`, `cors` |

## Current progress

- **Server (`server.ts`)**: Express app with CORS, Helmet, rate limiting (40 requests / 5 minutes per IP), Morgan (`dev`), `express.json()`, and `express-session`. Routers mounted at `/api/tasks` and `/api/auth`.
- **Persistence**: Drizzle `db` export from `config/db.ts` (connection pool + SSL). Schema in `config/schema.ts` defines **`users`** (email, hashed password, `role` enum `admin` \| `user`, timestamps, unique index on email, indexes on role and `createdAt`) and **`tasks`** (FK `userId` → `users`, title, description, optional `dueDate`, `priority` enum, timestamps, indexes on `userId`, `dueDate`, `priority`).
- **Tasks API (`routes/tasks.ts`, `controllers/tasks.ts`)**: POST `/`, GET `/`, GET `/:id`, GET `/user/:userId`, PUT `/:id`, DELETE `/:id` — wired to Drizzle queries and guarded assumptions on `req.user` for ownership checks.
- **Auth (`controllers/auth.ts`, `routes/auth.ts`)**: Login and register using Drizzle + bcrypt; JWTs signed with `JWT_SECRET` (claims include `userId` and `role`). `routes/auth.ts` requires `../controllers/auth` and exposes `POST /login` and `POST /register`.
- **Middleware (`middleware/index.ts`)**: `isSignedIn` (Bearer JWT, attaches `user` with `id`, `userId`, `role`) and `isAdmin` (role check on the verified token). Not yet applied globally in `server.ts` — mount on protected routes as you tighten the API.
- **Typing**: `import type` from Express where handlers are typed; `types/express.d.ts` augments `Request.user` for JWT/session data.
- **Drizzle Kit**: `drizzle.config.ts` `schema` entry points at **`./config/schema.ts`**, matching the application schema, so `drizzle-kit` generate/push/migrate targets the same definitions as runtime.

## Layout

```text
backend/
  config/
    db.ts           # Pool + drizzle client (DATABASE_URL, SSL)
    schema.ts       # Drizzle: users, tasks + indexes
  controllers/
    auth.ts         # Login / register + JWT
    tasks.ts        # Task handlers
  middleware/
    index.ts        # JWT isSignedIn, isAdmin
  routes/
    auth.ts
    tasks.ts
  types/
    express.d.ts    # Request.user typing
  server.ts
  drizzle.config.ts
  tsconfig.json
  package.json
```

## Environment variables

| Variable | Used by |
|----------|---------|
| `DATABASE_URL` | `config/db.ts`, `drizzle.config.ts` |
| `JWT_SECRET` | `controllers/auth.ts`, `middleware/index.ts`, `express-session` in `server.ts` |
| `PORT` | `server.ts` (default `3000`) |
| `DATABASE_NAME`, `DATABASE_USER`, `DATABASE_PASSWORD`, `DATABASE_PORT` | `drizzle.config.ts` `dbCredentials` (alongside URL) |

Use a `.env` file locally; do not commit secrets.

## Scripts

- **`npm start`** — runs `nodemon server.ts` (install `nodemon` / dev tooling as in `package.json`).

## Typecheck

```bash
npx tsc --noEmit
```

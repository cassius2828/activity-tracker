# Activity tracker — backend

REST-style API for the activity tracker learning project: tasks, users, and **cookie-based session auth backed by Postgres**, built with Express 5 and Drizzle ORM.

## Database: AWS RDS (PostgreSQL 17)

**The production data store is Amazon RDS running PostgreSQL 17.** The application talks to RDS over SQL using the `pg` driver and Drizzle ORM. Connection configuration lives in `config/db.ts`: a single `DATABASE_URL` (typical for RDS) with TLS enabled (`ssl.rejectUnauthorized: false` is common for RDS-managed certs; tighten certificate pinning or CA configuration for stricter production setups).

Local or other Postgres instances can be used for development as long as the URL and SSL settings match your environment.

## Stack

| Area | Choice |
|------|--------|
| Runtime | Node.js (ESM, `"type": "module"`) |
| Language | TypeScript 6 (`module`: `ESNext`, `moduleResolution`: `Bundler`, `strict`, `noEmit`) |
| Dev runner | `tsx watch` (no build step in dev) |
| HTTP | Express 5 |
| Database client | `pg` + **Drizzle ORM** (`drizzle-orm/node-postgres`) |
| Migrations / codegen | `drizzle-kit` (`drizzle.config.ts`) |
| Auth | **Cookie-based DB sessions** (`crypto` random token + SHA-256 hash, `cookie-parser`), `bcrypt` for passwords |
| Security / observability | `helmet`, `express-rate-limit`, `morgan`, `cors` |

> Note: `jsonwebtoken` and `@types/express-session` are still listed in `package.json` but **no longer used** by the runtime — auth was migrated from JWTs to server-side sessions. They can be removed when convenient.

## Auth & session model

Auth is **session-based**, not JWT-based. The flow:

1. `register` / `login` validate credentials with `bcrypt`.
2. `createSession` (in `utils.ts`) generates a random 32-byte token (`generateSessionToken`), stores its **SHA-256 hash** plus metadata (`userId`, `expiresAt`, `ipAddress`, `userAgent`, `deviceName`) in the `sessions` table, and returns the raw token.
3. `setSessionCookie` writes the raw token to an **httpOnly, `sameSite: "lax"`** cookie named `sessionToken`. `secure` is enabled when `NODE_ENV === "production"`. Lifetime: `SESSION_COOKIE_MAX_AGE_MS` (7 days).
4. On subsequent requests, `isSignedIn` reads the cookie, hashes it, looks up the `sessions` row, rejects expired or revoked rows, loads the user (password stripped), and attaches:
   - `req.user` — `Omit<User, "password">`
   - `req.authSession` — the `sessions` row
5. `logout` deletes the session row by token hash and clears the cookie.

Why this design:

- The DB stores only hashes — leaking a row does not leak usable tokens.
- Sessions can be revoked instantly (set `revokedAt` or delete the row); JWTs can't.
- Per-session metadata (`ipAddress`, `userAgent`, `deviceName`) supports a future "active sessions" view.

## Server (`server.ts`)

Global middleware order:

1. `cors()`
2. `cookieParser()` — required before `isSignedIn` reads `req.cookies.sessionToken`
3. `helmet()`
4. `rateLimit({ windowMs: 5 * 60 * 1000, max: 40 })` — 40 requests / 5 min / IP
5. `morgan("dev")`
6. `express.json()`

Routers:

- `app.use("/api/auth", authRouter)`
- `app.use("/api/tasks", taskRouter)`

Boot guard: throws if `JWT_SECRET` is missing (legacy env check kept for now even though sessions don't use it).

## API

### `/api/auth` (`routes/auth.ts`, `controllers/auth.ts`) — public

| Method | Path        | Body                                       | Notes                                           |
|--------|-------------|--------------------------------------------|-------------------------------------------------|
| POST   | `/login`    | `{ email, password }`                      | Sets `sessionToken` cookie; returns user + session id. Same `401` for unknown email vs wrong password (avoids enumeration). |
| POST   | `/register` | `{ email, password, confirmPassword }`     | Creates user (`bcrypt`, salt rounds = `BCRYPT_SALT_ROUNDS`), then a session, sets cookie. |
| POST   | `/logout`   | —                                          | Deletes session row by token hash, clears cookie. |

### `/api/tasks` (`routes/tasks.ts`, `controllers/tasks.ts`)

| Method | Path             | Auth        | Notes |
|--------|------------------|-------------|-------|
| POST   | `/`              | `isSignedIn` | Creates a task owned by `req.user.id`. Requires `title` and `description`. |
| GET    | `/`              | none        | Returns all tasks (consider restricting). |
| GET    | `/:id`           | none        | One task by id. |
| GET    | `/user/:userId`  | none        | Tasks for a user id. |
| PUT    | `/:id`           | `isSignedIn` | Updates fields and bumps `updatedAt`. |
| DELETE | `/:id`           | `isSignedIn` | Owner or `admin` only (403 otherwise). |

> **Known issue:** `routes/tasks.ts` currently registers `isSignedIn` **after** the controller in the array (`router.post("/", createTask, isSignedIn)`). Express runs handlers in array order, so `req.user` is `undefined` when these handlers run. Fix by reordering to `isSignedIn, createTask` (and similarly for `PUT` / `DELETE`).

## Schema (`config/schema.ts`)

Postgres enums:

- `role`: `admin | user`
- `priority`: `none | low | medium | high`
- `category`: `work | personal | other`
- `status`: `pending | completed | in_progress`

Tables:

- **`users`** — `id` (identity), `email` (unique), `role` (enum, default `user`), `password` (bcrypt hash), `createdAt`, `updatedAt`. Indexes: unique `email`, `role`, `createdAt`.
- **`tasks`** — `id`, `userId` → `users.id` (`onDelete: cascade`), `title`, `description`, optional `dueDate`, `priority`, `category`, `status`, `createdAt`, `updatedAt`. Indexes: `userId`, `dueDate`, `priority`, `category`, `status`.
- **`sessions`** — `id` (UUID), `userId` (FK, cascade), `tokenHash` (SHA-256 of cookie token), `expiresAt`, `revokedAt?`, `ipAddress`, `userAgent`, `deviceName`, `createdAt`, `updatedAt`, `lastUsedAt`. Indexes: `userId`, `tokenHash`, `createdAt`, `updatedAt`, `ipAddress`, `revokedAt`.

`drizzle.config.ts` `schema` points at `./config/schema.ts`, so `drizzle-kit generate / push / migrate` operate against the same definitions runtime uses.

## Middleware (`middleware/index.ts`)

- **`isSignedIn`** — reads `req.cookies.sessionToken`, hashes it, loads the session, validates `expiresAt` and `revokedAt`, loads the user, strips `password`, then sets `req.user` and `req.authSession`. 401 on any failure.
- **`isAdmin`** — must run **after** `isSignedIn`. 401 if no `req.user`, 403 if `req.user.role !== "admin"`. Mount as `router.use(isSignedIn, isAdmin)`.

`req.user` and `req.authSession` are typed via `types/express.d.ts` (Express `Request` augmentation; this app does **not** use `express-session`, so do not confuse `req.authSession` with `req.session`).

## Helpers

- **`utils.ts`** — `hashToken` (SHA-256), `generateSessionToken` (32-byte hex), `createSession`, `setSessionCookie`, `parseId` (route param → integer or `null`).
- **`consts.ts`** — `BCRYPT_SALT_ROUNDS = 10`, `SESSION_COOKIE_MAX_AGE_MS = 7d`.
- **`types.ts`** — Drizzle-inferred app types: `User`, `NewUser`, `Task`, `NewTask`, `DbSession`, `NewDbSession`.

## Layout

```text
backend/
  config/
    db.ts             # Pool + drizzle client (DATABASE_URL, SSL)
    schema.ts         # Drizzle: users, tasks, sessions + indexes
  controllers/
    auth.ts           # login / register / logout — DB sessions + bcrypt
    tasks.ts          # Task CRUD
  middleware/
    index.ts          # isSignedIn (cookie session), isAdmin
  routes/
    auth.ts           # POST /login, /register, /logout
    tasks.ts          # Task routes (see "Known issue" above)
  types/
    express.d.ts      # Request.user, Request.authSession typing
  consts.ts           # BCRYPT_SALT_ROUNDS, SESSION_COOKIE_MAX_AGE_MS
  types.ts            # Drizzle-inferred entity types
  utils.ts            # Session helpers, cookie helper, parseId
  server.ts           # Express wiring, middleware, route mounts
  drizzle.config.ts
  tsconfig.json
  package.json
```

## Environment variables

| Variable | Used by |
|----------|---------|
| `DATABASE_URL` | `config/db.ts`, `drizzle.config.ts` |
| `JWT_SECRET` | `server.ts` (boot-time presence check only — auth no longer signs JWTs) |
| `NODE_ENV` | `utils.ts` (`secure` cookie flag in production) |
| `PORT` | `server.ts` (default `3000`) |
| `DATABASE_NAME`, `DATABASE_USER`, `DATABASE_PASSWORD`, `DATABASE_PORT` | `drizzle.config.ts` `dbCredentials` (alongside URL) |

Use a `.env` file locally; do not commit secrets.

## Scripts

- **`npm run dev`** — `tsx watch server.ts` (auto-restart on file changes; no compile step).
- **`npm start`** — `node server.ts` (production-style entry; compile or switch to `tsx` if you need to run raw TypeScript here).
- **`npm run typecheck`** — `tsc --noEmit`.
- **`npm run clean:install`** — remove `node_modules` and `package-lock.json`, then `npm install` (cross-platform via `npx rimraf`).

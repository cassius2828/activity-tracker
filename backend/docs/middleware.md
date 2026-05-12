# Middleware

Two layers: **global middleware** (registered once in [`server.ts`](../server.ts), applied to every request) and **route middleware** (`isSignedIn` / `isAdmin`, mounted per-route in the routers).

## Global middleware ([`server.ts`](../server.ts))

Order matters. Express runs middleware in the order it's registered.

```ts
app.use(cors({ origin: FRONTEND_ORIGIN, credentials: true }));
app.use(cookieParser());
app.use(helmet());
app.use(morgan("dev"));
app.use(rateLimit({ windowMs: 5 * 60 * 1000, max: 300, ... }));
app.use(express.json());
```

| # | Middleware | Why this position |
|---|-----------|-------------------|
| 1 | `cors()` | Preflight (`OPTIONS`) gets short-circuited before anything else runs. `credentials: true` is required so the cookie is exchanged on cross-origin requests. |
| 2 | `cookieParser()` | Must run **before** `isSignedIn` (which reads `req.cookies.sessionToken`). It also has to run before any controller that wants to look at cookies directly (`logout` does). |
| 3 | `helmet()` | Sets default security headers on every response, including 404s, 401s, and rate-limit `429`s. |
| 4 | `morgan("dev")` | Before the rate limiter so even rejected requests show up in the log — easier to debug "why am I getting 429s?". |
| 5 | `rateLimit()` | 300 req / 5 min / IP. Generous because dev includes live-typed search. Tune down for production. |
| 6 | `express.json()` | Body parsing happens last so that auth/rate-limit decisions don't pay the parse cost on rejected requests. |

After these, the routers are mounted:

```ts
app.use("/api/tasks", taskRouter);
app.use("/api/auth", authRouter);
app.use("/api/teams", teamsRouter);
app.use("/api/users", usersRouter);
app.use("/api/join-requests", joinRequestsRouter);
```

## Route middleware ([`middleware/index.ts`](../middleware/index.ts))

Two functions: `isSignedIn` and `isAdmin`. Both share a private helper `loadSessionUser(req)` that does the cookie -> session row -> user lookup and returns `null` for any failure mode.

### `loadSessionUser`

```ts
const sessionToken = req.cookies.sessionToken;
if (!sessionToken) return null;

const tokenHash = hashToken(sessionToken);
const [session] = await db
  .select()
  .from(sessions)
  .where(eq(sessions.tokenHash, tokenHash));

if (!session || session.expiresAt < new Date() || session.revokedAt !== null) {
  return null;
}

const [user] = await db.select().from(users).where(eq(users.id, session.userId));
if (!user) return null;

const { password: _password, ...safeUser } = user;
return { session, user: safeUser };
```

Failure modes that all collapse to `401`:

- No `sessionToken` cookie at all.
- Cookie present but no matching `tokenHash` row (token was forged or revoked-by-delete).
- Row found but `expiresAt < now` (cookie outlived the DB row).
- Row found but `revokedAt !== null` (soft revocation — admin or self-initiated).
- Row found but the referenced user doesn't exist (cascade race / deleted account).

### `isSignedIn`

```ts
const auth = await loadSessionUser(req);
if (!auth) return res.status(401).json({ message: "Unauthorized" });
req.user = auth.user;
req.authSession = auth.session;
next();
```

When this passes, downstream handlers can rely on `req.user!` and `req.authSession!` being defined. The `!` is needed because the `Express.Request` augmentation in [`types/express.d.ts`](../types/express.d.ts) marks them as optional (since unauthenticated handlers exist on the same `Request` type).

### `isAdmin`

Same pattern, with an extra `auth.user.role !== "admin"` check that returns `403`. **Important**: `isAdmin` does its own session lookup — you don't need to chain `isSignedIn, isAdmin`. Mount it standalone:

```ts
router.get("/", isAdmin, getJoinRequests);            // good
router.get("/", isSignedIn, isAdmin, getJoinRequests); // redundant — two DB lookups
```

The trade-off is that `isAdmin` doesn't compose with `isSignedIn` to share a single DB read. For this learning project the duplication is fine. A real implementation would memoize the lookup on `req` or provide a single `withAuth({ requireAdmin })` factory.

## Type augmentation ([`types/express.d.ts`](../types/express.d.ts))

```ts
declare global {
  namespace Express {
    interface Request {
      user?: Omit<User, "password">;
      authSession?: DbSession;
    }
  }
}
```

This is **why TypeScript knows about `req.user` and `req.authSession`** without a cast. Two things to call out:

1. `req.user` is **`Omit<User, "password">`** — the password hash is already stripped by the middleware, so even if a controller accidentally serializes `req.user` directly, it can't leak the hash.
2. `req.authSession` is the row from the **`sessions` table**, not `express-session`'s `req.session`. The naming intentionally differs to avoid confusion.

## Per-route auth posture (current state)

| Resource | Reads | Writes |
|----------|-------|--------|
| `/api/auth` | `getSession` is `isSignedIn`-gated | `login`/`register`/`logout` are public by definition |
| `/api/users` | **public** (incl. email search via `?q=`) | none exposed |
| `/api/teams` | `GET *` is **public** | `POST /` is `isSignedIn`. `PUT /:teamId/join` is `isAdmin`. `PUT /:teamId/leave` is **public** (bug). |
| `/api/tasks` | `GET *` is **public** | `POST`, `PUT`, `DELETE` are `isSignedIn` (with extra owner/team/admin checks inside the controllers) |
| `/api/join-requests` | `GET /me` is `isSignedIn`. `GET /` is `isAdmin`. | `POST /` is **public** (bug). `PUT /:id/approve`, `DELETE /:id` are `isAdmin`. |

The "bug" rows are the real-world reminders for why route middleware should be the default and **public** the conscious exception, not the other way around.

## Adding a new middleware

Two patterns:

### Per-route (preferred for auth/permissions)

```ts
// routes/widgets.ts
import { isSignedIn } from "../middleware";
const router = Router();
router.get("/", listWidgets);
router.post("/", isSignedIn, createWidget);
```

### Global (for cross-cutting infra)

```ts
// server.ts — register before the routers
app.use(myMiddleware);
```

Custom middleware signature is the standard `(req, res, next) => void | Promise<void>`. Always call `next(err)` (not `throw`) for async errors so Express doesn't drop them — though here, controllers all use try/catch instead of relying on a global error handler, so the convention is "handle it locally" anyway.

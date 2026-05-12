# API reference

All endpoints are mounted under `/api`. Auth is by the `sessionToken` `httpOnly` cookie set by `/api/auth/login` and `/api/auth/register` — see [`auth-and-sessions.md`](auth-and-sessions.md).

| Status | Meaning |
|--------|---------|
| `2xx` | Success |
| `400` | Validation failure (bad params, missing required field) |
| `401` | Not authenticated (no/invalid session cookie) |
| `403` | Authenticated but not allowed (e.g. non-admin hitting an admin route) |
| `404` | Resource not found |
| `409` | Conflict (e.g. user already on a team trying to create another) |
| `500` | Unhandled error in the controller |

Error bodies are uniformly `{ "message": "human-readable explanation" }`.

---

## `/api/auth` ([`routes/auth.ts`](../routes/auth.ts), [`controllers/auth.ts`](../controllers/auth.ts))

| Method | Path | Auth | Body | Notes |
|--------|------|------|------|-------|
| `POST` | `/login` | public | `{ email, password }` | Sets `sessionToken` cookie. Returns `{ message, user, sessionId }`. Same `401 "Invalid email or password"` for unknown email and wrong password (no account enumeration). |
| `POST` | `/register` | public | `{ email, password, confirmPassword }` | bcrypt-hashes the password (10 salt rounds), creates a session, sets cookie. Returns `201 { message, user, sessionId }`. `400 "Passwords do not match"` if confirm mismatches; `400 "User already exists"` on duplicate email. |
| `POST` | `/logout` | cookie | — | Deletes the session row by token hash, clears the cookie. `401` if no cookie. |
| `GET` | `/session` | `isSignedIn` | — | Returns `{ user: { id, email, role, teamId } }`. Used by the React boot effect to validate the cached session. |

### Response shapes

`AuthResponse` (login + register):
```jsonc
{
  "message": "Login successful",
  "user": {
    "id": 1,
    "email": "me@example.com",
    "role": "user",          // "admin" | "user"
    "teamId": null            // number | null
  },
  "sessionId": "uuid-..."
}
```

---

## `/api/users` ([`routes/users.ts`](../routes/users.ts), [`controllers/users.ts`](../controllers/users.ts))

| Method | Path | Auth | Query / Params | Notes |
|--------|------|------|----------------|-------|
| `GET` | `/` | public | `?q=<email substring>` | Returns up to 20 users matching `email ILIKE %q%` (or the first 20 if `q` is missing/empty). Always projects `safeUserSelection` so password hashes never leak. |
| `GET` | `/:userId` | public | `userId` (int) | Single user by id. `404` if missing. Same projection. |

> **Caveat:** `/api/users` should arguably be behind `isSignedIn` (or even `isAdmin`) since it can enumerate accounts. Left public deliberately so the admin user-search panel works without coordinating role-based UX changes. Tighten before relying on this in any real context.

### Response shape

`User` (the safe projection):
```jsonc
{
  "id": 1,
  "email": "me@example.com",
  "role": "user",
  "teamId": null
}
```

---

## `/api/teams` ([`routes/teams.ts`](../routes/teams.ts), [`controllers/teams.ts`](../controllers/teams.ts))

| Method | Path | Auth | Body / Params | Notes |
|--------|------|------|---------------|-------|
| `GET` | `/` | public | — | List all teams. |
| `GET` | `/:teamId` | public | `teamId` (int) | Returns the team. (Drizzle returns an array — frontend takes element 0.) |
| `GET` | `/user/:userId` | public | `userId` (int) | Resolves the user → their `teamId` → that team. `404` if user missing or has no team. |
| `POST` | `/` | `isSignedIn` | `{ name, description, creators?: [{ id, role }] }` | Creates a team. **One-team-per-user** invariant: 409 if the requester (or any listed creator) is already on a team. |
| `PUT` | `/:teamId/join` | `isAdmin` | `{ userId }` | Admin direct-assigns a user to a team (bypasses the join-request flow). |
| `PUT` | `/:teamId/leave` | **none** | `{ userId }` | Sets `users.teamId` to `null`. **No auth** — this should be `isSignedIn` and additionally check `req.user.id === userId || req.user.role === "admin"`. Tracked under "Known issues" in the README. |

### Team object

```jsonc
{
  "id": 1,
  "name": "Engineering",
  "description": "Builds and maintains the product.",
  "createdAt": "2026-05-12T05:00:00.000Z",
  "updatedAt": "2026-05-12T05:00:00.000Z"
}
```

---

## `/api/tasks` ([`routes/tasks.ts`](../routes/tasks.ts), [`controllers/tasks.ts`](../controllers/tasks.ts))

| Method | Path | Auth | Notes |
|--------|------|------|-------|
| `POST` | `/` | `isSignedIn` | Creates a task owned by `req.user.id`. Required: `title`, `description`. Optional: `dueDate`, `priority`, `category`, `status`, `teamId`. |
| `GET` | `/team/:teamId` | public | Tasks for a team. Supports `?limit=` (default 50, max 200) and `?offset=` (default 0). Sorted `updatedAt DESC`. |
| `GET` | `/user/:userId` | public | Tasks owned by a user. Same pagination + sort. |
| `GET` | `/:id` | public | Single task by id. |
| `PUT` | `/:id` | `isSignedIn` | Updates editable fields and bumps `updatedAt`. **Permission**: owner OR teammate (only when `task.teamId !== null` and `actor.teamId === task.teamId`) OR admin. 403 otherwise. |
| `DELETE` | `/:id` | `isSignedIn` | Owner or admin only. 403 otherwise. |

> The frontend currently treats `/team/:teamId` and `/user/:userId` as authenticated routes via the `RequireAuth` route guard. The backend doesn't require it; tighten if you want to lock these down.

### Task object

```jsonc
{
  "id": 42,
  "userId": 3,
  "teamId": 1,
  "title": "Wire up auth",
  "description": "...",
  "dueDate": "2026-06-01T00:00:00.000Z",   // or null
  "priority": "medium",                      // none | low | medium | high
  "category": "work",                        // work | personal | other
  "status": "in_progress",                   // pending | in_progress | completed
  "createdAt": "...",
  "updatedAt": "..."
}
```

### Pagination

`?limit` is clamped to `[1, 200]` (default `50`). `?offset` defaults to `0`. Non-numeric values fall back to defaults. Implemented in [`parsePagination`](../controllers/tasks.ts).

---

## `/api/join-requests` ([`routes/joinRequests.ts`](../routes/joinRequests.ts), [`controllers/joinRequests.ts`](../controllers/joinRequests.ts))

A "user wants to join a team, an admin must approve" workflow. Approval moves the user onto the team and deletes the request row; denial just deletes the row.

| Method | Path | Auth | Body / Params | Notes |
|--------|------|------|---------------|-------|
| `POST` | `/` | **none** | `{ teamId, userId }` | Create a pending request. 400 if a request for `(teamId, userId)` already exists. **Should be `isSignedIn`** and assert `req.user.id === userId`; tracked under "Known issues." |
| `GET` | `/me` | `isSignedIn` | — | Lists the current user's pending requests: `[{ id, teamId, teamName }]`. |
| `GET` | `/` | `isAdmin` | — | Admin queue: `[{ id, teamId, teamName, userId, userEmail }]`. |
| `PUT` | `/:joinRequestId/approve` | `isAdmin` | — | Sets `users.teamId = joinRequest.teamId`, deletes the request. 404 if missing. |
| `DELETE` | `/:joinRequestId` | `isAdmin` | — | Deny: deletes the request row. 404 if already gone. |

### `JoinRequestRow` (admin)
```jsonc
{ "id": 7, "teamId": 1, "teamName": "Engineering", "userId": 3, "userEmail": "alice@example.com" }
```

### `MyJoinRequestRow` (`/me`)
```jsonc
{ "id": 7, "teamId": 1, "teamName": "Engineering" }
```

---

## Cross-cutting headers

- **CORS**: `Access-Control-Allow-Origin` is set to `FRONTEND_ORIGIN` (default `http://localhost:5173`) with `credentials: true`. The frontend axios client must send `withCredentials: true` (it does — see [`frontend/src/services/api.ts`](../../frontend/src/services/api.ts)).
- **Helmet**: default secure headers (CSP off, HSTS conditionally on, etc.). See [helmet docs](https://helmetjs.github.io/) for the exact set.
- **Rate limiting**: 300 requests / 5 minutes / IP, with `RateLimit-*` `standardHeaders` set. 429 body is `"Too many requests, please try again later."` (not JSON — known oddity).
- **Cookies set by `/auth/login` and `/auth/register`**:
  ```
  Set-Cookie: sessionToken=<64-hex>; Max-Age=604800; HttpOnly; SameSite=Lax; Path=/; [Secure if NODE_ENV=production]
  ```

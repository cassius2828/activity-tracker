# Routing

React Router 7 in `BrowserRouter` mode. All routes are lazy-loaded; protected routes go through one of two guards.

## Route table ([`App.tsx`](../src/App.tsx))

| Path | Component | Guard |
|------|-----------|-------|
| `/` | `Home` | none (marketing page) |
| `/auth` | `Auth` | none |
| `/admin` | `Admin` | `RequireAdmin` |
| `/teams` | `Teams` | `RequireAuth` |
| `/tasks` | redirect → `/teams` | none |
| `/tasks/team/:teamId` | `Tasks` (team scope) | `RequireAuth` |
| `/tasks/user/:userId` | `Tasks` (personal scope) | `RequireAuth` |
| `/tasks/:id` | `TaskDetails` | `RequireAuth` |
| `/profile/:id` | `Profile` | `RequireAuth` |
| `*` | `NotFound` | none |

## Lazy loading

Every page is wrapped in `lazy(() => import("./pages/Foo"))`:

```tsx
const Home = lazy(() => import("./pages/Home"));
// ...

<Suspense fallback={<RouteFallback />}>
  <Routes>...</Routes>
</Suspense>
```

`<RouteFallback />` is a centered "Loading..." placeholder. It renders any time a navigation triggers a chunk download.

The whole `<Suspense>` block is wrapped in `<ErrorBoundary>` so a chunk-download failure or a render error inside the lazy component shows the error UI instead of a blank screen. See [`error-and-feedback.md`](error-and-feedback.md).

## Route guards ([`components/Layout/`](../src/components/Layout/))

### `RequireAuth`

```mermaid
flowchart TD
  Start([RequireAuth renders])
  Loading{isAuthLoading?}
  HasSession{session?}
  Loader[Render "Loading..." centered]
  Redir["Navigate to /auth?mode=login&next=&lt;encoded current url&gt;"]
  Pass[Render children]

  Start --> Loading
  Loading -->|yes| Loader
  Loading -->|no| HasSession
  HasSession -->|no| Redir
  HasSession -->|yes| Pass
```

Why the `isAuthLoading` branch matters: without it, a refresh on `/teams` would briefly render the `Navigate` to `/auth` before `AuthContext`'s boot effect resolved, causing a flicker even when the user *is* authenticated. The flag prevents the flash by holding the render until the boot validation completes.

The `next` param is the encoded `pathname + search` of the current location. After login, `AuthModal` reads `?next=` and navigates back there instead of the default `/teams`.

```ts
const next = encodeURIComponent(location.pathname + location.search);
return <Navigate to={`/auth?mode=login&next=${next}`} replace />;
```

### `RequireAdmin`

Same shape with two extra branches:

- If `session` is missing → `Navigate to /auth?mode=login`.
- If `session.role !== "admin"` → `Navigate to /` (silent demotion to home).

The "silent redirect" instead of "render an Access Denied page" is intentional — admin role checks are a defense-in-depth UX layer, not the primary security boundary (the backend enforces `isAdmin` middleware regardless). The frontend just wants to avoid showing UI the user can't actually use.

### Why the guards live in `components/Layout/`

They render *layout* (the loading state) and they don't have a specific feature attached. `Ui/` is for primitives (`Modal`, `Select`); `Layout/` is for app-shell pieces (`Nav`, `Footer`, `RequireAuth`, `RequireAdmin`, `ErrorBoundary`).

## 404 ([`pages/NotFound.tsx`](../src/pages/NotFound.tsx))

`<Route path="*" element={<NotFound />} />` is the catch-all at the bottom of `<Routes>`. The page reuses `PageShell` and `primaryBtnClass` for the "Go home" link.

> Note: `*` matches **after** all named routes are tried, even when wrapped in `<RequireAuth>`. So `/random-typo` doesn't redirect you to login — it 404s. That's deliberate; no point gating an error page.

## Route structure choices

**Why `/tasks/team/:teamId` instead of `/teams/:teamId/tasks`?**
The Tasks page is the orchestrator for both personal and team scopes (it switches via `teamId ? getTasksByTeamId : getTasksByUserId`). Putting them under `/tasks/...` means one page component handles both. A nested route under `/teams/...` would split the same logic across two routes for no real win.

**Why `/profile/:id` instead of `/me` + `/users/:id`?**
Just one route + one page covers both "my profile" (when the route id matches the session user) and "look at someone else's profile" (when it doesn't). The page detects the case and either reuses session data or fetches via `useUser(id)`. See [`pages/Profile.tsx`](../src/pages/Profile.tsx).

**Why `/tasks` redirects to `/teams`?**
Because there's no "all tasks across all of my scopes" view yet — going to `/tasks` without a scope is meaningless. Sending the user to `/teams` lets them pick a scope.

## `useNavigate` patterns

```ts
// Send the user somewhere with replace (so back button doesn't return here)
navigate("/auth?mode=login", { replace: true });

// Programmatic deep link
navigate(`/tasks/team/${teamId}`);

// Deep link with explicit mode + return URL
navigate(`/auth?mode=signup&next=${encodeURIComponent("/teams")}`);
```

Use `replace: true` when navigating away from a state the user shouldn't go back to (post-login redirect, post-logout home, expired-session forced redirect). Use plain navigation everywhere else.

## Adding a new route

1. Create the page in `src/pages/Foo.tsx`.
2. In [`App.tsx`](../src/App.tsx), add `const Foo = lazy(() => import("./pages/Foo"));`.
3. Add `<Route path="/foo" element={<RequireAuth><Foo /></RequireAuth>} />` (or `RequireAdmin`, or no guard).
4. Position it **before** the `<Route path="*" element={<NotFound />} />` catch-all.
5. If the page links to itself or other pages programmatically, prefer `useNavigate` over `<Link>` only when you actually need imperative control — `<Link>` is better for normal in-page navigation because it gets right-click + middle-click + cmd-click for free.

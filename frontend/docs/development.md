# Frontend development workflow

## Prerequisites

- Node.js 20+ (Vite 8 minimum).
- Backend running at the URL you'll set as `VITE_BACKEND_URL` — see [`../../backend/docs/development.md`](../../backend/docs/development.md).

## Environment variables

Vite only exposes vars prefixed with `VITE_` to the client.

| Variable | Required | Used by | Notes |
|----------|----------|---------|-------|
| `VITE_BACKEND_URL` | yes | [`src/services/api.ts`](../src/services/api.ts) | Base URL for axios. **Include the `/api` suffix** that matches the backend mount path: `http://localhost:3000/api` |

Example `.env`:

```bash
VITE_BACKEND_URL=http://localhost:3000/api
```

The backend's CORS config defaults to `FRONTEND_ORIGIN=http://localhost:5173` (Vite's default dev port) — match these when running on non-standard ports.

## Scripts

| Script | What |
|--------|------|
| `npm run dev` | Vite dev server with HMR — http://localhost:5173 |
| `npm run build` | `tsc -b && vite build` — type-check, then bundle. Fails on type errors. |
| `npm run preview` | Serve the production build locally for smoke-testing — http://localhost:4173 |
| `npm run lint` | ESLint flat config across the repo |

There's no separate `typecheck` script because `build` does it.

## First-time setup

```bash
cd frontend
npm install
echo 'VITE_BACKEND_URL=http://localhost:3000/api' > .env
npm run dev
```

The dev server prints both the local URL and the network URL. Open the local URL in a browser.

## Hot module replacement

Vite reloads on file change. Most edits update in-place without losing component state. The exceptions:

- Changes to `main.tsx`, the providers, or `App.tsx` typically trigger a full reload.
- Changes to files exporting both a component and non-component values can also trigger a full reload (the `react-refresh/only-export-components` lint rule warns about this — see "Lint baseline" below).

## Build output

A successful `npm run build` produces ~20 chunks under `dist/`:

```
dist/index.html                        ~0.9 kB
dist/assets/index-*.css               ~43 kB (8 kB gzip)   ← Tailwind
dist/assets/index-*.js              ~190 kB (60 kB gzip)   ← React + react-dom + react-router + axios + react-hot-toast
dist/assets/AuthContext-*.js         ~40 kB (16 kB gzip)   ← AuthContext + axios eager
dist/assets/classNames-*.js          ~53 kB (18 kB gzip)   ← Shared Tailwind strings + Ui primitives
dist/assets/Home-*.js                ~18 kB (4 kB gzip)
dist/assets/Tasks-*.js               ~11 kB (4 kB gzip)
dist/assets/TaskFormModal-*.js        ~8 kB (3 kB gzip)
dist/assets/TaskDetails-*.js          ~8 kB (2 kB gzip)
dist/assets/Auth-*.js                 ~6 kB (2 kB gzip)
dist/assets/Teams-*.js                ~5 kB (2 kB gzip)
dist/assets/Profile-*.js              ~4 kB (1 kB gzip)
dist/assets/Admin-*.js                ~4 kB (1 kB gzip)
dist/assets/Select-*.js               ~1 kB
dist/assets/NotFound-*.js             ~0.6 kB
dist/assets/PageShell-*.js            ~0.3 kB
dist/assets/{useTeam,joinRequests,teams,AppContext}-*.js   small shared modules
```

The per-route chunks are what `React.lazy(() => import("./pages/Foo"))` produces. See [`architecture.md`](architecture.md) for the layered design that makes this clean code-splitting possible.

## Lint configuration

[`eslint.config.js`](../eslint.config.js) — flat config. Plugins:

- `@eslint/js` recommended
- `typescript-eslint` (recommended, **not** `recommendedTypeChecked` — keeps lint fast in dev)
- `eslint-plugin-react-hooks` v6 (includes the experimental `react-hooks/set-state-in-effect` rule)
- `eslint-plugin-react-refresh`

### Lint baseline

`npm run lint` shows **7 pre-existing errors**, all from `react-hooks/set-state-in-effect`. They flag the standard "set state inside an effect after a network request" pattern that all data-loading hooks use. The codebase deliberately keeps that pattern (see [`hooks.md`](hooks.md) and [`data-fetching.md`](data-fetching.md)).

Files with one or more errors:

| File | Where |
|------|-------|
| `hooks/useTasks.ts` | Inside `fetchTasks` |
| `hooks/useTeam.ts` | Inside the load effect |
| `hooks/useUser.ts` | Inside the load effect |
| `hooks/useDebouncedSearch.ts` | Inside the debounced fetcher |
| `hooks/useMyJoinRequests.ts` | Inside the userId-change effect |
| `hooks/useAdminJoinRequests.ts` | Inside the mount effect |
| `components/Task/TaskFormModal.tsx` | Inside the form-reset effect |

If you add a new data-loading hook, you'll likely add to this baseline. **Do not add `// eslint-disable` for this rule** — leaving the warning visible keeps the trade-off in your face. If/when you decide to migrate the data layer to React Query / `useSyncExternalStore`, fixing them is the natural unlock.

The lint **must not introduce new categories of errors**. Treat the existing 7 as the floor; PRs should keep that count or reduce it.

## TypeScript configuration

Project references via [`tsconfig.json`](../tsconfig.json) (root) → [`tsconfig.app.json`](../tsconfig.app.json) (browser code) and [`tsconfig.node.json`](../tsconfig.node.json) (Vite config). Strict mode is on. `noUnusedLocals` and `noUnusedParameters` are on — clean up your imports.

## Debugging tips

- **Network panel cancellations**: navigate quickly between `/tasks/team/1` → `/tasks/team/2` → `/tasks/team/3`. Earlier requests show as **(canceled)** instead of completing. Same for typing fast in the admin user search.
- **Cookie inspection**: in Chrome DevTools, look at **Application > Cookies > localhost:5173** to see `sessionToken`. (`HttpOnly` means it appears in DevTools but JS can't `document.cookie` it.)
- **Session inspection**: hit `GET http://localhost:3000/api/auth/session` in the Network panel — what comes back is what `AuthContext` will store.
- **Toast not showing**: confirm `<Toaster />` is mounted (it is, in `App.tsx`). The most common cause is forgetting `import { toast } from "react-hot-toast"`.
- **Lazy chunk fails to load**: check Network for a failing `/assets/<chunk>-*.js` request. The `ErrorBoundary` will catch the failed import and offer "Try again" — clicking it re-attempts the fetch.

## Adding a new page (recap)

See [`architecture.md`](architecture.md), but the short version:

1. Create `src/pages/Foo.tsx`.
2. In [`App.tsx`](../src/App.tsx), add `const Foo = lazy(() => import("./pages/Foo"));` and a `<Route>`.
3. Wrap in `<RequireAuth>` / `<RequireAdmin>` if needed.
4. Add new HTTP via a service wrapper (with optional `signal?` for reads).
5. Add new shared logic via a hook in `src/hooks/`.

## Adding a new dependency

```bash
npm install some-package
```

Note: this project deliberately resists adding state libraries (Redux, Zustand, Jotai), data-fetching libraries (React Query, SWR, tRPC), and form libraries (react-hook-form, formik, zod). They're great in real apps; here they'd hide the parts of the stack the project exists to teach. Convince yourself that the gap can't be filled by a small in-codebase abstraction first.

OK additions:
- New axios plugins / interceptors (additive, fits the existing service layer).
- Component primitives (date pickers, charts, etc.).
- Test infrastructure (none exists yet — vitest + react-testing-library would be the obvious choice).

## Tests

There aren't any. Adding them would start with `vitest` + `@testing-library/react`. The hook layer is the easiest to test (pure functions of inputs to `{ data, isLoading, error }`); pages and components are coupled to react-router and the providers, so they need a wrapper utility.

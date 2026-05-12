# Activity Tracker — Frontend

React 19 + TypeScript 6 + Vite 8 web app for the activity-tracker learning project. Tailwind 4 for styling, React Router 7 for routing, `axios` for HTTP, `react-hot-toast` for notifications.

> Part of the wider learning sandbox at [`../README.md`](../README.md). The frontend deliberately avoids React Query / SWR / tRPC — every fetch goes through hand-rolled hooks so the request lifecycle stays visible.

## Stack

| Area | Choice |
|------|--------|
| Build / dev | Vite 8 (`@vitejs/plugin-react`, Tailwind v4 via `@tailwindcss/vite`) |
| Language | TypeScript 6 (strict) |
| UI | React 19 + React Router 7 + Tailwind 4 |
| HTTP | `axios` 1.x with a single response interceptor |
| Notifications | `react-hot-toast` |
| Lint | ESLint 9 (flat config) + `typescript-eslint` + `eslint-plugin-react-hooks` (v6, experimental rules included) |

## Layout

```text
frontend/
├── index.html
├── vite.config.ts            Tailwind plugin only — no aliases
├── eslint.config.js          flat config
├── tsconfig.json / app / node
├── public/
└── src/
    ├── main.tsx              providers wired inside <BrowserRouter>
    ├── App.tsx               lazy routes + ErrorBoundary + Toaster
    ├── pages/                thin orchestrators (lazy-loaded)
    ├── components/           PascalCase feature folders
    │   ├── Auth/             AuthModal + LoginForm + SignupForm + primitives
    │   ├── Home/             marketing page sections + mocks + data
    │   ├── Icons/            inline SVGs
    │   ├── Layout/           Nav, Footer, RequireAuth, RequireAdmin, ErrorBoundary
    │   ├── Task/             TaskFilterBar, TaskListItem, TaskDetailsCard, TaskFormModal, TeamActionsCard, AdminUserSearchPanel
    │   ├── Teams/            ChooseTeamSection, CreateTeamSection, TeamsHeader
    │   └── Ui/               Modal, ConfirmModal, PageShell, Select
    ├── hooks/                useTasks, useTeam, useUser, useDebouncedSearch, useMyJoinRequests, useAdminJoinRequests, useTaskPermissions, useModalChrome
    ├── services/             axios wrappers per resource, signal? on every read
    ├── context/              AuthContext, AppContext
    ├── types/                task, team, auth, joinRequest
    ├── constants/            tasks (priority/category/status maps + options)
    ├── utils/                date, normalizeTask, taskForm, validation
    ├── styles/classNames.ts  canonical Tailwind strings (single source of truth)
    └── index.css             Tailwind import + CSS variables + global element rules
```

Component folders are PascalCase by convention. Inside each folder it's one component per file with `default export`. See [`docs/architecture.md`](docs/architecture.md) and [`docs/components-and-styling.md`](docs/components-and-styling.md).

## Documentation

Detailed walkthroughs live under [`docs/`](docs/):

| File | What it covers |
|------|----------------|
| [`docs/architecture.md`](docs/architecture.md) | Folder layout, layered design, provider hierarchy |
| [`docs/routing.md`](docs/routing.md) | Lazy routes, `RequireAuth` / `RequireAdmin`, 404, `next` redirect |
| [`docs/auth-and-session.md`](docs/auth-and-session.md) | `AuthContext`, boot validation, 401 interceptor, `auth:expired` event |
| [`docs/data-fetching.md`](docs/data-fetching.md) | Service layer, hooks, `AbortController` cancellation, axios interceptor — *the deepest "do it by hand instead of React Query" doc* |
| [`docs/components-and-styling.md`](docs/components-and-styling.md) | Feature folders, `classNames.ts`, `PageShell`, `Modal` / `ConfirmModal` |
| [`docs/hooks.md`](docs/hooks.md) | Per-hook reference (signature, behavior, gotchas) |
| [`docs/forms-and-validation.md`](docs/forms-and-validation.md) | Auth form validation, `LabeledInput` error slot |
| [`docs/error-and-feedback.md`](docs/error-and-feedback.md) | `ErrorBoundary`, toasts, `ConfirmModal` |
| [`docs/development.md`](docs/development.md) | Env vars, scripts, lint baseline, build output |

## Quick start

```bash
npm install
echo 'VITE_BACKEND_URL=http://localhost:3000/api' > .env   # match your backend port
npm run dev   # http://localhost:5173
```

The backend must be running and reachable at `VITE_BACKEND_URL`. See [`../backend/docs/development.md`](../backend/docs/development.md).

## Scripts

| Script | What |
|--------|------|
| `npm run dev` | Vite dev server with HMR |
| `npm run build` | `tsc -b && vite build` — type-check, then bundle (lazy chunks per route) |
| `npm run preview` | Serve the production build locally for smoke-testing |
| `npm run lint` | ESLint flat config across the repo |

## Production build sanity-check

`npm run build` produces ~20 chunks. Page bundles are 0.6–17 kB each (gzipped 0.3–4 kB), the React + axios + react-router vendor chunk lands around 60 kB gzipped, and the AuthContext chunk (which pulls axios in eagerly because every page needs it for HTTP) is ~16 kB gzipped.

There's a baseline of **7 pre-existing `react-hooks/set-state-in-effect` lint errors** from the experimental v6 rule set on legitimate "set state in effect" patterns inside data-loading hooks (`useTasks`, `useTeam`, `useUser`, etc.). They don't affect runtime behavior. See [`docs/development.md`](docs/development.md) for details.

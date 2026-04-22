# Activity tracker — pages & features (build reference)

Simple React (Vite) app: **auth**, **tasks** (with **filtering**), and an **admin** area. Use this as a checklist while you wire routes, layout, and API calls to the backend (`/api/auth`, `/api/tasks`).

---

## Auth

| Page / view | Purpose | Core UI & behavior |
|-------------|---------|---------------------|
| **Login** | Existing users sign in | Email + password form; submit → `POST /api/auth/login`; store JWT (e.g. `localStorage` or `sessionStorage`); redirect to tasks (or intended return URL). Show validation and error messages from API. |
| **Register** | New account | Email, password, confirm password; submit → `POST /api/auth/register`; then either auto-login with returned token or redirect to login. Match backend fields (`confirmPassword`, etc.). |

**Cross-cutting:** Logout control (clear token + redirect to login). Optional “remember me” only if you change token storage strategy. Protect app routes: if no valid token, redirect to login.

Suggested routes: `/login`, `/register` (public).

---

## Tasks (main app)

| Page / view | Purpose | Core UI & behavior |
|-------------|---------|---------------------|
| **Task list** | Primary hub after auth | Fetch tasks (`GET /api/tasks` or user-scoped endpoint once wired). Table or card list: title, description snippet, due date, priority, status if you add it later. Actions: open detail/edit, delete (with confirm), “add task”. |
| **Create / edit task** | CRUD | Form: title, description, due date, priority (align with backend enum: `none`, `low`, `medium`, `high`). `POST /api/tasks` for create; `PUT /api/tasks/:id` for update. Handle 401/403 from middleware when you protect routes with JWT. |
| **Task detail** (optional for v1) | Read-only or inline expand | Single task `GET /api/tasks/:id` if you want a dedicated URL; otherwise list + modal is enough for a minimal app. |

Suggested routes: `/tasks` (list), `/tasks/new`, `/tasks/:id/edit` (or modals only—your choice).

---

## Task filter

Treat this as **behavior on the task list** (same page), not necessarily a separate route.

| Concern | Examples |
|----------|----------|
| **Client filter** | Filter/sort loaded rows by priority, due date range, text search on title/description (no extra API if dataset is small). |
| **Server query** (later) | Query params on `GET /api/tasks?priority=high&dueBefore=…` if you extend the backend. |

**UI:** Filter bar above the list (dropdowns, date range, search input, “clear filters”). Show empty state when no rows match.

---

## Admin portal

Restricted to **admin** role (JWT payload includes `role`; backend has `isAdmin` middleware—use it on admin APIs when ready).

| Page / view | Purpose | Core UI & behavior |
|-------------|---------|---------------------|
| **Admin home / dashboard** (minimal) | Entry after admin login | Short summary: user count, task count, or links only—keep v1 trivial. |
| **User management** (if in scope) | List users, roles | Table from a future `GET /api/admin/users` or reuse patterns from auth; promote/demote role if backend supports it. Skip until API exists. |
| **Task oversight** (optional) | All tasks across users | Read-only or delete abusive rows; depends on admin endpoints. |

Suggested routes: `/admin`, `/admin/users` (guard: if `role !== 'admin'`, redirect to `/tasks` or 403 page).

---

## Global layout & plumbing

- **App shell:** Header with nav (Tasks, Admin if admin), user menu + logout.
- **API client:** Base URL from env (`VITE_API_URL`), attach `Authorization: Bearer <token>` on protected calls.
- **Loading / errors:** Spinners on fetches; toast or inline errors for failed mutations.
- **404:** Unknown paths → simple “not found” or redirect home.

---

## Suggested route map (summary)

| Route | Who | Notes |
|-------|-----|--------|
| `/login`, `/register` | Public | Auth forms |
| `/tasks` | Authenticated | List + **filter bar** + create entry point |
| `/tasks/new`, `/tasks/:id/edit` | Authenticated | Forms (or modals) |
| `/admin`, `/admin/...` | Admin only | Portal sections |

Add **React Router** (or similar) when you start splitting views; until then you can approximate with conditional render in `App.tsx`.

---

## Build order (practical)

1. Auth pages + token storage + protected wrapper  
2. Task list + create (happy path)  
3. Task filter on list  
4. Edit/delete + error states  
5. Admin shell + route guard + placeholder admin views until APIs exist  

This file is intentionally lightweight—extend sections as the backend adds endpoints.

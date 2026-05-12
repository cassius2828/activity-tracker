# Hooks reference

All custom hooks live in [`src/hooks/`](../src/hooks/). Two categories:

- **Data-fetching hooks** — wrap a service call with cancellation, loading state, and error state. Pattern documented in [`data-fetching.md`](data-fetching.md).
- **UI hooks** — encapsulate a side effect that doesn't fit naturally as a component.

## Data-fetching hooks

### `useTasks({ teamId, userId })`

Loads either `getTasksByTeamId(teamId)` or `getTasksByUserId(userId)` depending on which is provided. `teamId` wins if both are present.

```ts
const { tasks, setTasks, isLoading, error } = useTasks({ teamId, userId });
```

| Field | Type | Notes |
|-------|------|-------|
| `tasks` | `Task[]` | Always an array (empty during loading or after error) |
| `setTasks` | `Dispatch<SetStateAction<Task[]>>` | Exposed so consumers can do optimistic updates without refetch |
| `isLoading` | `boolean` | True between fetch start and resolution (or cancellation) |
| `error` | `string \| null` | "Could not load tasks right now." on failure |

Used by [`pages/Tasks.tsx`](../src/pages/Tasks.tsx). The `setTasks` escape hatch is what powers "create task → prepend to list without refetching" UX.

### `useTeam(teamId)`

Loads `getTeamById(teamId)` and returns just the display name. `teamId` may be null/undefined — the hook short-circuits without firing a request.

```ts
const { teamName, error } = useTeam(teamId);
```

Used by [`pages/Tasks.tsx`](../src/pages/Tasks.tsx) (header label) and [`pages/Profile.tsx`](../src/pages/Profile.tsx) (team display).

### `useUser(id, enabled = true)`

Loads `getUserById(id)`. The `enabled` flag is the standard "skip this fetch" lever — used by [`pages/Profile.tsx`](../src/pages/Profile.tsx) to only fetch when viewing someone *else's* profile (when viewing your own, the session data is already enough).

```ts
const { user, isLoading, error } = useUser(routeId, showOtherUser);
```

### `useMyJoinRequests(userId)`

Loads `getMyJoinRequests()` for the current user.

```ts
const { myJoinRequests, refresh, setMyJoinRequests } = useMyJoinRequests(userId);
```

| Field | Notes |
|-------|-------|
| `myJoinRequests` | `MyJoinRequestRow[]` |
| `refresh` | Imperative refetch callback. **Not cancellable** — callers expect it to complete. Use after a mutation that should reflect in the list. |
| `setMyJoinRequests` | Direct state setter for optimistic updates (used by [`pages/Tasks.tsx`](../src/pages/Tasks.tsx) on join-request submission) |

The mount/userId-change effect is cancellable (separate AbortController internally), but `refresh` is not — that asymmetry is intentional. See [`data-fetching.md`](data-fetching.md).

### `useAdminJoinRequests(enabled)`

Loads `getJoinRequests()` (the admin queue). No-ops when `enabled` is false.

```ts
const { requests, setRequests, isLoading, error, reload } = useAdminJoinRequests(isAdmin);
```

Same `reload` vs effect-cancellation asymmetry as `useMyJoinRequests`. Used by [`pages/Admin.tsx`](../src/pages/Admin.tsx).

### `useDebouncedSearch({ query, fetcher, enabled?, delayMs? })`

Generic debounced async with cancellation. Used for the admin user-search panel; reusable for any other "type-and-search" UX.

```ts
const fetcher = useCallback(
  async (trimmed: string, signal: AbortSignal) => {
    return await searchUsers(trimmed, signal);
  },
  [],
);

const { results, isLoading, error } = useDebouncedSearch({ query, fetcher });
```

| Field | Notes |
|-------|-------|
| `query` | Raw input string. Hook trims + debounces. Empty trim short-circuits to `results = null`. |
| `fetcher` | Receives the trimmed query + an `AbortSignal`. Forward the signal into your service call. **Wrap in `useCallback`** — the hook depends on it. |
| `enabled` | Default `true`. Set false to disable. |
| `delayMs` | Default `300`. |

Returns `{ results, isLoading, error }`. Cancellation handles both the debounce timer (via `clearTimeout`) and the in-flight HTTP (via `AbortController`).

### `useTaskPermissions(task, session)`

Pure derivation — no HTTP, no effects. Mirrors the backend permission rules in [`controllers/tasks.ts`](../../backend/controllers/tasks.ts) so the UI hides actions the user can't take:

```ts
const { canEdit, canDelete, permissionReason } = useTaskPermissions(task, session);
```

| Field | Logic |
|-------|-------|
| `canEdit` | Owner, OR teammate (when `task.teamId !== null && session.teamId === task.teamId`), OR admin |
| `canDelete` | Owner OR admin (stricter than edit — teammates can't delete) |
| `permissionReason` | Human-readable string when `canEdit` is false, e.g. "Only the task owner, a teammate, or an admin can edit this task." |

Used by [`pages/TaskDetails.tsx`](../src/pages/TaskDetails.tsx) and [`Task/TaskDetailsCard.tsx`](../src/components/Task/TaskDetailsCard.tsx).

> Important: this is **defense-in-depth UX**, not security. The backend re-checks permissions on every mutation regardless. Don't add server-side rules and forget to mirror them here, or the UI will let users click buttons they'll get 403'd on.

## UI hooks

### `useModalChrome({ open, onClose, lockClose? })`

Wires the standard modal chrome behaviors:

- Locks page scroll while `open` is true (sets `body.overflow: hidden`).
- Closes on `Escape` (unless `lockClose` is true — useful while a submit is in flight).

Used by [`Ui/Modal.tsx`](../src/components/Ui/Modal.tsx) and [`Task/TaskFormModal.tsx`](../src/components/Task/TaskFormModal.tsx).

```ts
useModalChrome({ open: isOpen, onClose: close, lockClose: isSubmitting });
```

If you build a new modal directly (instead of going through `Ui/Modal`), use this hook so the chrome stays consistent.

## Hook authoring conventions

When you add a new hook to this codebase, follow the patterns below:

**Data-fetching hook checklist:**

1. Accept the input that drives the fetch as a parameter, not as an internal `useEffect` dependency that the hook somehow infers.
2. Return `{ data, isLoading, error }` (or a feature-specific name like `tasks` / `team` / `myJoinRequests`).
3. Optionally expose `setData` and a `refresh()` callback when consumers need optimistic updates or imperative re-fetches.
4. Use `AbortController` in the effect, forward the signal into the service, and short-circuit on `axios.isCancel(err)`.
5. Reset state to a sensible initial when the input is missing/null/disabled.

**UI hook checklist:**

1. The hook should *describe a side effect*, not own visible state. If you find yourself rendering JSX from a hook, that's a component instead.
2. If your hook needs cleanup (event listeners, timers, mutations to `document.body`), the `useEffect` must return a cleanup function that exactly undoes them.
3. Memoize callbacks the hook returns with `useCallback` so consumers don't get a fresh reference on every render.

## A note on the `react-hooks/set-state-in-effect` lint baseline

The `eslint-plugin-react-hooks` v6 experimental rule set flags every "set state in an effect" pattern, including the standard data-loading flow above. There's a baseline of **7 errors** across these hooks that we accept as a deliberate trade-off:

- `useTasks`, `useTeam`, `useUser`, `useMyJoinRequests`, `useAdminJoinRequests`, `useDebouncedSearch`, plus `Tasks` and `TaskFormModal` reset effects.

Switching them to `useSyncExternalStore` or moving to React Query is the long-term path the rule is nudging toward. For this learning project, the readability of the explicit pattern wins. Adding a new data-loading hook will probably add to this baseline; that's expected. See [`development.md`](development.md) for the lint command output.

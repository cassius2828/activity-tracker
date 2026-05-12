# Components & styling

## Folder convention

Component folders are **PascalCase** and grouped by feature. Inside each folder it's one component per file with `default export`. Tests would be co-located if there were any.

```text
src/components/
├── Auth/        AuthModal + LoginForm + SignupForm + AuthFormPrimitives + styles.ts + types.ts
├── Home/        HeroSection / FeaturesSection / HowItWorksSection / LiveActivitySection / CtaSection
│                + Mock / MockChrome / Bar + data.ts
├── Icons/       inline SVGs (CheckIcon)
├── Layout/      Nav / Footer / RequireAuth / RequireAdmin / ErrorBoundary
├── Task/        TaskFilterBar / TaskListItem / TaskDetailsCard / TaskFormModal
│                + TeamActionsCard / AdminUserSearchPanel
├── Teams/       ChooseTeamSection / CreateTeamSection / TeamsHeader
└── Ui/          Modal / ConfirmModal / PageShell / Select   ← cross-feature primitives
```

The categorization rule:

- **`Ui/`**: small, generic, reusable across features. Has no business knowledge.
- **`Layout/`**: app-shell pieces. Things that are part of "the page wrapper" rather than a feature.
- **Feature folders** (`Auth/`, `Task/`, etc.): components that only make sense inside their feature. Cross-feature reuse is a sign you should hoist into `Ui/` or expose a hook.

## Styling primitives — [`src/styles/classNames.ts`](../src/styles/classNames.ts)

A single source of truth for the canonical Tailwind class strings. Anything reused in 2+ places lives here so we have one place to tune visual identity.

| Export | Use case |
|--------|----------|
| `inputClass` | All `<input>` / `<textarea>` controls — full-width, themed border, focus ring, dark variant baked in |
| `labelClass` | All `<label>` — small bold above the input |
| `primaryBtnClass` | Filled accent button (default for primary actions) |
| `subtleBtnClass` | Border-only secondary button |
| `dangerBtnClass` | Rose-tinted destructive button |
| `ctaPrimaryBtnClass`, `ctaSecondaryBtnClass` | Larger marketing-page CTAs (Home only) |
| `eyebrowClass` | Small uppercase tracking-wide accent text above headings |
| `cardClass`, `cardCompactClass` | Bordered rounded card with shadow (full / tight padding) |
| `noticeClass`, `noticeCompactClass` | Inline informational banner |
| `warningNoticeClass` | Amber-tinted warning banner |
| `errorNoticeClass` | Rose-tinted error banner |

Pattern:

```tsx
import { primaryBtnClass, inputClass, labelClass } from "../../styles/classNames";

<input className={inputClass} />
<button className={primaryBtnClass}>Save</button>
```

Need an additional modifier? Compose at the call site instead of forking the class:

```tsx
<button className={`${subtleBtnClass} h-[42px] shrink-0`}>Reset</button>
<p className={`mb-5 ${noticeClass}`}>...</p>
```

If you find yourself adding the *same* one-off composition twice, hoist it into `classNames.ts` as a new named export.

### Auth-only styles ([`components/Auth/styles.ts`](../src/components/Auth/styles.ts))

The auth panel has its own visual identity (taller submit button, glow accents on the card). Anything specific to auth panels lives in `Auth/styles.ts`, which **re-exports** the shared `inputClass` / `labelClass` / `eyebrowClass` from `classNames.ts` so consumers don't need two imports.

## Layout primitive — [`Ui/PageShell.tsx`](../src/components/Ui/PageShell.tsx)

Every routed page wraps its content in `<PageShell>` for consistent centering and width:

```tsx
<PageShell size="md">
  {/* page content */}
</PageShell>
```

| `size` | Tailwind max-width | Used by |
|--------|--------------------|---------|
| `sm` | `max-w-xl` | Profile |
| `md` (default) | `max-w-3xl` | Tasks, TaskDetails, Teams, Admin, NotFound |
| `lg` | `max-w-6xl` | reserved (currently unused) |

Don't put `mx-auto w-full max-w-...` directly on a page wrapper — `PageShell` exists so width changes happen in one file.

## Modal primitives

Two layers in `Ui/`:

### `Ui/Modal.tsx`

Generic centered overlay with backdrop, `Escape` to close, body scroll lock. You provide the contents:

```tsx
<Modal open={isOpen} onClose={close} ariaLabel="Edit task" panelClassName="max-w-lg">
  <header>...</header>
  <form>...</form>
</Modal>
```

The `lockClose` prop suppresses the close behaviors while a submit is in flight (so the user can't escape mid-`POST`).

The chrome (escape key + body overflow) is centralized in [`hooks/useModalChrome.ts`](../src/hooks/useModalChrome.ts). Both `Modal` and the older `TaskFormModal` use it.

### `Ui/ConfirmModal.tsx`

A small confirmation dialog built on `Modal`. Replaces `window.confirm` so the look matches the rest of the app:

```tsx
<ConfirmModal
  open={isConfirming}
  title="Delete task?"
  description="This cannot be undone."
  confirmLabel="Delete"
  destructive
  isWorking={isDeleting}
  onConfirm={handleDelete}
  onCancel={() => setIsConfirming(false)}
/>
```

Used in [`pages/TaskDetails.tsx`](../src/pages/TaskDetails.tsx) for delete confirmation.

## `Ui/Select.tsx`

Styled native `<select>` with a themed chevron overlay. Drop-in replacement for `<select>` — accepts the same props plus an optional `wrapperClassName`. Matches the height + focus-ring style of `inputClass` so forms look uniform.

## Task feature breakdown

| Component | Responsibility |
|-----------|----------------|
| [`TaskFilterBar`](../src/components/Task/TaskFilterBar.tsx) | Search input + priority select + reset button. Pure presentational; parent owns the state. |
| [`TaskListItem`](../src/components/Task/TaskListItem.tsx) | Single card in the task list. Click-to-edit if `canEdit`, otherwise read-only. |
| [`TaskDetailsCard`](../src/components/Task/TaskDetailsCard.tsx) | Full task view used on `/tasks/:id`. Owns the priority/status/category badges and the edit/delete actions row. |
| [`TaskFormModal`](../src/components/Task/TaskFormModal.tsx) | Create + edit modal. Uses `useModalChrome` + the `<Select>` primitive. Form state via `utils/taskForm.ts`. |
| [`TeamActionsCard`](../src/components/Task/TeamActionsCard.tsx) | "You are/aren't on this team" panel for the team-tasks view. Embeds `AdminUserSearchPanel` when the viewer is admin. |
| [`AdminUserSearchPanel`](../src/components/Task/AdminUserSearchPanel.tsx) | Debounced user search + assign-to-team. The only consumer of `useDebouncedSearch`. |

## Auth feature breakdown

| File | Responsibility |
|------|----------------|
| [`AuthModal.tsx`](../src/components/Auth/AuthModal.tsx) | Page-level orchestrator. Owns form state, login/register HTTP, post-success navigation, error toasts. |
| [`LoginForm.tsx`](../src/components/Auth/LoginForm.tsx) | Login fields + per-field client-side validation via `utils/validation.ts`. |
| [`SignupForm.tsx`](../src/components/Auth/SignupForm.tsx) | Signup fields with the additional confirm-password match check. |
| [`AuthFormPrimitives.tsx`](../src/components/Auth/AuthFormPrimitives.tsx) | Reusable shells: `AuthFormShell`, `AuthPanelHeader`, `LabeledInput` (with inline error slot), `AuthSubmitButton`, `AuthModeFooter`. |
| [`styles.ts`](../src/components/Auth/styles.ts) | Auth-panel-specific class strings + re-exports of shared primitives. |
| [`types.ts`](../src/components/Auth/types.ts) | `AuthFormValues`, `SubmitAuthFn` shared between login + signup. |
| [`index.ts`](../src/components/Auth/index.ts) | Re-export so the page imports `from "../components/Auth"` instead of a long path. |

See [`forms-and-validation.md`](forms-and-validation.md) for the validation deep-dive.

## Home (marketing page) feature breakdown

[`pages/Home.tsx`](../src/pages/Home.tsx) is a 17-line orchestrator that composes five sections:

```tsx
<HeroSection />
<FeaturesSection />
<HowItWorksSection />
<LiveActivitySection />
<CtaSection />
```

Each section file is self-contained and uses [`Mock`](../src/components/Home/Mock.tsx) (a switch over `MockVariant`) to render fake screenshots. The mock primitives ([`MockChrome`](../src/components/Home/MockChrome.tsx), [`Bar`](../src/components/Home/Bar.tsx)) and the data arrays ([`data.ts`](../src/components/Home/data.ts)) are shared across sections.

## Icons

[`components/Icons/`](../src/components/Icons/) holds inline SVGs as React components. Currently only `CheckIcon` (used in `LiveActivitySection`'s bullet list). Adding a new icon: copy `CheckIcon.tsx`, replace the path data, accept `size` + `className` props.

## When to make a new component

Two heuristics:

1. **A page file is over ~200 lines.** Find the largest cohesive chunk and extract it.
2. **The same JSX shape appears twice with the same intent.** If the styling differs but the structure is the same, the component takes the differences as props.

Counter-heuristic: don't extract for the sake of extraction. A 30-line `<div>` that's only used once can stay inline; making it a component just adds a layer of indirection.

## When to add to `styles/classNames.ts`

A new class string belongs in `classNames.ts` when:

- It's used in 2+ files.
- It encodes a visual identity (button look, input look, card look) that should stay consistent across features.

It does **not** belong in `classNames.ts` when:

- It's a one-off layout adjustment (margin, gap, sizing).
- It's only meaningful inside one feature (e.g. the marketing-page glow effects — those stay in `HeroSection.tsx`).

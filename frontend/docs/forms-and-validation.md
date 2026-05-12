# Forms & validation

The auth flow is the only place with non-trivial form validation, since task / team forms only need "is this required field present" checks that the form's `required` attribute already covers.

## Validation utility ([`utils/validation.ts`](../src/utils/validation.ts))

Three small pure functions, each returning `string | null` (the error message, or `null` if valid):

```ts
export const validateEmail = (email: string): string | null => {
  if (!email.trim()) return "Email is required.";
  if (!EMAIL_RE.test(email.trim())) return "Enter a valid email address.";
  return null;
};

export const validatePassword = (password: string): string | null => {
  if (!password) return "Password is required.";
  if (password.length < PASSWORD_MIN_LENGTH) {
    return `Password must be at least ${PASSWORD_MIN_LENGTH} characters.`;
  }
  return null;
};

export const validateConfirmPassword = (
  password: string,
  confirmPassword: string,
): string | null => {
  if (!confirmPassword) return "Please confirm your password.";
  if (password !== confirmPassword) return "Passwords do not match.";
  return null;
};
```

`PASSWORD_MIN_LENGTH = 8`. The email regex (`/^[^\s@]+@[^\s@]+\.[^\s@]+$/`) is RFC-5322-lite — good enough for client-side prevalidation. The server should re-validate (it doesn't currently — that's a known TODO).

The functions are pure, exhaustive, and don't depend on React. You can unit test them or import them anywhere.

## Inline error rendering ([`components/Auth/AuthFormPrimitives.tsx`](../src/components/Auth/AuthFormPrimitives.tsx))

The shared `LabeledInput` accepts an optional `error` slot:

```tsx
<LabeledInput
  id="login-email"
  label="Email"
  type="email"
  value={formData.email}
  onChange={(e) => updateField("email", e.target.value)}
  error={errors.email}      // string | null
/>
```

When `error` is non-null:
- The input gets a rose border (`border-rose-400/60 focus:border-rose-400`).
- An error paragraph is rendered below with `id="<inputId>-error"`.
- `aria-invalid` is set on the input.
- `aria-describedby` points at the error paragraph for screen readers.

This is the bare minimum accessible inline-error pattern — no toast, no global form summary, just per-field state.

## Form orchestration ([`Auth/LoginForm.tsx`](../src/components/Auth/LoginForm.tsx) / [`Auth/SignupForm.tsx`](../src/components/Auth/SignupForm.tsx))

The pattern (login is the simpler version):

```tsx
type FieldErrors = { email: string | null; password: string | null };
const NO_ERRORS: FieldErrors = { email: null, password: null };

const [errors, setErrors] = useState<FieldErrors>(NO_ERRORS);

const updateField = (key, value) => {
  setFormData({ ...formData, [key]: value });
  // Clear the field's error when the user starts editing
  if (errors[key as keyof FieldErrors]) {
    setErrors((prev) => ({ ...prev, [key]: null }));
  }
};

const handleSubmit = (event) => {
  event.preventDefault();
  const next: FieldErrors = {
    email: validateEmail(formData.email),
    password: validatePassword(formData.password),
  };
  setErrors(next);
  if (next.email || next.password) return;
  submitForm(formData);
};
```

Three things to call out:

1. **Validate on submit, not on change.** Showing "invalid email" while the user is in the middle of typing it is hostile UX. Submit-time validation is the standard.
2. **Clear the field's error on edit.** Once the user starts fixing the field, the red box should go away immediately — no "wait for the next submit" lag.
3. **`return` early if any field has an error.** Don't fire the API call. The submit button stays clickable so the user can fix the fields and try again.

The signup form follows the same pattern with one extra field (`confirmPassword` + `validateConfirmPassword`).

## Why no `react-hook-form` / `formik` / `zod`

A library would absolutely make this nicer once you add a third or fourth form. With two auth forms and zero non-auth forms requiring validation, the cost of installing a 30 kB dep + learning its API doesn't pay off vs ~50 lines of custom code.

If/when you add a third form (e.g. profile edit, team management form with non-trivial rules), `react-hook-form` + `zod` is the natural upgrade — they'd let you replace the manual `FieldErrors` plumbing with a schema definition and `register()` calls. The validation utility would migrate cleanly into a zod schema:

```ts
import { z } from "zod";
const loginSchema = z.object({
  email: z.string().min(1, "Email is required.").email("Enter a valid email address."),
  password: z.string().min(8, `Password must be at least 8 characters.`),
});
```

Until then, the in-house version stays.

## TaskFormModal — the other non-trivial form

[`Task/TaskFormModal.tsx`](../src/components/Task/TaskFormModal.tsx) is the create + edit modal for tasks. It uses:

- **Local state** via `useState<TaskFormState>`.
- **Form initialization** via `utils/taskForm.ts` helpers:
  - `emptyTaskForm()` for create mode.
  - `taskFormFromTask(task, currentTeamId)` for edit mode.
- **Required-field check at submit** (`title.trim() && description.trim()`), with the submit button `disabled` whenever either is empty so the user gets immediate feedback without inline error UX.
- **No per-field error messages** because the only validation is "is the field non-empty," which the visual disabled state already conveys.

The select markup uses [`Ui/Select.tsx`](../src/components/Ui/Select.tsx) driven by the option arrays from [`constants/tasks.ts`](../src/constants/tasks.ts):

```tsx
{priorityOptions.map((option) => (
  <option key={option.value} value={option.value}>{option.label}</option>
))}
```

Adding a new priority/category/status enum: add it to the type in [`types/task.ts`](../src/types/task.ts), the label/style maps in [`constants/tasks.ts`](../src/constants/tasks.ts), and the corresponding options array. The form picks it up automatically.

## Submission UX

Across all forms in the app, the same in-flight pattern:

- The submit button switches to a "loading" label (`Signing in...`, `Saving...`, `Creating...`).
- The button is `disabled` while the request is in flight.
- The cancel/close button is also `disabled` (and `useModalChrome` suppresses Escape) so the user can't dismiss the modal half-way through.
- Server-side errors surface via `react-hot-toast` (login/signup) or via an inline `errorMessage` prop on the form (TaskFormModal). See [`error-and-feedback.md`](error-and-feedback.md).

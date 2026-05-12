import { useEffect, useRef, useState, type FormEvent } from "react";
import type {
  Task,
  TaskCategory,
  TaskInput,
  TaskPriority,
  TaskStatus,
} from "../service/tasks";

const inputClass =
  "w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] px-4 py-2.5 text-[15px] text-[var(--text-h)] shadow-sm outline-none transition " +
  "placeholder:text-[var(--text)]/60 " +
  "focus:border-[var(--accent-border)] focus:ring-2 focus:ring-[var(--accent)]/25";

const labelClass =
  "mb-1.5 block text-[13px] font-medium text-[var(--text-h)]";

const primaryBtnClass =
  "rounded-xl bg-[var(--accent)] px-4 py-2.5 text-[14px] font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60";

const subtleBtnClass =
  "rounded-xl border border-[var(--border)] px-4 py-2.5 text-[14px] font-medium text-[var(--text-h)] transition hover:bg-[var(--code-bg)] disabled:cursor-not-allowed disabled:opacity-60";

type FormState = {
  title: string;
  description: string;
  dueDate: string;
  priority: TaskPriority;
  category: TaskCategory;
  status: TaskStatus;
  includeTeam: boolean;
};

const emptyForm = (): FormState => ({
  title: "",
  description: "",
  dueDate: "",
  priority: "none",
  category: "other",
  status: "pending",
  includeTeam: false,
});

const toDateInputValue = (iso: string): string => {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  // <input type="date"> needs YYYY-MM-DD
  return date.toISOString().slice(0, 10);
};

const fromTask = (task: Task, defaultTeamId: string | null | undefined): FormState => ({
  title: task.title,
  description: task.description,
  dueDate: toDateInputValue(task.dueDate),
  priority: task.priority,
  category: task.category,
  status: task.status,
  includeTeam: task.teamId !== null && (defaultTeamId == null || task.teamId === defaultTeamId),
});

type TaskFormModalProps = {
  open: boolean;
  mode: "create" | "edit";
  initialTask?: Task | null;
  /** The current user's team id, if any — used for the "include team" toggle. */
  currentTeamId?: string | null;
  /** Pre-checks the team toggle on open (e.g. when creating from a team view). */
  defaultIncludeTeam?: boolean;
  isSubmitting: boolean;
  errorMessage?: string | null;
  onClose: () => void;
  onSubmit: (input: TaskInput) => Promise<void> | void;
};

const TaskFormModal = ({
  open,
  mode,
  initialTask,
  currentTeamId,
  defaultIncludeTeam,
  isSubmitting,
  errorMessage,
  onClose,
  onSubmit,
}: TaskFormModalProps) => {
  const [form, setForm] = useState<FormState>(emptyForm);
  const titleInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!open) return;
    if (mode === "edit" && initialTask) {
      setForm(fromTask(initialTask, currentTeamId ?? null));
    } else {
      setForm({
        ...emptyForm(),
        includeTeam: Boolean(defaultIncludeTeam && currentTeamId),
      });
    }
  }, [open, mode, initialTask, currentTeamId, defaultIncludeTeam]);

  useEffect(() => {
    if (!open) return;
    titleInputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isSubmitting) onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, isSubmitting, onClose]);

  if (!open) return null;

  const updateField = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((previous) => ({ ...previous, [key]: value }));

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.title.trim() || !form.description.trim()) return;
    const teamIdValue =
      form.includeTeam && currentTeamId ? currentTeamId : null;
    await onSubmit({
      title: form.title.trim(),
      description: form.description.trim(),
      dueDate: form.dueDate || null,
      priority: form.priority,
      category: form.category,
      status: form.status,
      teamId: teamIdValue,
    });
  };

  const titleLabel = mode === "create" ? "New task" : "Edit task";
  const submitLabel = mode === "create" ? "Create task" : "Save changes";
  const submittingLabel = mode === "create" ? "Creating..." : "Saving...";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={titleLabel}
      className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6 sm:px-6"
    >
      <button
        type="button"
        aria-label="Close"
        onClick={() => {
          if (!isSubmitting) onClose();
        }}
        className="absolute inset-0 h-full w-full cursor-default bg-black/50 backdrop-blur-sm"
      />

      <div className="relative z-10 w-full max-w-lg overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg)] shadow-[var(--shadow)]">
        <header className="flex items-start justify-between gap-4 border-b border-[var(--border)] px-6 py-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">
              Task
            </p>
            <h2 className="!m-0 !text-xl !tracking-tight text-[var(--text-h)]">
              {titleLabel}
            </h2>
          </div>
          <button
            type="button"
            onClick={() => {
              if (!isSubmitting) onClose();
            }}
            disabled={isSubmitting}
            className="rounded-lg px-2 py-1 text-[13px] font-medium text-[var(--text)] hover:bg-[var(--code-bg)] hover:text-[var(--text-h)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            Close
          </button>
        </header>

        <form onSubmit={handleSubmit} className="space-y-4 px-6 py-5">
          {errorMessage && (
            <p className="rounded-xl border border-rose-400/40 bg-rose-500/10 px-3 py-2 text-[13px] text-rose-800 dark:text-rose-100">
              {errorMessage}
            </p>
          )}

          <div>
            <label htmlFor="task-form-title" className={labelClass}>
              Title
            </label>
            <input
              id="task-form-title"
              ref={titleInputRef}
              className={inputClass}
              value={form.title}
              onChange={(event) => updateField("title", event.target.value)}
              placeholder="Wire up auth"
              maxLength={120}
              required
            />
          </div>

          <div>
            <label htmlFor="task-form-description" className={labelClass}>
              Description
            </label>
            <textarea
              id="task-form-description"
              className={`${inputClass} min-h-24 resize-y`}
              value={form.description}
              onChange={(event) => updateField("description", event.target.value)}
              placeholder="What needs to happen..."
              maxLength={1000}
              required
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="task-form-due" className={labelClass}>
                Due date
              </label>
              <input
                id="task-form-due"
                type="date"
                className={inputClass}
                value={form.dueDate}
                onChange={(event) => updateField("dueDate", event.target.value)}
              />
            </div>
            <div>
              <label htmlFor="task-form-priority" className={labelClass}>
                Priority
              </label>
              <select
                id="task-form-priority"
                className={inputClass}
                value={form.priority}
                onChange={(event) =>
                  updateField("priority", event.target.value as TaskPriority)
                }
              >
                <option value="none">None</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div>
              <label htmlFor="task-form-category" className={labelClass}>
                Category
              </label>
              <select
                id="task-form-category"
                className={inputClass}
                value={form.category}
                onChange={(event) =>
                  updateField("category", event.target.value as TaskCategory)
                }
              >
                <option value="work">Work</option>
                <option value="personal">Personal</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label htmlFor="task-form-status" className={labelClass}>
                Status
              </label>
              <select
                id="task-form-status"
                className={inputClass}
                value={form.status}
                onChange={(event) =>
                  updateField("status", event.target.value as TaskStatus)
                }
              >
                <option value="pending">Pending</option>
                <option value="in_progress">In progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          {currentTeamId ? (
            <label className="flex items-center gap-2 rounded-xl border border-[var(--border)] px-3 py-2 text-[14px] text-[var(--text-h)]">
              <input
                type="checkbox"
                checked={form.includeTeam}
                onChange={(event) =>
                  updateField("includeTeam", event.target.checked)
                }
              />
              <span>
                Include team{" "}
                <span className="text-[12px] text-[var(--text)]">
                  (team #{currentTeamId})
                </span>
              </span>
            </label>
          ) : (
            <p className="rounded-xl border border-dashed border-[var(--border)] px-3 py-2 text-[12px] text-[var(--text)]">
              You're not on a team yet. This task will be personal.
            </p>
          )}

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              className={subtleBtnClass}
              onClick={() => {
                if (!isSubmitting) onClose();
              }}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={primaryBtnClass}
              disabled={
                isSubmitting ||
                !form.title.trim() ||
                !form.description.trim()
              }
            >
              {isSubmitting ? submittingLabel : submitLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskFormModal;

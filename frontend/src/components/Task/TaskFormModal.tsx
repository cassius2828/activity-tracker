import { useEffect, useRef, useState, type FormEvent } from "react";
import type { Task, TaskInput } from "../../types/task";
import Select from "../Ui/Select";
import {
  emptyTaskForm,
  taskFormFromTask,
  type TaskFormState,
} from "../../utils/taskForm";
import {
  categoryOptions,
  priorityOptions,
  statusOptions,
} from "../../constants/tasks";
import { useModalChrome } from "../../hooks/useModalChrome";
import {
  errorNoticeClass,
  eyebrowClass,
  inputClass,
  labelClass,
  primaryBtnClass,
  subtleBtnClass,
} from "../../styles/classNames";

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
  const [form, setForm] = useState<TaskFormState>(emptyTaskForm);
  const titleInputRef = useRef<HTMLInputElement | null>(null);

  useModalChrome({ open, onClose, lockClose: isSubmitting });

  useEffect(() => {
    if (!open) return;
    if (mode === "edit" && initialTask) {
      setForm(taskFormFromTask(initialTask, currentTeamId ?? null));
    } else {
      setForm({
        ...emptyTaskForm(),
        includeTeam: Boolean(defaultIncludeTeam && currentTeamId),
      });
    }
  }, [open, mode, initialTask, currentTeamId, defaultIncludeTeam]);

  useEffect(() => {
    if (!open) return;
    titleInputRef.current?.focus();
  }, [open]);

  if (!open) return null;

  const updateField = <K extends keyof TaskFormState>(
    key: K,
    value: TaskFormState[K],
  ) => setForm((previous) => ({ ...previous, [key]: value }));

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
  const safeClose = () => {
    if (!isSubmitting) onClose();
  };

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
        onClick={safeClose}
        className="absolute inset-0 h-full w-full cursor-default bg-black/50 backdrop-blur-sm"
      />

      <div className="relative z-10 w-full max-w-lg overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg)] shadow-[var(--shadow)]">
        <header className="flex items-start justify-between gap-4 border-b border-[var(--border)] px-6 py-4">
          <div>
            <p className={eyebrowClass}>Task</p>
            <h2 className="!m-0 !text-xl !tracking-tight text-[var(--text-h)]">
              {titleLabel}
            </h2>
          </div>
          <button
            type="button"
            onClick={safeClose}
            disabled={isSubmitting}
            className="rounded-lg px-2 py-1 text-[13px] font-medium text-[var(--text)] hover:bg-[var(--code-bg)] hover:text-[var(--text-h)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            Close
          </button>
        </header>

        <form onSubmit={handleSubmit} className="space-y-4 px-6 py-5">
          {errorMessage && (
            <p className={errorNoticeClass}>{errorMessage}</p>
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
              onChange={(event) =>
                updateField("description", event.target.value)
              }
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
                onChange={(event) =>
                  updateField("dueDate", event.target.value)
                }
              />
            </div>
            <div>
              <label htmlFor="task-form-priority" className={labelClass}>
                Priority
              </label>
              <Select
                id="task-form-priority"
                value={form.priority}
                onChange={(event) =>
                  updateField(
                    "priority",
                    event.target.value as TaskFormState["priority"],
                  )
                }
              >
                {priorityOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <label htmlFor="task-form-category" className={labelClass}>
                Category
              </label>
              <Select
                id="task-form-category"
                value={form.category}
                onChange={(event) =>
                  updateField(
                    "category",
                    event.target.value as TaskFormState["category"],
                  )
                }
              >
                {categoryOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <label htmlFor="task-form-status" className={labelClass}>
                Status
              </label>
              <Select
                id="task-form-status"
                value={form.status}
                onChange={(event) =>
                  updateField(
                    "status",
                    event.target.value as TaskFormState["status"],
                  )
                }
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
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
              onClick={safeClose}
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

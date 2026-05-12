import type {
  Task,
  TaskCategory,
  TaskPriority,
  TaskStatus,
} from "../service/tasks";

const priorityLabel: Record<TaskPriority, string> = {
  none: "None",
  low: "Low",
  medium: "Medium",
  high: "High",
};

const priorityStyles: Record<TaskPriority, string> = {
  none: "bg-[var(--border)] text-[var(--text-h)]",
  low: "bg-emerald-500/15 text-emerald-800 dark:text-emerald-200",
  medium: "bg-amber-500/15 text-amber-900 dark:text-amber-100",
  high: "bg-rose-500/15 text-rose-900 dark:text-rose-100",
};

const categoryLabel: Record<TaskCategory, string> = {
  work: "Work",
  personal: "Personal",
  other: "Other",
};

const statusLabel: Record<TaskStatus, string> = {
  pending: "Pending",
  in_progress: "In progress",
  completed: "Completed",
};

const statusStyles: Record<TaskStatus, string> = {
  pending: "bg-[var(--border)] text-[var(--text-h)]",
  in_progress: "bg-sky-500/15 text-sky-900 dark:text-sky-100",
  completed: "bg-emerald-500/15 text-emerald-800 dark:text-emerald-200",
};

const formatDueDate = (iso: string): string => {
  if (!iso) return "No due date";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString(undefined, {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

type TaskDetailsCardProps = {
  task: Task;
  canEdit: boolean;
  canDelete: boolean;
  permissionReason?: string | null;
  isDeleting?: boolean;
  onEdit: () => void;
  onDelete?: () => void;
};

const TaskDetailsCard = ({
  task,
  canEdit,
  canDelete,
  permissionReason,
  isDeleting,
  onEdit,
  onDelete,
}: TaskDetailsCardProps) => {
  return (
    <article className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg)] shadow-[var(--shadow)]">
      <header className="flex flex-wrap items-start justify-between gap-4 border-b border-[var(--border)] px-6 py-5">
        <div className="min-w-0 flex-1 space-y-2">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">
            Task #{task.id}
          </p>
          <h1 className="!m-0 !text-2xl !tracking-tight text-[var(--text-h)] sm:!text-3xl">
            {task.title}
          </h1>
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span
              className={`rounded-lg px-2.5 py-1 text-[12px] font-semibold uppercase tracking-wide ${statusStyles[task.status]}`}
            >
              {statusLabel[task.status]}
            </span>
            <span
              className={`rounded-lg px-2.5 py-1 text-[12px] font-semibold uppercase tracking-wide ${priorityStyles[task.priority]}`}
            >
              {priorityLabel[task.priority]} priority
            </span>
            <span className="rounded-lg border border-[var(--border)] bg-[var(--code-bg)] px-2.5 py-1 text-[12px] font-semibold uppercase tracking-wide text-[var(--text-h)]">
              {categoryLabel[task.category]}
            </span>
          </div>
        </div>

        {(canEdit || canDelete) && (
          <div className="flex shrink-0 items-center gap-2">
            {canEdit && (
              <button
                type="button"
                onClick={onEdit}
                className="rounded-xl bg-[var(--accent)] px-4 py-2 text-[14px] font-semibold text-white transition hover:brightness-110"
              >
                Edit task
              </button>
            )}
            {canDelete && onDelete && (
              <button
                type="button"
                onClick={onDelete}
                disabled={isDeleting}
                className="rounded-xl border border-rose-400/40 bg-rose-500/10 px-4 py-2 text-[14px] font-medium text-rose-800 transition hover:bg-rose-500/20 disabled:cursor-not-allowed disabled:opacity-60 dark:text-rose-100"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            )}
          </div>
        )}
      </header>

      <section className="space-y-5 px-6 py-5">
        <div>
          <p className="text-[12px] font-semibold uppercase tracking-wide text-[var(--text)]">
            Description
          </p>
          <p className="mt-2 whitespace-pre-wrap text-[15px] leading-relaxed text-[var(--text-h)]">
            {task.description || "No description provided."}
          </p>
        </div>

        <dl className="grid gap-4 sm:grid-cols-3">
          <div>
            <dt className="text-[12px] font-semibold uppercase tracking-wide text-[var(--text)]">
              Due date
            </dt>
            <dd className="mt-1 text-[15px] font-medium text-[var(--text-h)]">
              <time dateTime={task.dueDate || undefined}>
                {formatDueDate(task.dueDate)}
              </time>
            </dd>
          </div>
          <div>
            <dt className="text-[12px] font-semibold uppercase tracking-wide text-[var(--text)]">
              Owner
            </dt>
            <dd className="mt-1 text-[15px] font-medium text-[var(--text-h)]">
              User #{task.userId}
            </dd>
          </div>
          <div>
            <dt className="text-[12px] font-semibold uppercase tracking-wide text-[var(--text)]">
              Team
            </dt>
            <dd className="mt-1 text-[15px] font-medium text-[var(--text-h)]">
              {task.teamId ? `Team #${task.teamId}` : "Personal task"}
            </dd>
          </div>
        </dl>

        {!canEdit && permissionReason && (
          <p className="rounded-xl border border-dashed border-[var(--border)] px-3 py-2 text-[13px] text-[var(--text)]">
            {permissionReason}
          </p>
        )}
      </section>
    </article>
  );
};

export default TaskDetailsCard;

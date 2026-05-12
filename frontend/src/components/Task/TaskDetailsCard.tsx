import type { Task } from "../../types/task";
import {
  categoryLabel,
  priorityLabel,
  priorityStyles,
  statusLabel,
  statusStyles,
} from "../../constants/tasks";
import { formatDueDate } from "../../utils/date";
import {
  dangerBtnClass,
  eyebrowClass,
  primaryBtnClass,
} from "../../styles/classNames";

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
          <p className={eyebrowClass}>Task #{task.id}</p>
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
              <button type="button" onClick={onEdit} className={primaryBtnClass}>
                Edit task
              </button>
            )}
            {canDelete && onDelete && (
              <button
                type="button"
                onClick={onDelete}
                disabled={isDeleting}
                className={dangerBtnClass}
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

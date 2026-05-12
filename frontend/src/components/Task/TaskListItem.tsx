import { Link } from "react-router-dom";
import type { Task } from "../../types/task";
import { priorityLabel, priorityStyles } from "../../constants/tasks";
import { cardClass } from "../../styles/classNames";

type TaskListItemProps = {
  task: Task;
  canEdit: boolean;
  onEdit: (task: Task) => void;
};

const TaskListItem = ({ task, canEdit, onEdit }: TaskListItemProps) => (
  <article
    onClick={canEdit ? () => onEdit(task) : undefined}
    role={canEdit ? "button" : undefined}
    tabIndex={canEdit ? 0 : undefined}
    onKeyDown={(event) => {
      if (!canEdit) return;
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        onEdit(task);
      }
    }}
    className={`${cardClass} transition hover:border-[var(--accent-border)]/40 ${
      canEdit
        ? "cursor-pointer focus:outline-none focus-visible:border-[var(--accent-border)] focus-visible:ring-2 focus-visible:ring-[var(--accent)]/35"
        : ""
    }`}
  >
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div className="min-w-0 flex-1 space-y-1">
        <h2 className="!m-0 !text-lg !tracking-tight text-[var(--text-h)]">
          {task.title}
        </h2>
        <p className="text-[14px] leading-relaxed text-[var(--text)]">
          {task.description}
        </p>
      </div>
      <span
        className={`shrink-0 rounded-lg px-2.5 py-1 text-[12px] font-semibold uppercase tracking-wide ${priorityStyles[task.priority]}`}
      >
        {priorityLabel[task.priority]}
      </span>
    </div>
    <p className="mt-3 text-[13px] text-[var(--text)]">
      Due{" "}
      <time
        dateTime={task.dueDate}
        className="font-medium text-[var(--text-h)]"
      >
        {task.dueDate || "No due date"}
      </time>
      <Link
        to={`/tasks/${task.id}`}
        onClick={(event) => event.stopPropagation()}
        className="ml-2 text-[var(--text-h)] underline-offset-2 hover:underline"
      >
        View details
      </Link>
    </p>
  </article>
);

export default TaskListItem;

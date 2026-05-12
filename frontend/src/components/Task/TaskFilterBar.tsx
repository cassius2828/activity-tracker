import type { TaskPriority } from "../../types/task";
import Select from "../Ui/Select";
import {
  cardCompactClass,
  inputClass,
  labelClass,
  subtleBtnClass,
} from "../../styles/classNames";

type FilterPriority = "all" | TaskPriority;

type TaskFilterBarProps = {
  query: string;
  priority: FilterPriority;
  onQueryChange: (next: string) => void;
  onPriorityChange: (next: FilterPriority) => void;
  onReset: () => void;
};

const TaskFilterBar = ({
  query,
  priority,
  onQueryChange,
  onPriorityChange,
  onReset,
}: TaskFilterBarProps) => (
  <section
    aria-label="Filters"
    className={`mb-6 flex flex-col gap-3 ${cardCompactClass} sm:flex-row sm:items-end`}
  >
    <div className="min-w-0 flex-1">
      <label htmlFor="task-search" className={labelClass}>
        Search
      </label>
      <input
        id="task-search"
        type="search"
        value={query}
        onChange={(event) => onQueryChange(event.target.value)}
        placeholder="Title or description…"
        className={inputClass}
      />
    </div>
    <div className="w-full sm:w-44">
      <label htmlFor="task-priority" className={labelClass}>
        Priority
      </label>
      <Select
        id="task-priority"
        value={priority}
        onChange={(event) =>
          onPriorityChange(event.target.value as FilterPriority)
        }
      >
        <option value="all">All</option>
        <option value="none">None</option>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </Select>
    </div>
    <button
      type="button"
      onClick={onReset}
      className={`${subtleBtnClass} h-[42px] shrink-0`}
    >
      Reset
    </button>
  </section>
);

export default TaskFilterBar;

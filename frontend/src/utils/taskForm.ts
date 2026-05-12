import type { Task } from "../types/task";
import { toDateInputValue } from "./date";
import type { TaskCategory, TaskPriority, TaskStatus } from "../types/task";

export type TaskFormState = {
  title: string;
  description: string;
  dueDate: string;
  priority: TaskPriority;
  category: TaskCategory;
  status: TaskStatus;
  includeTeam: boolean;
};

export const emptyTaskForm = (): TaskFormState => ({
  title: "",
  description: "",
  dueDate: "",
  priority: "none",
  category: "other",
  status: "pending",
  includeTeam: false,
});

/** Project a `Task` onto the form state, defaulting team toggle to "current user's team". */
export const taskFormFromTask = (
  task: Task,
  defaultTeamId: string | null | undefined,
): TaskFormState => ({
  title: task.title,
  description: task.description,
  dueDate: toDateInputValue(task.dueDate),
  priority: task.priority,
  category: task.category,
  status: task.status,
  includeTeam:
    task.teamId !== null &&
    (defaultTeamId == null || task.teamId === defaultTeamId),
});

import type { Task, TaskInput, TaskLike } from "../types/task";

/** Coerce an API task payload into the shape the rest of the app expects. */
export const normalizeTask = (source: TaskLike): Task | null => {
  if (!source.id || !source.title || !source.description || !source.userId) {
    return null;
  }
  return {
    id: String(source.id),
    userId: String(source.userId),
    teamId:
      source.teamId === undefined || source.teamId === null
        ? null
        : String(source.teamId),
    title: source.title,
    description: source.description,
    dueDate: source.dueDate ? String(source.dueDate) : "",
    priority: source.priority ?? "none",
    category: source.category ?? "other",
    status: source.status ?? "pending",
  };
};

export const normalizeTaskCollection = (data: TaskLike[]): Task[] =>
  data.map(normalizeTask).filter((task): task is Task => task !== null);

/** Convert a `TaskInput` (form output) into the body the API expects. */
export const toApiBody = (input: TaskInput) => ({
  title: input.title,
  description: input.description,
  dueDate: input.dueDate ?? null,
  priority: input.priority,
  category: input.category,
  status: input.status,
  teamId:
    input.teamId === undefined || input.teamId === null || input.teamId === ""
      ? null
      : Number(input.teamId),
});

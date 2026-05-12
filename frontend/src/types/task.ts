export type TaskPriority = "none" | "low" | "medium" | "high";
export type TaskCategory = "work" | "personal" | "other";
export type TaskStatus = "pending" | "completed" | "in_progress";

export type Task = {
  id: string;
  userId: string;
  teamId: string | null;
  title: string;
  description: string;
  dueDate: string;
  priority: TaskPriority;
  category: TaskCategory;
  status: TaskStatus;
};

export type TaskInput = {
  title: string;
  description: string;
  dueDate?: string | null;
  priority?: TaskPriority;
  category?: TaskCategory;
  status?: TaskStatus;
  teamId?: string | number | null;
};

/** Loose shape returned by the API before normalization. */
export type TaskLike = Partial<Omit<Task, "teamId">> & {
  teamId?: string | number | null;
};

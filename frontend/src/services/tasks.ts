import { api } from "./api";

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

type TaskLike = Partial<Omit<Task, "teamId">> & {
  teamId?: string | number | null;
};

const normalizeTask = (source: TaskLike): Task | null => {
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

const normalizeTaskCollection = (data: TaskLike[]) =>
  data.map(normalizeTask).filter((task): task is Task => task !== null);

const toApiBody = (input: TaskInput) => ({
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

const getTasksByTeamId = async (teamId: string) => {
  try {
    const response = await api.get<TaskLike[]>("/tasks/team/" + teamId);
    return normalizeTaskCollection(response.data);
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const getTasksByUserId = async (userId: string) => {
  try {
    const response = await api.get<TaskLike[]>("/tasks/user/" + userId);
    return normalizeTaskCollection(response.data);
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const getTaskById = async (id: string) => {
  try {
    const response = await api.get<TaskLike>("/tasks/" + id);
    const normalizedTask = normalizeTask(response.data);
    if (!normalizedTask) {
      throw new Error("Task response is missing required fields");
    }
    return normalizedTask;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const createTask = async (taskBody: TaskInput) => {
  try {
    const response = await api.post<TaskLike>("/tasks", toApiBody(taskBody));
    const normalizedTask = normalizeTask(response.data);
    if (!normalizedTask) {
      throw new Error("Task response is missing required fields");
    }
    return normalizedTask;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const updateTask = async (id: string, taskBody: TaskInput) => {
  try {
    const response = await api.put<TaskLike>(
      "/tasks/" + id,
      toApiBody(taskBody),
    );
    const normalizedTask = normalizeTask(response.data);
    if (!normalizedTask) {
      throw new Error("Task response is missing required fields");
    }
    return normalizedTask;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const deleteTask = async (id: string) => {
  try {
    const response = await api.delete<{ message: string }>("/tasks/" + id);
    return response.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export {
  getTasksByTeamId,
  getTasksByUserId,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
};

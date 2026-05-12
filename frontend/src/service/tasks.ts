import { api } from "./api";
export type Task = {
  id: string;
  userId: string;
  title: string;
  description: string;
  dueDate: string;
  priority: "none" | "low" | "medium" | "high";
  category: "work" | "personal" | "other";
  status: "pending" | "completed" | "in_progress";
};

type TaskLike = Partial<Task> & {
  tasks?: Partial<Task>;
};

const normalizeTask = (taskLike: TaskLike): Task | null => {
  const source = taskLike.tasks ?? taskLike;
  if (!source.id || !source.title || !source.description || !source.userId) {
    return null;
  }
  return {
    id: String(source.id),
    userId: String(source.userId),
    title: source.title,
    description: source.description,
    dueDate: source.dueDate ? String(source.dueDate) : "",
    priority: source.priority ?? "none",
    category: source.category ?? "other",
    status: source.status ?? "pending",
  };
};

const normalizeTaskCollection = (data: TaskLike[]) =>
  data
    .map(normalizeTask)
    .filter((task): task is Task => task !== null);

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

const createTask = async (taskBody: Omit<Task, "id">) => {
  try {
    const response = await api.post<TaskLike>("/tasks", taskBody);
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

const updateTask = async (id: string, taskBody: Omit<Task, "id">) => {
  try {
    const response = await api.put<TaskLike>("/tasks/" + id, taskBody);
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
export { getTasksByTeamId, getTasksByUserId, getTaskById, createTask, updateTask, deleteTask };

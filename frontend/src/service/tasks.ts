import { api } from "./api";
type Task = {
  id: string;
  userId: string;
  title: string;
  description: string;
  dueDate: string;
  priority: "low" | "medium" | "high";
  category: "work" | "personal" | "other";
  status: "pending" | "completed" | "in_progress";
};

const getTasks = async () => {
  try {
    const response = await api.get<Task[]>("/tasks");
    return response.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const getTaskById = async (id: string) => {
  try {
    const response = await api.get<Task>("/tasks/" + id);
    return response.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const createTask = async (taskBody: Omit<Task, "id">) => {
  try {
    const response = await api.post<Task>("/tasks", taskBody);
    return response.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const updateTask = async (id: string, taskBody: Omit<Task, "id">) => {
  try {
    const response = await api.put<Task>("/tasks/" + id, taskBody);
    return response.data;
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
export { getTasks, getTaskById, createTask, updateTask, deleteTask };

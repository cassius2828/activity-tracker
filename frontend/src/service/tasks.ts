import axios from "axios";
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
    const response = await axios.get<Task[]>(
      import.meta.env.BACKEND_URL + "/tasks",
    );
    return response.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const getTaskById = async (id: string) => {
  try {
    const response = await axios.get<Task>(
      import.meta.env.BACKEND_URL + "/tasks/" + id,
    );
    return response.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const createTask = async (taskBody: Omit<Task, "id">) => {
  try {
    const response = await axios.post<Task>(
      import.meta.env.BACKEND_URL + "/tasks",
      taskBody,
    );
    return response.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const updateTask = async (id: string, taskBody: Omit<Task, "id">) => {
  try {
    const response = await axios.put<Task>(
      import.meta.env.BACKEND_URL + "/tasks/" + id,
      taskBody,
    );
    return response.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const deleteTask = async (id: string) => {
  try {
    const response = await axios.delete<{ message: string }>(
      import.meta.env.BACKEND_URL + "/tasks/" + id,
    );
    return response.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
export { getTasks, getTaskById, createTask, updateTask, deleteTask };

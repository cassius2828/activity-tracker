import { api } from "./api";
import type {
  Task,
  TaskCategory,
  TaskInput,
  TaskLike,
  TaskPriority,
  TaskStatus,
} from "../types/task";
import {
  normalizeTask,
  normalizeTaskCollection,
  toApiBody,
} from "../utils/normalizeTask";

export type { Task, TaskCategory, TaskInput, TaskPriority, TaskStatus };

const requireTask = (raw: TaskLike): Task => {
  const normalized = normalizeTask(raw);
  if (!normalized) {
    throw new Error("Task response is missing required fields");
  }
  return normalized;
};

export const getTasksByTeamId = async (
  teamId: string,
  signal?: AbortSignal,
) => {
  const response = await api.get<TaskLike[]>(`/tasks/team/${teamId}`, {
    signal,
  });
  return normalizeTaskCollection(response.data);
};

export const getTasksByUserId = async (
  userId: string,
  signal?: AbortSignal,
) => {
  const response = await api.get<TaskLike[]>(`/tasks/user/${userId}`, {
    signal,
  });
  return normalizeTaskCollection(response.data);
};

export const getTaskById = async (id: string, signal?: AbortSignal) => {
  const response = await api.get<TaskLike>(`/tasks/${id}`, { signal });
  return requireTask(response.data);
};

export const createTask = async (taskBody: TaskInput) => {
  const response = await api.post<TaskLike>("/tasks", toApiBody(taskBody));
  return requireTask(response.data);
};

export const updateTask = async (id: string, taskBody: TaskInput) => {
  const response = await api.put<TaskLike>(`/tasks/${id}`, toApiBody(taskBody));
  return requireTask(response.data);
};

export const deleteTask = async (id: string) => {
  const response = await api.delete<{ message: string }>(`/tasks/${id}`);
  return response.data;
};

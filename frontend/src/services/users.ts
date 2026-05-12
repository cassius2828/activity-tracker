import { api } from "./api";
import type { TeamUser } from "../types/team";

type User = TeamUser & {
  createdAt?: string;
  updatedAt?: string;
};

type CreateUserBody = {
  email: string;
  password: string;
  confirmPassword: string;
};

type UpdateUserBody = {
  email?: string;
  password?: string;
  confirmPassword?: string;
  role?: "admin" | "user";
};

export type { User, CreateUserBody, UpdateUserBody };

export const getUsers = async () => {
  const response = await api.get<User[]>("/users");
  return response.data;
};

export const getUserById = async (id: string) => {
  const response = await api.get<User>(`/users/${id}`);
  return response.data;
};

export const createUser = async (userBody: CreateUserBody) => {
  const response = await api.post<User>("/users", userBody);
  return response.data;
};

export const updateUser = async (id: string, userBody: UpdateUserBody) => {
  const response = await api.put<User>(`/users/${id}`, userBody);
  return response.data;
};

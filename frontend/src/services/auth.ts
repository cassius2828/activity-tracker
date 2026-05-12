import { api } from "./api";
import type {
  AuthResponse,
  AuthUser,
  LoginBody,
  SessionResponse,
  SignupBody,
} from "../types/auth";

export type { AuthResponse, AuthUser, LoginBody, SessionResponse, SignupBody };

export const login = async (loginBody: LoginBody) => {
  const response = await api.post<AuthResponse>("/auth/login", loginBody);
  return response.data;
};

export const register = async (signupBody: SignupBody) => {
  const response = await api.post<AuthResponse>("/auth/register", signupBody);
  return response.data;
};

export const logout = async () => {
  const response = await api.post<{ message: string }>("/auth/logout");
  return response.data;
};

export const getSession = async (signal?: AbortSignal) => {
  const response = await api.get<SessionResponse>("/auth/session", { signal });
  return response.data;
};

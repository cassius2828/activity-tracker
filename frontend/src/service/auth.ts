import { api } from "./api";

type SignupBody = {
  email: string;
  password: string;
  confirmPassword: string;
};

type LoginBody = Omit<SignupBody, "confirmPassword">;

type AuthUser = {
  id: number;
  email: string;
  role: "admin" | "user";
};

type AuthResponse = {
  message: string;
  user: AuthUser;
  sessionId?: string;
};

const login = async (loginBody: LoginBody) => {
  try {
    const response = await api.post<AuthResponse>("/auth/login", loginBody);
    return response.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const register = async (signupBody: SignupBody) => {
  try {
    const response = await api.post<AuthResponse>("/auth/register", signupBody);
    return response.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const logout = async () => {
  try {
    const response = await api.post<{ message: string }>("/auth/logout");
    return response.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export { login, register, logout };

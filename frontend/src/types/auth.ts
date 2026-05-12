export type AuthUser = {
  id: number;
  email: string;
  role: "admin" | "user";
  teamId: number | null;
};

export type AuthResponse = {
  message: string;
  user: AuthUser;
  sessionId?: string;
};

export type SessionResponse = {
  user: AuthUser;
};

export type SignupBody = {
  email: string;
  password: string;
  confirmPassword: string;
};

export type LoginBody = Omit<SignupBody, "confirmPassword">;

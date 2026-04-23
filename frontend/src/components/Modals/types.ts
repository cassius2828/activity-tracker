export type AuthFormValues = {
  email: string;
  password: string;
  confirmPassword: string;
};

export type SubmitAuthPayload = {
  email: string;
  password: string;
  confirmPassword?: string;
};

export type SubmitAuthFn = (data: SubmitAuthPayload) => void | Promise<void>;

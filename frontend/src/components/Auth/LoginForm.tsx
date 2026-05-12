import { useState } from "react";
import {
  AuthFormShell,
  AuthModeFooter,
  AuthSubmitButton,
  LabeledInput,
} from "./AuthFormPrimitives";
import type { AuthFormValues, SubmitAuthFn } from "./types";
import { validateEmail, validatePassword } from "../../utils/validation";

type LoginFormProps = {
  submitForm: SubmitAuthFn;
  onSwitchToSignup: () => void;
  formData: AuthFormValues;
  setFormData: (data: AuthFormValues) => void;
  isLoading: boolean;
};

type FieldErrors = {
  email: string | null;
  password: string | null;
};

const NO_ERRORS: FieldErrors = { email: null, password: null };

const LoginForm = ({
  submitForm,
  onSwitchToSignup,
  formData,
  setFormData,
  isLoading,
}: LoginFormProps) => {
  const [errors, setErrors] = useState<FieldErrors>(NO_ERRORS);

  const updateField = <K extends keyof AuthFormValues>(
    key: K,
    value: AuthFormValues[K],
  ) => {
    setFormData({ ...formData, [key]: value });
    if (errors[key as keyof FieldErrors]) {
      setErrors((prev) => ({ ...prev, [key]: null }));
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const next: FieldErrors = {
      email: validateEmail(formData.email),
      password: validatePassword(formData.password),
    };
    setErrors(next);
    if (next.email || next.password) return;
    submitForm(formData);
  };

  return (
    <AuthFormShell
      title="Welcome back"
      description="Sign in to manage your tasks."
      onSubmit={handleSubmit}
      footer={
        <AuthModeFooter
          prompt="No account?"
          actionLabel="Create one"
          onAction={onSwitchToSignup}
        />
      }
    >
      <LabeledInput
        id="login-email"
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        placeholder="you@example.com"
        value={formData.email}
        onChange={(e) => updateField("email", e.target.value)}
        error={errors.email}
      />
      <LabeledInput
        id="login-password"
        label="Password"
        name="password"
        type="password"
        autoComplete="current-password"
        placeholder="••••••••"
        value={formData.password}
        onChange={(e) => updateField("password", e.target.value)}
        error={errors.password}
      />
      <AuthSubmitButton isLoading={isLoading} loadingLabel="Signing in...">
        Sign in
      </AuthSubmitButton>
    </AuthFormShell>
  );
};

export default LoginForm;

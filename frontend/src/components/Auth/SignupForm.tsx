import { useState } from "react";
import {
  AuthFormShell,
  AuthModeFooter,
  AuthSubmitButton,
  LabeledInput,
} from "./AuthFormPrimitives";
import type { AuthFormValues, SubmitAuthFn } from "./types";
import {
  validateConfirmPassword,
  validateEmail,
  validatePassword,
} from "../../utils/validation";

type SignupFormProps = {
  submitForm: SubmitAuthFn;
  onSwitchToLogin: () => void;
  formData: AuthFormValues;
  setFormData: (data: AuthFormValues) => void;
  isLoading: boolean;
};

type FieldErrors = {
  email: string | null;
  password: string | null;
  confirmPassword: string | null;
};

const NO_ERRORS: FieldErrors = {
  email: null,
  password: null,
  confirmPassword: null,
};

const SignupForm = ({
  submitForm,
  onSwitchToLogin,
  formData,
  setFormData,
  isLoading,
}: SignupFormProps) => {
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
      confirmPassword: validateConfirmPassword(
        formData.password,
        formData.confirmPassword,
      ),
    };
    setErrors(next);
    if (next.email || next.password || next.confirmPassword) return;
    submitForm(formData);
  };

  return (
    <AuthFormShell
      title="Create your account"
      description="Start tracking in under a minute."
      onSubmit={handleSubmit}
      footer={
        <AuthModeFooter
          prompt="Already have an account?"
          actionLabel="Sign in"
          onAction={onSwitchToLogin}
        />
      }
    >
      <LabeledInput
        id="signup-email"
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
        id="signup-password"
        label="Password"
        name="password"
        type="password"
        autoComplete="new-password"
        placeholder="••••••••"
        value={formData.password}
        onChange={(e) => updateField("password", e.target.value)}
        error={errors.password}
      />
      <LabeledInput
        id="signup-confirm"
        label="Confirm password"
        name="confirmPassword"
        type="password"
        autoComplete="new-password"
        placeholder="••••••••"
        value={formData.confirmPassword}
        onChange={(e) => updateField("confirmPassword", e.target.value)}
        error={errors.confirmPassword}
      />
      <AuthSubmitButton isLoading={isLoading} loadingLabel="Creating account...">
        Create account
      </AuthSubmitButton>
    </AuthFormShell>
  );
};

export default SignupForm;

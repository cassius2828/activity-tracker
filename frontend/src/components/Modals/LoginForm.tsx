import {
  AuthFormShell,
  AuthModeFooter,
  AuthSubmitButton,
  LabeledInput,
} from "./AuthFormPrimitives";
import type { AuthFormValues, SubmitAuthFn } from "./types";

type LoginFormProps = {
  submitForm: SubmitAuthFn;
  onSwitchToSignup: () => void;
  formData: AuthFormValues;
  setFormData: (data: AuthFormValues) => void;
  isLoading: boolean;
};

const LoginForm = ({
  submitForm,
  onSwitchToSignup,
  formData,
  setFormData,
  isLoading,
}: LoginFormProps) => (
  <AuthFormShell
    title="Welcome back"
    description="Sign in to manage your tasks."
    onSubmit={(e) => {
      e.preventDefault();
      submitForm(formData);
    }}
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
      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
    />
    <LabeledInput
      id="login-password"
      label="Password"
      name="password"
      type="password"
      autoComplete="current-password"
      placeholder="••••••••"
      value={formData.password}
      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
    />
    <AuthSubmitButton isLoading={isLoading} loadingLabel="Signing in...">
      Sign in
    </AuthSubmitButton>
  </AuthFormShell>
);

export default LoginForm;

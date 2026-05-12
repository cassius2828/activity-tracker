import {
  AuthFormShell,
  AuthModeFooter,
  AuthSubmitButton,
  LabeledInput,
} from "./AuthFormPrimitives";
import type { AuthFormValues, SubmitAuthFn } from "./types";

type SignupFormProps = {
  submitForm: SubmitAuthFn;
  onSwitchToLogin: () => void;
  formData: AuthFormValues;
  setFormData: (data: AuthFormValues) => void;
  isLoading: boolean;
};

const SignupForm = ({
  submitForm,
  onSwitchToLogin,
  formData,
  setFormData,
  isLoading,
}: SignupFormProps) => (
  <AuthFormShell
    title="Create your account"
    description="Start tracking in under a minute."
    onSubmit={(e) => {
      e.preventDefault();
      submitForm(formData);
    }}
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
      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
    />
    <LabeledInput
      id="signup-password"
      label="Password"
      name="password"
      type="password"
      autoComplete="new-password"
      placeholder="••••••••"
      value={formData.password}
      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
    />
    <LabeledInput
      id="signup-confirm"
      label="Confirm password"
      name="confirmPassword"
      type="password"
      autoComplete="new-password"
      placeholder="••••••••"
      value={formData.confirmPassword}
      onChange={(e) =>
        setFormData({ ...formData, confirmPassword: e.target.value })
      }
    />
    <AuthSubmitButton isLoading={isLoading} loadingLabel="Creating account...">
      Create account
    </AuthSubmitButton>
  </AuthFormShell>
);

export default SignupForm;

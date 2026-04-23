import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { login, register } from "../../service/auth";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import {
  authCardClass,
  authCardInnerClass,
  authGlowBottomClass,
  authGlowTopClass,
  authPageWrapClass,
} from "./styles";
import type { AuthFormValues, SubmitAuthPayload } from "./types";

const emptyForm = (): AuthFormValues => ({
  email: "",
  password: "",
  confirmPassword: "",
});

const AuthModal = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const mode = searchParams.get("mode");
  const isLogin = mode !== "signup";
  const [formData, setFormData] = useState<AuthFormValues>(emptyForm);

  const submitForm = async ({
    email,
    password,
    confirmPassword,
  }: SubmitAuthPayload) => {
    setIsLoading(true);
    try {
      if (isLogin) {
        await login({ email, password });
      } else {
        await register({
          email,
          password,
          confirmPassword: confirmPassword ?? "",
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => setFormData(emptyForm());

  return (
    <div className={authPageWrapClass}>
      <section aria-labelledby="auth-panel-title" className={authCardClass}>
        <div className={authGlowTopClass} />
        <div className={authGlowBottomClass} />

        <div className={authCardInnerClass}>
          {isLogin ? (
            <LoginForm
              submitForm={submitForm}
              formData={formData}
              setFormData={setFormData}
              onSwitchToSignup={() => {
                resetForm();
                setSearchParams({ mode: "signup" });
              }}
              isLoading={isLoading}
            />
          ) : (
            <SignupForm
              submitForm={submitForm}
              formData={formData}
              setFormData={setFormData}
              onSwitchToLogin={() => {
                resetForm();
                setSearchParams({ mode: "login" });
              }}
              isLoading={isLoading}
            />
          )}
        </div>
      </section>
    </div>
  );
};

export default AuthModal;

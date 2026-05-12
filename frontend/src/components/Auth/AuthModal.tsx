import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
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
import { useAuth } from "../../context/AuthContext";

const emptyForm = (): AuthFormValues => ({
  email: "",
  password: "",
  confirmPassword: "",
});

const AuthModal = () => {
  const navigate = useNavigate();
  const { setSession } = useAuth();
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
      const response = isLogin
        ? await login({ email, password })
        : await register({
            email,
            password,
            confirmPassword: confirmPassword ?? "",
          });
      setSession({
        userId: String(response.user.id),
        email: response.user.email,
        role: response.user.role,
        teamId: response.user.teamId === null ? null : String(response.user.teamId),
      });
      navigate("/teams");
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

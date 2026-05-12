import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

type RequireAdminProps = {
  children: ReactNode;
};

/** Renders children only when the validated session belongs to an admin. */
const RequireAdmin = ({ children }: RequireAdminProps) => {
  const { session, isAuthLoading } = useAuth();

  if (isAuthLoading) {
    return (
      <p className="mx-auto w-full max-w-3xl px-4 py-10 text-center text-[15px] text-[var(--text)] sm:px-6">
        Loading...
      </p>
    );
  }

  if (!session) {
    return <Navigate to="/auth?mode=login" replace />;
  }

  if (session.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default RequireAdmin;

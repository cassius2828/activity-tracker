import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

type RequireAuthProps = {
  children: ReactNode;
};

/** Redirects to `/auth?mode=login` if no session is present after the boot check. */
const RequireAuth = ({ children }: RequireAuthProps) => {
  const { session, isAuthLoading } = useAuth();
  const location = useLocation();

  if (isAuthLoading) {
    return (
      <p className="mx-auto w-full max-w-3xl px-4 py-10 text-center text-[15px] text-[var(--text)] sm:px-6">
        Loading...
      </p>
    );
  }

  if (!session) {
    const next = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/auth?mode=login&next=${next}`} replace />;
  }

  return <>{children}</>;
};

export default RequireAuth;

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

export type AuthSession = {
  userId: string;
  email?: string;
  role: "admin" | "user";
  teamId?: string | null;
};

type AuthContextValue = {
  session: AuthSession | null;
  setSession: (session: AuthSession | null) => void;
};

const SESSION_STORAGE_KEY = "activity-tracker.auth-session.v1";

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const loadStoredSession = (): AuthSession | null => {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(SESSION_STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthSession;
  } catch (err) {
    console.error(err);
    return null;
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSessionState] = useState<AuthSession | null>(() => loadStoredSession());

  const setSession = (nextSession: AuthSession | null) => {
    setSessionState(nextSession);
    if (typeof window === "undefined") return;
    if (nextSession) {
      window.localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(nextSession));
      return;
    }
    window.localStorage.removeItem(SESSION_STORAGE_KEY);
  };

  const value = useMemo(() => ({ session, setSession }), [session]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
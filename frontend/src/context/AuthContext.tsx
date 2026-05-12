import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { getSession } from "../service/auth";

export type AuthSession = {
  userId: string;
  email?: string;
  role: "admin" | "user";
  teamId?: string | null;
};

type AuthContextValue = {
  session: AuthSession | null;
  setSession: (session: AuthSession | null) => void;
  refreshSession: () => Promise<AuthSession | null>;
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

  const setSession = useCallback((nextSession: AuthSession | null) => {
    setSessionState(nextSession);
    if (typeof window === "undefined") return;
    if (nextSession) {
      window.localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(nextSession));
      return;
    }
    window.localStorage.removeItem(SESSION_STORAGE_KEY);
  }, []);

  // Re-fetch the current user from the server and sync the cached AuthSession.
  // Use after any action that could change the current user's identity / team / role.
  const refreshSession = useCallback(async (): Promise<AuthSession | null> => {
    try {
      const { user } = await getSession();
      const next: AuthSession = {
        userId: String(user.id),
        email: user.email,
        role: user.role,
        teamId: user.teamId === null ? null : String(user.teamId),
      };
      setSession(next);
      return next;
    } catch (err) {
      console.error(err);
      // 401 (or any failure) means the cached session is no longer valid.
      setSession(null);
      return null;
    }
  }, [setSession]);

  const value = useMemo(
    () => ({ session, setSession, refreshSession }),
    [session, setSession, refreshSession],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
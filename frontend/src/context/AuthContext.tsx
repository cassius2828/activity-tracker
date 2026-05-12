import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";
import { getSession } from "../services/auth";
import { AUTH_EXPIRED_EVENT } from "../services/api";

export type AuthSession = {
  userId: string;
  email?: string;
  role: "admin" | "user";
  teamId?: string | null;
};

type AuthContextValue = {
  session: AuthSession | null;
  isAuthLoading: boolean;
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
  const [session, setSessionState] = useState<AuthSession | null>(() =>
    loadStoredSession(),
  );
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  /** Guards the auth:expired handler so we redirect at most once per logout. */
  const isExpiringRef = useRef(false);

  const setSession = useCallback((nextSession: AuthSession | null) => {
    setSessionState(nextSession);
    if (typeof window === "undefined") return;
    if (nextSession) {
      window.localStorage.setItem(
        SESSION_STORAGE_KEY,
        JSON.stringify(nextSession),
      );
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
    } catch {
      // 401 (or any failure) means the cached session is no longer valid.
      // Errors are already logged centrally by the api interceptor.
      setSession(null);
      return null;
    }
  }, [setSession]);

  // Validate the cached session against the server on mount. Prevents
  // localStorage tampering from rendering admin UI to non-admin users.
  useEffect(() => {
    let cancelled = false;
    void (async () => {
      await refreshSession();
      if (!cancelled) setIsAuthLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [refreshSession]);

  // Single source of truth for "the server says you're no longer logged in".
  // Triggered by the api 401 interceptor.
  useEffect(() => {
    const handleExpired = () => {
      if (isExpiringRef.current) return;
      isExpiringRef.current = true;
      setSession(null);
      navigate("/auth?mode=login", { replace: true });
      // Allow future expirations to fire after this one is handled.
      window.setTimeout(() => {
        isExpiringRef.current = false;
      }, 0);
    };
    window.addEventListener(AUTH_EXPIRED_EVENT, handleExpired);
    return () => window.removeEventListener(AUTH_EXPIRED_EVENT, handleExpired);
  }, [navigate, setSession]);

  const value = useMemo(
    () => ({ session, isAuthLoading, setSession, refreshSession }),
    [session, isAuthLoading, setSession, refreshSession],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components -- co-located hook keeps consumers' import paths short
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

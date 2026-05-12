import axios, { isAxiosError } from "axios";

export const AUTH_EXPIRED_EVENT = "auth:expired";

export const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
});

/**
 * Single place for cross-cutting failure handling so individual service methods
 * don't need to wrap every call in try/catch just to log. Errors still propagate
 * to callers, which can decide how to surface them.
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (isAxiosError(error)) {
      const status = error.response?.status;
      const url = error.config?.url ?? "";
      // 401 outside of the auth surface itself = expired session.
      // Broadcast so AuthProvider can clear cache + redirect once.
      if (status === 401 && !url.startsWith("/auth")) {
        window.dispatchEvent(new CustomEvent(AUTH_EXPIRED_EVENT));
      }
    }
    if (import.meta.env.DEV) {
      console.error("[api] request failed", error);
    }
    return Promise.reject(error);
  },
);

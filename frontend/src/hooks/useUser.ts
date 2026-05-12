import { useEffect, useState } from "react";
import axios from "axios";
import { getUserById, type User } from "../services/users";

type UseUserResult = {
  user: User | null;
  isLoading: boolean;
  error: string | null;
};

/** Loads a user by id with cancellation. Skips when `enabled` is false. */
export const useUser = (id: string | undefined, enabled = true): UseUserResult => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(Boolean(id && enabled));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled || !id) {
      setUser(null);
      setIsLoading(false);
      setError(null);
      return;
    }
    const controller = new AbortController();
    setIsLoading(true);
    setError(null);
    void (async () => {
      try {
        const result = await getUserById(id, controller.signal);
        if (controller.signal.aborted) return;
        setUser(result);
      } catch (err) {
        if (axios.isCancel(err) || controller.signal.aborted) return;
        setUser(null);
        setError("Could not load user.");
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    })();
    return () => controller.abort();
  }, [id, enabled]);

  return { user, isLoading, error };
};

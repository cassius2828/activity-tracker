import { useCallback, useEffect, useState } from "react";
import { getJoinRequests } from "../services/joinRequests";
import type { JoinRequestRow } from "../types/joinRequest";

type UseAdminJoinRequestsResult = {
  requests: JoinRequestRow[];
  setRequests: React.Dispatch<React.SetStateAction<JoinRequestRow[]>>;
  isLoading: boolean;
  error: string | null;
  reload: () => Promise<void>;
};

/** Loads the admin queue of pending join requests. No-op when `enabled` is false. */
export const useAdminJoinRequests = (
  enabled: boolean,
): UseAdminJoinRequestsResult => {
  const [requests, setRequests] = useState<JoinRequestRow[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(enabled);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    if (!enabled) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const rows = await getJoinRequests();
      setRequests(rows);
    } catch {
      setError("Failed to load join requests.");
    } finally {
      setIsLoading(false);
    }
  }, [enabled]);

  useEffect(() => {
    void reload();
  }, [reload]);

  return { requests, setRequests, isLoading, error, reload };
};

import { useCallback, useEffect, useState } from "react";
import axios from "axios";
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

  // Public imperative reload — used after mutations. Not cancellable because
  // the caller expects the refetched list to land.
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

  // Mount-time fetch with cancellation so a fast unmount / enabled-toggle
  // doesn't race a stale response into the next consumer.
  useEffect(() => {
    if (!enabled) {
      setIsLoading(false);
      return;
    }
    const controller = new AbortController();
    setIsLoading(true);
    setError(null);
    void (async () => {
      try {
        const rows = await getJoinRequests(controller.signal);
        if (controller.signal.aborted) return;
        setRequests(rows);
      } catch (err) {
        if (axios.isCancel(err) || controller.signal.aborted) return;
        setError("Failed to load join requests.");
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    })();
    return () => controller.abort();
  }, [enabled]);

  return { requests, setRequests, isLoading, error, reload };
};

import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { getMyJoinRequests } from "../services/joinRequests";
import type { MyJoinRequestRow } from "../types/joinRequest";

type UseMyJoinRequestsResult = {
  myJoinRequests: MyJoinRequestRow[];
  refresh: () => Promise<void>;
  setMyJoinRequests: React.Dispatch<React.SetStateAction<MyJoinRequestRow[]>>;
};

/** Loads the current user's pending join requests. Returns a `refresh` callback. */
export const useMyJoinRequests = (
  userId: string | undefined,
): UseMyJoinRequestsResult => {
  const [myJoinRequests, setMyJoinRequests] = useState<MyJoinRequestRow[]>([]);

  // Public imperative refresh — used after mutations (join/leave). Not cancellable
  // because the consumer expects the refetch to complete and reflect the new state.
  const refresh = useCallback(async () => {
    if (!userId) {
      setMyJoinRequests([]);
      return;
    }
    try {
      const rows = await getMyJoinRequests();
      setMyJoinRequests(rows);
    } catch {
      setMyJoinRequests([]);
    }
  }, [userId]);

  // Mount + userId-change effect: cancellable so a fast logout / user swap
  // doesn't race a stale response into the new user's state.
  useEffect(() => {
    if (!userId) {
      setMyJoinRequests([]);
      return;
    }
    const controller = new AbortController();
    void (async () => {
      try {
        const rows = await getMyJoinRequests(controller.signal);
        if (controller.signal.aborted) return;
        setMyJoinRequests(rows);
      } catch (err) {
        if (axios.isCancel(err) || controller.signal.aborted) return;
        setMyJoinRequests([]);
      }
    })();
    return () => controller.abort();
  }, [userId]);

  return { myJoinRequests, refresh, setMyJoinRequests };
};

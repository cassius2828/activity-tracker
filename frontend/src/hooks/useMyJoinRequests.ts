import { useCallback, useEffect, useState } from "react";
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

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { myJoinRequests, refresh, setMyJoinRequests };
};

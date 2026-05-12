import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { getTasksByTeamId, getTasksByUserId } from "../services/tasks";
import type { Task } from "../types/task";

type Args = {
  teamId?: string;
  userId: string;
};

type UseTasksResult = {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  isLoading: boolean;
  error: string | null;
};

/**
 * Fetches the right task collection based on `teamId` or `userId` and
 * cancels stale responses if the args change mid-flight.
 */
export const useTasks = ({ teamId, userId }: Args): UseTasksResult => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(
    async (signal: AbortSignal) => {
      setIsLoading(true);
      setError(null);
      try {
        const data = teamId
          ? await getTasksByTeamId(teamId, signal)
          : await getTasksByUserId(userId, signal);
        if (signal.aborted) return;
        setTasks(data);
      } catch (err) {
        if (axios.isCancel(err) || signal.aborted) return;
        setTasks([]);
        setError("Could not load tasks right now.");
      } finally {
        if (!signal.aborted) setIsLoading(false);
      }
    },
    [teamId, userId],
  );

  useEffect(() => {
    const controller = new AbortController();
    void fetchTasks(controller.signal);
    return () => controller.abort();
  }, [fetchTasks]);

  return { tasks, setTasks, isLoading, error };
};

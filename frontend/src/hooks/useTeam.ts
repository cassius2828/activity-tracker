import { useEffect, useState } from "react";
import { getTeamById } from "../services/teams";

type UseTeamResult = {
  teamName: string | null;
  error: string | null;
};

/** Loads a team's display name by id, with cancellation if the id changes. */
export const useTeam = (teamId: string | null | undefined): UseTeamResult => {
  const [teamName, setTeamName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!teamId) {
      setTeamName(null);
      setError(null);
      return;
    }

    const controller = new AbortController();
    const load = async () => {
      try {
        const team = await getTeamById(teamId);
        if (controller.signal.aborted) return;
        setTeamName(team?.name ?? null);
        setError(null);
      } catch {
        if (controller.signal.aborted) return;
        setTeamName(null);
        setError("Could not load team details.");
      }
    };
    void load();
    return () => controller.abort();
  }, [teamId]);

  return { teamName, error };
};

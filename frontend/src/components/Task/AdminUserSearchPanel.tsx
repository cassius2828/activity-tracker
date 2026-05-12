import { useCallback, useEffect, useState } from "react";
import { searchUsers, assignUserToTeam } from "../../services/teams";
import type { TeamUser } from "../../types/team";
import { useDebouncedSearch } from "../../hooks/useDebouncedSearch";
import { inputClass } from "../../styles/classNames";

type AdminUserSearchPanelProps = {
  teamId: string;
  currentUserId: string;
  onAssigned: (assignedUser: TeamUser, teamId: string) => void;
  onError: (message: string) => void;
};

const AdminUserSearchPanel = ({
  teamId,
  currentUserId,
  onAssigned,
  onError,
}: AdminUserSearchPanelProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [assigningUserId, setAssigningUserId] = useState<string | null>(null);
  const [results, setResults] = useState<TeamUser[]>([]);

  const fetcher = useCallback(
    async (trimmed: string, signal: AbortSignal) => {
      const users = await searchUsers(trimmed);
      if (signal.aborted) return [];
      const next = users.filter((user) => {
        const isCurrentUser = String(user.id) === String(currentUserId);
        const isAlreadyOnViewedTeam =
          teamId != null && String(user.teamId) === String(teamId);
        return !isCurrentUser && !isAlreadyOnViewedTeam;
      });
      setResults(next);
      return next;
    },
    [currentUserId, teamId],
  );

  const { isLoading, error } = useDebouncedSearch({ query: searchQuery, fetcher });

  useEffect(() => {
    if (error) onError("Could not search users.");
  }, [error, onError]);

  const handleAssign = async (targetUserId: string) => {
    setAssigningUserId(targetUserId);
    const targetUser = results.find((user) => user.id === targetUserId);
    try {
      await assignUserToTeam({ teamId, userId: targetUserId });
      setResults((previous) =>
        previous.map((user) =>
          user.id === targetUserId ? { ...user, teamId } : user,
        ),
      );
      if (targetUser) onAssigned(targetUser, teamId);
    } catch {
      onError("Could not assign user to team.");
    }
    setAssigningUserId(null);
  };

  return (
    <div className="mt-5 border-t border-[var(--border)] pt-4">
      <h3 className="!m-0 !text-base !tracking-tight text-[var(--text-h)]">
        Assign users to this team
      </h3>
      <div className="mt-3">
        <input
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          className={inputClass}
          placeholder="Search by email"
          type="search"
        />
      </div>

      {searchQuery.trim() && (
        <div className="mt-2 text-[12px] text-[var(--text)]">
          {isLoading
            ? "Searching..."
            : results.length === 0
              ? "No matching users."
              : `${results.length} match${results.length === 1 ? "" : "es"}`}
        </div>
      )}

      {results.length > 0 && (
        <ul className="mt-4 space-y-2">
          {results.map((user) => {
            const isAlreadyInTeam = user.teamId === teamId;
            return (
              <li
                key={user.id}
                className="flex items-center justify-between gap-3 rounded-xl border border-[var(--border)] px-3 py-2"
              >
                <div className="min-w-0">
                  <p className="truncate text-[14px] font-medium text-[var(--text-h)]">
                    {user.email}
                  </p>
                  <p className="text-[12px] text-[var(--text)]">
                    {user.role}{" "}
                    {user.teamId
                      ? `• current team: ${user.teamId}`
                      : "• no team"}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => void handleAssign(user.id)}
                  disabled={isAlreadyInTeam || assigningUserId === user.id}
                  className="rounded-lg bg-[var(--accent)] px-3 py-1.5 text-[13px] font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isAlreadyInTeam
                    ? "Already added"
                    : assigningUserId === user.id
                      ? "Adding..."
                      : "Add"}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default AdminUserSearchPanel;

import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getTasksByTeamId, getTasksByUserId, type Task } from "../service/tasks";
import {
  assignUserToTeam,
  getTeamById,
  leaveTeam,
  searchUsers,
  type TeamUser,
} from "../service/teams";
import { requestJoinTeam } from "../service/joinRequests";

type Priority = "none" | "low" | "medium" | "high";

const priorityLabel: Record<Priority, string> = {
  none: "None",
  low: "Low",
  medium: "Medium",
  high: "High",
};

const priorityStyles: Record<Priority, string> = {
  none: "bg-[var(--border)] text-[var(--text-h)]",
  low: "bg-emerald-500/15 text-emerald-800 dark:text-emerald-200",
  medium: "bg-amber-500/15 text-amber-900 dark:text-amber-100",
  high: "bg-rose-500/15 text-rose-900 dark:text-rose-100",
};

const inputClass =
  "w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] px-4 py-2.5 text-[15px] text-[var(--text-h)] shadow-sm outline-none transition " +
  "placeholder:text-[var(--text)]/60 " +
  "focus:border-[var(--accent-border)] focus:ring-2 focus:ring-[var(--accent)]/25";

const Tasks = () => {
  const { session, setSession } = useAuth();
  const { teamId, userId } = useParams();

  const [query, setQuery] = useState("");
  const [priority, setPriority] = useState<"all" | Priority>("all");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoadingTasks, setIsLoadingTasks] = useState(false);
  const [tasksError, setTasksError] = useState<string | null>(null);
  const [teamName, setTeamName] = useState<string | null>(null);
  const [teamActionNotice, setTeamActionNotice] = useState<string | null>(null);
  const [isTeamActionLoading, setIsTeamActionLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<TeamUser[]>([]);
  const [isSearchingUsers, setIsSearchingUsers] = useState(false);
  const [assigningUserId, setAssigningUserId] = useState<string | null>(null);

  const currentUserId = session?.userId ?? userId ?? "";
  const isViewingTeamTasks = Boolean(teamId);
  const isMemberOfViewedTeam = Boolean(teamId && session?.teamId === teamId);
  const isAdmin = session?.role === "admin";

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return tasks.filter((t) => {
      const matchesText =
        !q ||
        t.title.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q);
      const matchesPriority = priority === "all" || t.priority === priority;
      return matchesText && matchesPriority;
    });
  }, [query, priority, tasks]);

  useEffect(() => {
    if (!teamId) return;

    const loadTeam = async () => {
      try {
        const team = await getTeamById(teamId);
        setTeamName(team?.name ?? null);
      } catch (err) {
        console.error(err);
        setTeamName(null);
        setTeamActionNotice("Could not load team details.");
      }
    };

    void loadTeam();
  }, [teamId]);

  useEffect(() => {
    const fetchTasks = async () => {
      setIsLoadingTasks(true);
      setTasksError(null);
      try {
        const data = teamId ? await getTasksByTeamId(teamId) : await getTasksByUserId(currentUserId);
        setTasks(data);
      } catch (err) {
        console.error(err);
        setTasks([]);
        setTasksError("Could not load tasks right now.");
      } finally {
        setIsLoadingTasks(false);
      }
    };
    void fetchTasks();
  }, [teamId, currentUserId]);

  const handleLeaveTeam = async () => {
    if (!teamId) return;
    if (!currentUserId) {
      setTeamActionNotice("You must be signed in to leave a team.");
      return;
    }
    setIsTeamActionLoading(true);
    try {
      const result = await leaveTeam({ teamId, userId: currentUserId });
      if (session?.userId === currentUserId) {
        setSession({ ...session, teamId: null });
      }
      setTeamActionNotice(result.message);
    } catch (err) {
      console.error(err);
      setTeamActionNotice("Could not leave team.");
    }
    setIsTeamActionLoading(false);
  };

  const handleJoinRequest = async () => {
    if (!teamId) return;
    if (!currentUserId) {
      setTeamActionNotice("You must be signed in to request joining a team.");
      return;
    }
    setIsTeamActionLoading(true);
    try {
      const result = await requestJoinTeam({ teamId, userId: currentUserId });
      setTeamActionNotice(result.message);
    } catch (err) {
      console.error(err);
      setTeamActionNotice("Could not submit join request.");
    }
    setIsTeamActionLoading(false);
  };

  const handleSearchUsers = async () => {
    setIsSearchingUsers(true);
    try {
      const users = await searchUsers(searchQuery);
      setSearchResults(users);
    } catch (err) {
      console.error(err);
      setSearchResults([]);
      setTeamActionNotice("Could not search users.");
    }
    setIsSearchingUsers(false);
  };

  const handleAssignUser = async (targetUserId: string) => {
    if (!teamId) return;
    setAssigningUserId(targetUserId);
    const targetUser = searchResults.find((user) => user.id === targetUserId);
    try {
      await assignUserToTeam({
        teamId,
        userId: targetUserId,
      });
      setSearchResults((previous) =>
        previous.map((user) => (user.id === targetUserId ? { ...user, teamId } : user)),
      );
      setTeamActionNotice(
        targetUser
          ? `Assigned ${targetUser.email} to the team.`
          : "Assigned user to the team.",
      );
    } catch (err) {
      console.error(err);
      setTeamActionNotice("Could not assign user to team.");
    }
    setAssigningUserId(null);
  };

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8 text-left sm:px-6 sm:py-10">
      <header className="mb-8 space-y-2">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">
          Tasks
        </p>
        <h1 className="!m-0 !text-3xl !tracking-tight text-[var(--text-h)] sm:!text-4xl">
          {isViewingTeamTasks ? (teamName ? `${teamName} team work` : "Team work") : "Your work"}
        </h1>
        <p className="text-[15px] text-[var(--text)]">
          {isViewingTeamTasks
            ? "View team tasks and manage team participation."
            : "Tasks scoped to this user."}
        </p>
      </header>

      {isViewingTeamTasks && teamId && (
        <section className="mb-6 rounded-2xl border border-[var(--border)] bg-[var(--bg)] p-4 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="!m-0 !text-lg !tracking-tight text-[var(--text-h)]">Team actions</h2>
              <p className="mt-1 text-[14px] text-[var(--text)]">
                Team ID <span className="font-mono text-[var(--text-h)]">{teamId}</span>
              </p>
            </div>
            {isMemberOfViewedTeam ? (
              <button
                type="button"
                onClick={() => void handleLeaveTeam()}
                disabled={isTeamActionLoading}
                className="rounded-xl border border-rose-400/40 bg-rose-500/10 px-4 py-2 text-[14px] font-medium text-rose-800 transition hover:bg-rose-500/20 disabled:cursor-not-allowed disabled:opacity-60 dark:text-rose-100"
              >
                {isTeamActionLoading ? "Leaving..." : "Leave team"}
              </button>
            ) : (
              <button
                type="button"
                onClick={() => void handleJoinRequest()}
                disabled={isTeamActionLoading}
                className="rounded-xl bg-[var(--accent)] px-4 py-2 text-[14px] font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isTeamActionLoading ? "Submitting..." : "Request to join team"}
              </button>
            )}
          </div>

          {teamActionNotice && (
            <p className="mt-3 rounded-xl border border-[var(--border)] bg-[var(--code-bg)] px-3 py-2 text-[14px] text-[var(--text)]">
              {teamActionNotice}
            </p>
          )}

          {isAdmin && (
            <div className="mt-5 border-t border-[var(--border)] pt-4">
              <h3 className="!m-0 !text-base !tracking-tight text-[var(--text-h)]">
                Assign users to this team
              </h3>
              <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                <input
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  className={inputClass}
                  placeholder="Search by email"
                  type="search"
                />
                <button
                  type="button"
                  onClick={() => void handleSearchUsers()}
                  disabled={isSearchingUsers}
                  className="rounded-xl border border-[var(--border)] px-4 py-2 text-[14px] font-medium text-[var(--text-h)] transition hover:bg-[var(--code-bg)] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSearchingUsers ? "Searching..." : "Search users"}
                </button>
              </div>

              {searchResults.length > 0 && (
                <ul className="mt-4 space-y-2">
                  {searchResults.map((user) => {
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
                            {user.role} {user.teamId ? `• current team: ${user.teamId}` : "• no team"}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => void handleAssignUser(user.id)}
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
          )}
        </section>
      )}

      {tasksError && (
        <p className="mb-6 rounded-xl border border-amber-400/40 bg-amber-500/10 px-4 py-3 text-[14px] text-amber-900 dark:text-amber-100">
          {tasksError}
        </p>
      )}

      <section
        aria-label="Filters"
        className="mb-6 flex flex-col gap-3 rounded-2xl border border-[var(--border)] bg-[var(--bg)] p-4 shadow-sm sm:flex-row sm:items-end"
      >
        <div className="min-w-0 flex-1">
          <label htmlFor="task-search" className="mb-1.5 block text-[13px] font-medium text-[var(--text-h)]">
            Search
          </label>
          <input
            id="task-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Title or description…"
            className={inputClass}
          />
        </div>
        <div className="w-full sm:w-44">
          <label htmlFor="task-priority" className="mb-1.5 block text-[13px] font-medium text-[var(--text-h)]">
            Priority
          </label>
          <select
            id="task-priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value as "all" | Priority)}
            className={inputClass}
          >
            <option value="all">All</option>
            <option value="none">None</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
        <button
          type="button"
          onClick={() => {
            setQuery("");
            setPriority("all");
          }}
          className="h-[42px] shrink-0 rounded-xl border border-[var(--border)] px-4 text-[14px] font-medium text-[var(--text-h)] transition hover:bg-[var(--code-bg)]"
        >
          Reset
        </button>
      </section>

      <ul className="flex flex-col gap-3">
        {filtered.map((task) => (
          <li key={task.id}>
            <article className="rounded-2xl border border-[var(--border)] bg-[var(--bg)] p-5 shadow-sm transition hover:border-[var(--accent-border)]/40">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0 flex-1 space-y-1">
                  <h2 className="!m-0 !text-lg !tracking-tight text-[var(--text-h)]">{task.title}</h2>
                  <p className="text-[14px] leading-relaxed text-[var(--text)]">{task.description}</p>
                </div>
                <span
                  className={`shrink-0 rounded-lg px-2.5 py-1 text-[12px] font-semibold uppercase tracking-wide ${priorityStyles[task.priority]}`}
                >
                  {priorityLabel[task.priority]}
                </span>
              </div>
              <p className="mt-3 text-[13px] text-[var(--text)]">
                Due{" "}
                <time dateTime={task.dueDate} className="font-medium text-[var(--text-h)]">
                  {task.dueDate || "No due date"}
                </time>
                <Link to={`/tasks/${task.id}`} className="ml-2 text-[var(--text-h)] underline-offset-2 hover:underline">
                  View details
                </Link>
              </p>
            </article>
          </li>
        ))}
      </ul>

      {!isLoadingTasks && filtered.length === 0 && (
        <p className="rounded-2xl border border-dashed border-[var(--border)] py-12 text-center text-[15px] text-[var(--text)]">
          No tasks match these filters.
        </p>
      )}

      {isLoadingTasks && (
        <p className="rounded-2xl border border-[var(--border)] py-8 text-center text-[15px] text-[var(--text)]">
          Loading tasks...
        </p>
      )}
    </div>
  );
};

export default Tasks;

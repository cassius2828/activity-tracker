import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { createTask, updateTask } from "../services/tasks";
import type { Task, TaskInput, TaskPriority } from "../types/task";
import TaskFormModal from "../components/Task/TaskFormModal";
import TaskFilterBar from "../components/Task/TaskFilterBar";
import TaskListItem from "../components/Task/TaskListItem";
import TeamActionsCard from "../components/Task/TeamActionsCard";
import PageShell from "../components/Ui/PageShell";
import { leaveTeam } from "../services/teams";
import { requestJoinTeam } from "../services/joinRequests";
import {
  eyebrowClass,
  primaryBtnClass,
  warningNoticeClass,
} from "../styles/classNames";
import { useTasks } from "../hooks/useTasks";
import { useTeam } from "../hooks/useTeam";
import { useMyJoinRequests } from "../hooks/useMyJoinRequests";

type TaskModalState =
  | { mode: "create" }
  | { mode: "edit"; task: Task }
  | null;

const Tasks = () => {
  const { session, refreshSession } = useAuth();
  const { teamId, userId } = useParams();

  const currentUserId = session?.userId ?? userId ?? "";
  const isViewingTeamTasks = Boolean(teamId);
  const isMemberOfViewedTeam = Boolean(teamId && session?.teamId === teamId);
  const isOnDifferentTeam = Boolean(
    teamId && session?.teamId && session.teamId !== teamId,
  );
  const isAdmin = session?.role === "admin";
  const canCreateTasks = Boolean(session?.userId);

  const [query, setQuery] = useState("");
  const [priority, setPriority] = useState<"all" | TaskPriority>("all");

  const { tasks, setTasks, isLoading: isLoadingTasks, error: tasksError } =
    useTasks({ teamId, userId: currentUserId });
  const { teamName } = useTeam(teamId);
  const { myJoinRequests, setMyJoinRequests } = useMyJoinRequests(
    session?.userId,
  );

  const [isTeamActionLoading, setIsTeamActionLoading] = useState(false);

  const [taskModal, setTaskModal] = useState<TaskModalState>(null);
  const [isSavingTask, setIsSavingTask] = useState(false);
  const [taskFormError, setTaskFormError] = useState<string | null>(null);

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

  const handleLeaveTeam = async () => {
    if (!teamId) return;
    if (!currentUserId) {
      toast.error("You must be signed in to leave a team.");
      return;
    }
    setIsTeamActionLoading(true);
    try {
      const result = await leaveTeam({ teamId, userId: currentUserId });
      if (session?.userId === currentUserId) await refreshSession();
      toast.success(result.message);
    } catch {
      toast.error("Could not leave team.");
    }
    setIsTeamActionLoading(false);
  };

  const handleJoinRequest = async () => {
    if (!teamId) return;
    if (!currentUserId) {
      toast.error("You must be signed in to request joining a team.");
      return;
    }
    if (isOnDifferentTeam) {
      toast.error("You must leave your team before joining another team.");
      return;
    }
    setIsTeamActionLoading(true);
    try {
      const result = await requestJoinTeam({ teamId, userId: currentUserId });
      // Optimistically push the new pending request so the join button
      // immediately reflects the new state without a re-fetch round trip.
      setMyJoinRequests((previous) => [
        ...previous,
        {
          id: Date.now(),
          teamId: Number(teamId),
          teamName: teamName ?? `Team ${teamId}`,
        },
      ]);
      toast.success(result.message);
    } catch {
      toast.error("Could not submit join request.");
    }
    setIsTeamActionLoading(false);
  };

  const openCreateTask = () => {
    setTaskFormError(null);
    setTaskModal({ mode: "create" });
  };

  const openEditTask = (task: Task) => {
    setTaskFormError(null);
    setTaskModal({ mode: "edit", task });
  };

  const closeTaskModal = () => {
    if (isSavingTask) return;
    setTaskModal(null);
    setTaskFormError(null);
  };

  const handleTaskSubmit = async (input: TaskInput) => {
    if (!taskModal) return;
    setIsSavingTask(true);
    setTaskFormError(null);
    try {
      if (taskModal.mode === "create") {
        const created = await createTask(input);
        setTasks((previous) => [created, ...previous]);
        toast.success("Task created.");
      } else {
        const updated = await updateTask(taskModal.task.id, input);
        setTasks((previous) =>
          previous.map((task) => (task.id === updated.id ? updated : task)),
        );
        toast.success("Task updated.");
      }
      setTaskModal(null);
    } catch {
      setTaskFormError(
        taskModal.mode === "create"
          ? "Could not create task. Try again."
          : "Could not save changes. Try again.",
      );
    } finally {
      setIsSavingTask(false);
    }
  };

  return (
    <PageShell>
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-2">
          <p className={eyebrowClass}>Tasks</p>
          <h1 className="!m-0 !text-3xl !tracking-tight text-[var(--text-h)] sm:!text-4xl">
            {isViewingTeamTasks
              ? teamName
                ? `${teamName} team work`
                : "Team work"
              : "Your work"}
          </h1>
          <p className="text-[15px] text-[var(--text)]">
            {isViewingTeamTasks
              ? "View team tasks and manage team participation."
              : "Tasks scoped to this user."}
          </p>
        </div>
        {canCreateTasks && (
          <button
            type="button"
            onClick={openCreateTask}
            className={primaryBtnClass}
          >
            New task
          </button>
        )}
      </header>

      {isViewingTeamTasks && teamId && (
        <TeamActionsCard
          teamId={teamId}
          isMember={isMemberOfViewedTeam}
          isOnDifferentTeam={isOnDifferentTeam}
          isAdmin={isAdmin}
          currentUserId={currentUserId}
          myJoinRequests={myJoinRequests}
          isActionLoading={isTeamActionLoading}
          onLeave={() => void handleLeaveTeam()}
          onRequestJoin={() => void handleJoinRequest()}
          onAdminAssigned={(targetUser, assignedTeamId) => {
            if (session?.userId === targetUser.id) void refreshSession();
            toast.success(
              `Assigned ${targetUser.email} to team #${assignedTeamId}.`,
            );
          }}
          onError={(message) => toast.error(message)}
        />
      )}

      {tasksError && <p className={`mb-6 ${warningNoticeClass}`}>{tasksError}</p>}

      <TaskFilterBar
        query={query}
        priority={priority}
        onQueryChange={setQuery}
        onPriorityChange={setPriority}
        onReset={() => {
          setQuery("");
          setPriority("all");
        }}
      />

      <ul className="flex flex-col gap-3">
        {filtered.map((task) => {
          const canEditTask = Boolean(
            session?.userId && session.userId === task.userId,
          );
          return (
            <li key={task.id}>
              <TaskListItem
                task={task}
                canEdit={canEditTask}
                onEdit={openEditTask}
              />
            </li>
          );
        })}
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

      <TaskFormModal
        open={taskModal !== null}
        mode={taskModal?.mode === "edit" ? "edit" : "create"}
        initialTask={taskModal?.mode === "edit" ? taskModal.task : null}
        currentTeamId={session?.teamId ?? null}
        defaultIncludeTeam={isViewingTeamTasks}
        isSubmitting={isSavingTask}
        errorMessage={taskFormError}
        onClose={closeTaskModal}
        onSubmit={handleTaskSubmit}
      />
    </PageShell>
  );
};

export default Tasks;

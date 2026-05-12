import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  deleteTask,
  getTaskById,
  updateTask,
  type Task,
  type TaskInput,
} from "../service/tasks";
import TaskDetailsCard from "../components/TaskDetailsCard";
import TaskFormModal from "../components/TaskFormModal";

const TaskDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { session } = useAuth();

  const [task, setTask] = useState<Task | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  const [isDeleting, setIsDeleting] = useState(false);

  // Mirror backend rules from controllers/tasks.ts updateTask:
  // owner OR teammate (when task has a teamId) OR admin.
  const { canEdit, permissionReason } = useMemo(() => {
    if (!task) return { canEdit: false, permissionReason: null as string | null };
    if (!session) {
      return {
        canEdit: false,
        permissionReason: "Sign in to edit this task.",
      };
    }
    const isOwner = session.userId === task.userId;
    const isTeammate =
      task.teamId !== null && session.teamId === task.teamId;
    const isAdmin = session.role === "admin";
    if (isOwner || isTeammate || isAdmin) {
      return { canEdit: true, permissionReason: null };
    }
    return {
      canEdit: false,
      permissionReason:
        task.teamId !== null
          ? "Only the task owner, a teammate, or an admin can edit this task."
          : "Only the task owner or an admin can edit this personal task.",
    };
  }, [task, session]);

  // Backend deletion is stricter: owner or admin only.
  const canDelete = useMemo(() => {
    if (!task || !session) return false;
    return session.userId === task.userId || session.role === "admin";
  }, [task, session]);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    const fetchTask = async () => {
      setIsLoading(true);
      setLoadError(null);
      try {
        const fetched = await getTaskById(id);
        if (!cancelled) setTask(fetched);
      } catch (err) {
        console.error(err);
        if (!cancelled) {
          setTask(null);
          setLoadError("Could not load this task.");
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };
    void fetchTask();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const handleEditSubmit = async (input: TaskInput) => {
    if (!task) return;
    setIsSaving(true);
    setEditError(null);
    try {
      const updated = await updateTask(task.id, input);
      setTask(updated);
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      setEditError("Could not save changes. Try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!task) return;
    const confirmed = window.confirm(
      "Delete this task? This cannot be undone.",
    );
    if (!confirmed) return;
    setIsDeleting(true);
    try {
      await deleteTask(task.id);
      navigate(-1);
    } catch (err) {
      console.error(err);
      setLoadError("Could not delete this task.");
      setIsDeleting(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8 text-left sm:px-6 sm:py-10">
      <nav className="mb-6 text-[13px]">
        <Link
          to="/teams"
          className="text-[var(--text)] underline-offset-2 hover:text-[var(--text-h)] hover:underline"
        >
          &larr; Back
        </Link>
      </nav>

      {isLoading && (
        <p className="rounded-2xl border border-[var(--border)] py-10 text-center text-[15px] text-[var(--text)]">
          Loading task...
        </p>
      )}

      {!isLoading && loadError && (
        <p className="rounded-xl border border-rose-400/40 bg-rose-500/10 px-4 py-3 text-[14px] text-rose-800 dark:text-rose-100">
          {loadError}
        </p>
      )}

      {!isLoading && !loadError && !task && (
        <p className="rounded-2xl border border-dashed border-[var(--border)] py-12 text-center text-[15px] text-[var(--text)]">
          Task not found.
        </p>
      )}

      {!isLoading && task && (
        <TaskDetailsCard
          task={task}
          canEdit={canEdit}
          canDelete={canDelete}
          permissionReason={permissionReason}
          isDeleting={isDeleting}
          onEdit={() => {
            setEditError(null);
            setIsEditing(true);
          }}
          onDelete={canDelete ? () => void handleDelete() : undefined}
        />
      )}

      <TaskFormModal
        open={isEditing && task !== null}
        mode="edit"
        initialTask={task}
        currentTeamId={session?.teamId ?? null}
        defaultIncludeTeam={Boolean(task?.teamId)}
        isSubmitting={isSaving}
        errorMessage={editError}
        onClose={() => {
          if (isSaving) return;
          setIsEditing(false);
          setEditError(null);
        }}
        onSubmit={handleEditSubmit}
      />
    </div>
  );
};

export default TaskDetails;

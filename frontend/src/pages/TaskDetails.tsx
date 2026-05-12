import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { deleteTask, getTaskById, updateTask } from "../services/tasks";
import type { Task, TaskInput } from "../types/task";
import TaskDetailsCard from "../components/Task/TaskDetailsCard";
import TaskFormModal from "../components/Task/TaskFormModal";
import PageShell from "../components/Ui/PageShell";
import ConfirmModal from "../components/Ui/ConfirmModal";
import { useTaskPermissions } from "../hooks/useTaskPermissions";
import { errorNoticeClass } from "../styles/classNames";

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

  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const { canEdit, canDelete, permissionReason } = useTaskPermissions(
    task,
    session,
  );

  useEffect(() => {
    if (!id) return;
    const controller = new AbortController();
    const fetchTask = async () => {
      setIsLoading(true);
      setLoadError(null);
      try {
        const fetched = await getTaskById(id, controller.signal);
        if (controller.signal.aborted) return;
        setTask(fetched);
      } catch (err) {
        if (axios.isCancel(err) || controller.signal.aborted) return;
        setTask(null);
        setLoadError("Could not load this task.");
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    };
    void fetchTask();
    return () => controller.abort();
  }, [id]);

  const handleEditSubmit = async (input: TaskInput) => {
    if (!task) return;
    setIsSaving(true);
    setEditError(null);
    try {
      const updated = await updateTask(task.id, input);
      setTask(updated);
      setIsEditing(false);
      toast.success("Task updated.");
    } catch {
      setEditError("Could not save changes. Try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!task) return;
    setIsDeleting(true);
    try {
      await deleteTask(task.id);
      toast.success("Task deleted.");
      navigate(-1);
    } catch {
      toast.error("Could not delete this task.");
      setIsDeleting(false);
      setIsConfirmingDelete(false);
    }
  };

  return (
    <PageShell>
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

      {!isLoading && loadError && <p className={errorNoticeClass}>{loadError}</p>}

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
          onDelete={canDelete ? () => setIsConfirmingDelete(true) : undefined}
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

      <ConfirmModal
        open={isConfirmingDelete}
        title="Delete task?"
        description="This cannot be undone."
        confirmLabel="Delete"
        destructive
        isWorking={isDeleting}
        onConfirm={() => void handleDelete()}
        onCancel={() => {
          if (!isDeleting) setIsConfirmingDelete(false);
        }}
      />
    </PageShell>
  );
};

export default TaskDetails;

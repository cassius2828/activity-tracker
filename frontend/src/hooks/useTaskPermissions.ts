import { useMemo } from "react";
import type { Task } from "../types/task";
import type { AuthSession } from "../context/AuthContext";

type TaskPermissions = {
  canEdit: boolean;
  canDelete: boolean;
  permissionReason: string | null;
};

/**
 * Mirrors the backend rules in `controllers/tasks.ts`:
 *   - `updateTask`: owner OR teammate (when task has a teamId) OR admin.
 *   - `deleteTask`: owner or admin only.
 */
export const useTaskPermissions = (
  task: Task | null,
  session: AuthSession | null,
): TaskPermissions =>
  useMemo(() => {
    if (!task) {
      return { canEdit: false, canDelete: false, permissionReason: null };
    }
    if (!session) {
      return {
        canEdit: false,
        canDelete: false,
        permissionReason: "Sign in to edit this task.",
      };
    }
    const isOwner = session.userId === task.userId;
    const isTeammate = task.teamId !== null && session.teamId === task.teamId;
    const isAdmin = session.role === "admin";

    const canEdit = isOwner || isTeammate || isAdmin;
    const canDelete = isOwner || isAdmin;
    const permissionReason = canEdit
      ? null
      : task.teamId !== null
        ? "Only the task owner, a teammate, or an admin can edit this task."
        : "Only the task owner or an admin can edit this personal task.";

    return { canEdit, canDelete, permissionReason };
  }, [task, session]);

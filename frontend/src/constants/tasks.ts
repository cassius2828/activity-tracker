import type { TaskCategory, TaskPriority, TaskStatus } from "../types/task";

export const priorityLabel: Record<TaskPriority, string> = {
  none: "None",
  low: "Low",
  medium: "Medium",
  high: "High",
};

export const priorityStyles: Record<TaskPriority, string> = {
  none: "bg-[var(--border)] text-[var(--text-h)]",
  low: "bg-emerald-500/15 text-emerald-800 dark:text-emerald-200",
  medium: "bg-amber-500/15 text-amber-900 dark:text-amber-100",
  high: "bg-rose-500/15 text-rose-900 dark:text-rose-100",
};

export const categoryLabel: Record<TaskCategory, string> = {
  work: "Work",
  personal: "Personal",
  other: "Other",
};

export const statusLabel: Record<TaskStatus, string> = {
  pending: "Pending",
  in_progress: "In progress",
  completed: "Completed",
};

export const statusStyles: Record<TaskStatus, string> = {
  pending: "bg-[var(--border)] text-[var(--text-h)]",
  in_progress: "bg-sky-500/15 text-sky-900 dark:text-sky-100",
  completed: "bg-emerald-500/15 text-emerald-800 dark:text-emerald-200",
};

export const priorityOptions: { value: TaskPriority; label: string }[] = [
  { value: "none", label: "None" },
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
];

export const categoryOptions: { value: TaskCategory; label: string }[] = [
  { value: "work", label: "Work" },
  { value: "personal", label: "Personal" },
  { value: "other", label: "Other" },
];

export const statusOptions: { value: TaskStatus; label: string }[] = [
  { value: "pending", label: "Pending" },
  { value: "in_progress", label: "In progress" },
  { value: "completed", label: "Completed" },
];

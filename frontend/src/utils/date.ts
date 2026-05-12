/** Convert an ISO date string to the YYYY-MM-DD format `<input type="date">` expects. */
export const toDateInputValue = (iso: string): string => {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
};

/** Human-readable due-date label, e.g. "Wed, Apr 12, 2025". Falls back to the raw string if parsing fails. */
export const formatDueDate = (iso: string): string => {
  if (!iso) return "No due date";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString(undefined, {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

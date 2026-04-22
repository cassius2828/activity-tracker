import { useMemo, useState } from "react";

type Priority = "none" | "low" | "medium" | "high";

type DummyTask = {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: Priority;
};

const DUMMY_TASKS: DummyTask[] = [
  {
    id: "1",
    title: "Draft project README",
    description: "Outline setup, stack, and env vars for new contributors.",
    dueDate: "2026-04-22",
    priority: "high",
  },
  {
    id: "2",
    title: "Wire auth to API",
    description: "Login/register forms, token storage, and protected fetch wrapper.",
    dueDate: "2026-04-25",
    priority: "medium",
  },
  {
    id: "3",
    title: "Review task filters UX",
    description: "Confirm priority + date range behavior on small screens.",
    dueDate: "2026-04-18",
    priority: "low",
  },
  {
    id: "4",
    title: "Backfill sample data",
    description: "Seed script or manual inserts for demo screenshots.",
    dueDate: "2026-05-01",
    priority: "none",
  },
];

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
  const [query, setQuery] = useState("");
  const [priority, setPriority] = useState<"all" | Priority>("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return DUMMY_TASKS.filter((t) => {
      const matchesText =
        !q ||
        t.title.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q);
      const matchesPriority = priority === "all" || t.priority === priority;
      return matchesText && matchesPriority;
    });
  }, [query, priority]);

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8 text-left sm:px-6 sm:py-10">
      <header className="mb-8 space-y-2">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">
          Tasks
        </p>
        <h1 className="!m-0 !text-3xl !tracking-tight text-[var(--text-h)] sm:!text-4xl">
          Your work
        </h1>
        <p className="text-[15px] text-[var(--text)]">
          Dummy list for layout—swap for API data when ready.
        </p>
      </header>

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
                  {task.dueDate}
                </time>
              </p>
            </article>
          </li>
        ))}
      </ul>

      {filtered.length === 0 && (
        <p className="rounded-2xl border border-dashed border-[var(--border)] py-12 text-center text-[15px] text-[var(--text)]">
          No tasks match these filters.
        </p>
      )}
    </div>
  );
};

export default Tasks;

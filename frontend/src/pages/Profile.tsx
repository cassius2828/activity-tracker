import { useParams } from "react-router-dom";

type DummyProfile = {
  displayName: string;
  email: string;
  role: "admin" | "user";
  joined: string;
  tasksOpen: number;
  tasksDone: number;
};

const DUMMY_BY_ID: Record<string, DummyProfile> = {
  "1": {
    displayName: "Alex Morgan",
    email: "alex.morgan@example.com",
    role: "admin",
    joined: "2026-01-12",
    tasksOpen: 6,
    tasksDone: 14,
  },
  "2": {
    displayName: "Jordan Lee",
    email: "jordan.lee@example.com",
    role: "user",
    joined: "2026-03-02",
    tasksOpen: 3,
    tasksDone: 9,
  },
};

const FALLBACK: DummyProfile = {
  displayName: "Demo user",
  email: "you@example.com",
  role: "user",
  joined: "2026-04-01",
  tasksOpen: 4,
  tasksDone: 11,
};

const Profile = () => {
  const { id } = useParams<{ id: string }>();
  const profile = (id && DUMMY_BY_ID[id]) ? DUMMY_BY_ID[id] : FALLBACK;

  return (
    <div className="mx-auto w-full max-w-xl px-4 py-8 text-left sm:px-6 sm:py-10">
      <header className="mb-8 space-y-2">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">
          Profile
        </p>
        <h1 className="!m-0 !text-3xl !tracking-tight text-[var(--text-h)] sm:!text-4xl">
          Account
        </h1>
        <p className="text-[15px] text-[var(--text)]">
          Shell with dummy data for user <span className="font-mono text-[var(--text-h)]">{id ?? "—"}</span>
        </p>
      </header>

      <section className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg)] shadow-[var(--shadow)]">
        <div className="border-b border-[var(--border)] bg-[var(--accent-bg)] px-6 py-8">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
            <div
              className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border border-[var(--accent-border)] bg-[var(--bg)] text-2xl font-semibold text-[var(--accent)]"
              aria-hidden
            >
              {profile.displayName
                .split(" ")
                .map((p) => p[0])
                .join("")
                .slice(0, 2)
                .toUpperCase()}
            </div>
            <div className="min-w-0 flex-1 text-center sm:text-left">
              <h2 className="!m-0 !text-2xl !tracking-tight text-[var(--text-h)]">{profile.displayName}</h2>
              <p className="mt-1 truncate text-[15px] text-[var(--text)]">{profile.email}</p>
              <p className="mt-2 inline-block rounded-lg border border-[var(--border)] bg-[var(--code-bg)] px-2.5 py-1 text-[12px] font-semibold uppercase tracking-wide text-[var(--text-h)]">
                {profile.role}
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-px bg-[var(--border)] sm:grid-cols-3">
          <div className="bg-[var(--bg)] px-4 py-4 text-center sm:px-5 sm:text-left">
            <p className="text-[12px] font-medium uppercase tracking-wide text-[var(--text)]">Member since</p>
            <p className="mt-1 text-[16px] font-semibold text-[var(--text-h)]">{profile.joined}</p>
          </div>
          <div className="bg-[var(--bg)] px-4 py-4 text-center sm:px-5 sm:text-left">
            <p className="text-[12px] font-medium uppercase tracking-wide text-[var(--text)]">Open tasks</p>
            <p className="mt-1 text-[16px] font-semibold text-[var(--text-h)]">{profile.tasksOpen}</p>
          </div>
          <div className="bg-[var(--bg)] px-4 py-4 text-center sm:px-5 sm:text-left">
            <p className="text-[12px] font-medium uppercase tracking-wide text-[var(--text)]">Completed</p>
            <p className="mt-1 text-[16px] font-semibold text-[var(--text-h)]">{profile.tasksDone}</p>
          </div>
        </div>

        <div className="px-6 py-5">
          <h3 className="!m-0 !text-base !tracking-tight text-[var(--text-h)]">Recent activity</h3>
          <p className="mt-2 text-[14px] text-[var(--text)]">
            Placeholder—hook up task history or audit log from the API later.
          </p>
          <ul className="mt-4 space-y-2 border-t border-[var(--border)] pt-4 text-[14px] text-[var(--text)]">
            <li className="flex justify-between gap-2">
              <span>Updated task priority</span>
              <time className="shrink-0 text-[13px] text-[var(--text)]/80">Apr 18</time>
            </li>
            <li className="flex justify-between gap-2">
              <span>Created “Wire auth to API”</span>
              <time className="shrink-0 text-[13px] text-[var(--text)]/80">Apr 16</time>
            </li>
            <li className="flex justify-between gap-2">
              <span>Completed “Draft project README”</span>
              <time className="shrink-0 text-[13px] text-[var(--text)]/80">Apr 12</time>
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
};

export default Profile;

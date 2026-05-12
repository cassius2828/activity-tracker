import Bar from "./Bar";
import MockChrome from "./MockChrome";

export type MockVariant =
  | "dashboard"
  | "tasks"
  | "team"
  | "profile"
  | "activity";

type MockProps = {
  variant: MockVariant;
  className?: string;
};

const DashboardMock = ({ className }: { className?: string }) => (
  <MockChrome title="Activity tracker" className={className}>
    <div className="grid grid-cols-3 gap-3">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="rounded-xl border border-[var(--border)] bg-[var(--code-bg)] p-3"
        >
          <Bar w="w-2/3" h="h-1.5" tone="bg-[var(--accent)]/60" />
          <div className="mt-2 text-[18px] font-semibold text-[var(--text-h)]">
            {i === 1 ? "12" : i === 2 ? "4" : "87%"}
          </div>
          <Bar w="w-1/2" h="h-1.5" />
        </div>
      ))}
    </div>
    <div className="mt-4 space-y-2.5">
      {[
        { w: "w-5/6", a: true },
        { w: "w-2/3", a: false },
        { w: "w-3/4", a: true },
        { w: "w-1/2", a: false },
      ].map((row, i) => (
        <div
          key={i}
          className="flex items-center gap-3 rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2.5"
        >
          <span
            className={`h-2 w-2 rounded-full ${
              row.a ? "bg-[var(--accent)]" : "bg-[var(--text)]/40"
            }`}
          />
          <Bar w={row.w} />
          <span className="ml-auto h-5 w-12 rounded-full bg-[var(--accent-bg)]" />
        </div>
      ))}
    </div>
  </MockChrome>
);

const TasksMock = ({ className }: { className?: string }) => (
  <MockChrome title="Tasks" className={className}>
    <div className="flex items-center gap-2">
      <span className="rounded-full bg-[var(--accent-bg)] px-2.5 py-1 text-[11px] font-semibold text-[var(--accent)]">
        All
      </span>
      <span className="rounded-full border border-[var(--border)] px-2.5 py-1 text-[11px] font-medium text-[var(--text)]">
        High
      </span>
      <span className="rounded-full border border-[var(--border)] px-2.5 py-1 text-[11px] font-medium text-[var(--text)]">
        Medium
      </span>
      <span className="ml-auto h-7 w-24 rounded-lg border border-[var(--border)] bg-[var(--code-bg)]" />
    </div>
    <div className="mt-4 space-y-2">
      {[
        { p: "high", w: "w-4/5" },
        { p: "med", w: "w-3/5" },
        { p: "low", w: "w-2/3" },
        { p: "high", w: "w-1/2" },
        { p: "med", w: "w-3/4" },
      ].map((row, i) => (
        <div
          key={i}
          className="flex items-center gap-3 rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2.5"
        >
          <span className="h-3.5 w-3.5 rounded-md border border-[var(--border)]" />
          <Bar w={row.w} />
          <span
            className={`ml-auto rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${
              row.p === "high"
                ? "bg-[color-mix(in_oklab,#ef4444_15%,transparent)] text-[#ef4444]"
                : row.p === "med"
                  ? "bg-[var(--accent-bg)] text-[var(--accent)]"
                  : "bg-[var(--code-bg)] text-[var(--text)]"
            }`}
          >
            {row.p}
          </span>
        </div>
      ))}
    </div>
  </MockChrome>
);

const TeamMock = ({ className }: { className?: string }) => (
  <MockChrome title="Team / Engineering" className={className}>
    <div className="flex items-center gap-3">
      <div className="flex -space-x-2">
        {["#aa3bff", "#22c55e", "#f59e0b", "#3b82f6"].map((c, i) => (
          <span
            key={i}
            className="h-8 w-8 rounded-full border-2 border-[var(--bg)]"
            style={{ background: c }}
          />
        ))}
      </div>
      <div className="ml-1">
        <Bar w="w-28" h="h-2" />
        <span className="mt-1.5 block h-1.5 w-16 rounded-full bg-[var(--code-bg)]" />
      </div>
      <span className="ml-auto rounded-lg bg-[var(--accent)] px-3 py-1.5 text-[11px] font-semibold text-white dark:text-[#0c0a10]">
        Invite
      </span>
    </div>
    <div className="mt-4 grid gap-2">
      {["Pending", "Pending", "Approved"].map((s, i) => (
        <div
          key={i}
          className="flex items-center gap-3 rounded-lg border border-[var(--border)] bg-[var(--code-bg)] px-3 py-2.5"
        >
          <span className="h-7 w-7 rounded-full bg-[var(--accent-bg)]" />
          <div className="flex-1">
            <Bar w="w-1/2" h="h-2" />
            <span className="mt-1.5 block h-1.5 w-1/3 rounded-full bg-[var(--bg)]" />
          </div>
          <span
            className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${
              s === "Approved"
                ? "bg-[color-mix(in_oklab,#22c55e_18%,transparent)] text-[#22c55e]"
                : "bg-[var(--accent-bg)] text-[var(--accent)]"
            }`}
          >
            {s}
          </span>
        </div>
      ))}
    </div>
  </MockChrome>
);

const ProfileMock = ({ className }: { className?: string }) => (
  <MockChrome title="Profile" className={className}>
    <div className="flex items-center gap-4">
      <div className="h-14 w-14 rounded-full bg-gradient-to-br from-[var(--accent)] to-[#3b82f6]" />
      <div>
        <div className="h-3 w-32 rounded-full bg-[var(--text-h)]/80" />
        <div className="mt-2 h-2 w-24 rounded-full bg-[var(--code-bg)]" />
      </div>
    </div>
    <div className="mt-5 grid grid-cols-2 gap-3">
      {["Tasks", "Teams"].map((label) => (
        <div
          key={label}
          className="rounded-xl border border-[var(--border)] bg-[var(--code-bg)] p-3"
        >
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text)]">
            {label}
          </span>
          <div className="mt-2 h-5 w-12 rounded-md bg-[var(--text-h)]/70" />
        </div>
      ))}
    </div>
    <div className="mt-4 space-y-2">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="flex items-center gap-3 rounded-lg border border-[var(--border)] px-3 py-2.5"
        >
          <span className="h-2 w-2 rounded-full bg-[var(--accent)]" />
          <Bar w={i === 1 ? "w-3/4" : i === 2 ? "w-2/3" : "w-1/2"} />
        </div>
      ))}
    </div>
  </MockChrome>
);

const ActivityMock = ({ className }: { className?: string }) => (
  <MockChrome title="Activity" className={className}>
    <div className="space-y-3">
      {[
        { c: "var(--accent)", w: "w-3/4" },
        { c: "#22c55e", w: "w-2/3" },
        { c: "#f59e0b", w: "w-4/5" },
        { c: "var(--accent)", w: "w-1/2" },
        { c: "#3b82f6", w: "w-3/5" },
      ].map((row, i) => (
        <div key={i} className="flex items-start gap-3">
          <div className="relative mt-1 flex h-6 w-6 items-center justify-center">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ background: row.c }}
            />
            {i !== 4 && (
              <span className="absolute top-4 h-6 w-px bg-[var(--border)]" />
            )}
          </div>
          <div className="flex-1 rounded-lg border border-[var(--border)] bg-[var(--code-bg)] px-3 py-2.5">
            <Bar w={row.w} h="h-2" />
            <span className="mt-1.5 block h-1.5 w-1/3 rounded-full bg-[var(--bg)]" />
          </div>
        </div>
      ))}
    </div>
  </MockChrome>
);

const Mock = ({ variant, className }: MockProps) => {
  switch (variant) {
    case "dashboard":
      return <DashboardMock className={className} />;
    case "tasks":
      return <TasksMock className={className} />;
    case "team":
      return <TeamMock className={className} />;
    case "profile":
      return <ProfileMock className={className} />;
    case "activity":
      return <ActivityMock className={className} />;
  }
};

export default Mock;

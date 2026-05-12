import { Link } from "react-router-dom";

const primaryBtn =
  "inline-flex items-center justify-center rounded-xl bg-[var(--accent)] px-5 py-3 text-[15px] font-semibold text-white shadow-lg shadow-[color-mix(in_oklab,var(--accent)_35%,transparent)] transition hover:brightness-110 active:scale-[0.99] dark:text-[#0c0a10]";

const secondaryBtn =
  "inline-flex items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--bg)] px-5 py-3 text-[15px] font-semibold text-[var(--text-h)] transition hover:bg-[var(--code-bg)]";

const sectionWrap = "mx-auto w-full max-w-6xl px-6 sm:px-10";

type MockProps = {
  variant: "dashboard" | "tasks" | "team" | "profile" | "activity";
  className?: string;
};

const MockChrome = ({
  title,
  children,
  className = "",
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={`relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg)] shadow-2xl shadow-black/20 ${className}`}
  >
    <div className="flex items-center gap-2 border-b border-[var(--border)] bg-[var(--code-bg)] px-4 py-2.5">
      <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]/80" />
      <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]/80" />
      <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]/80" />
      <span className="ml-3 truncate text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--text)]">
        {title}
      </span>
    </div>
    <div className="p-4 sm:p-5">{children}</div>
  </div>
);

const Bar = ({ w = "w-full", h = "h-2.5", tone = "bg-[var(--code-bg)]" }) => (
  <span className={`block rounded-full ${tone} ${h} ${w}`} />
);

const Mock = ({ variant, className }: MockProps) => {
  if (variant === "dashboard") {
    return (
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
  }

  if (variant === "tasks") {
    return (
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
  }

  if (variant === "team") {
    return (
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
  }

  if (variant === "profile") {
    return (
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
  }

  return (
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
};

const features: {
  eyebrow: string;
  title: string;
  body: string;
  bullets: string[];
  variant: MockProps["variant"];
}[] = [
  {
    eyebrow: "Tasks",
    title: "Plan, prioritize, and ship",
    body:
      "Create tasks, assign priorities, and filter your backlog. Search by title or owner and group work by team or person so nothing slips.",
    bullets: ["Priority enums", "Search & filters", "Per-team views"],
    variant: "tasks",
  },
  {
    eyebrow: "Teams",
    title: "Bring your group along",
    body:
      "Spin up a team, invite teammates, and review join requests in one place. Roles keep admin actions safely in the right hands.",
    bullets: ["Invites", "Join requests", "Role-based access"],
    variant: "team",
  },
  {
    eyebrow: "Profile",
    title: "Your activity, at a glance",
    body:
      "See what you have on your plate, your recent activity, and the teams you belong to from a single profile shell.",
    bullets: ["Personal task list", "Team memberships", "Account details"],
    variant: "profile",
  },
];

const steps = [
  {
    n: "01",
    title: "Sign in",
    body: "Use your account to get a session and unlock the full app.",
  },
  {
    n: "02",
    title: "Pick a team",
    body: "Join an existing team or create your own and invite teammates.",
  },
  {
    n: "03",
    title: "Track your work",
    body: "Capture tasks, set priorities, and keep momentum together.",
  },
];

const Home = () => {
  return (
    <div
      className="relative text-left"
      style={{
        width: "100vw",
        marginLeft: "calc(50% - 50vw)",
        marginRight: "calc(50% - 50vw)",
        background: "var(--bg)",
      }}
    >
      <section className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(60% 70% at 75% 10%, color-mix(in oklab, var(--accent) 28%, transparent) 0%, transparent 60%), radial-gradient(50% 60% at 10% 90%, color-mix(in oklab, var(--accent) 18%, transparent) 0%, transparent 65%)",
          }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent, var(--border), transparent)",
          }}
        />

        <div className={`${sectionWrap} relative pt-16 pb-20 sm:pt-24 sm:pb-28`}>
          <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--bg)]/70 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--accent)] backdrop-blur">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
                Welcome
              </span>
              <h1 className="!mt-5 !mb-0 !text-4xl !font-semibold !leading-[1.05] !tracking-tight text-[var(--text-h)] sm:!text-6xl">
                Stay on top of <br className="hidden sm:block" />
                <span className="bg-gradient-to-r from-[var(--accent)] to-[#7c3aed] bg-clip-text text-transparent">
                  your work
                </span>
              </h1>
              <p className="mt-6 max-w-xl text-[16px] leading-relaxed text-[var(--text)] sm:text-[18px]">
                A small activity tracker for learning. Manage tasks with
                filters, collaborate in teams, and see your activity—all powered
                by an Express + Drizzle backend.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                <Link to="/tasks" className={primaryBtn}>
                  View tasks
                </Link>
                <a href="#features" className={secondaryBtn}>
                  Take a tour
                </a>
              </div>

              <dl className="mt-12 grid max-w-md grid-cols-3 gap-6 border-t border-[var(--border)] pt-6">
                {[
                  { k: "Stack", v: "Express · Drizzle" },
                  { k: "Frontend", v: "React · Tailwind" },
                  { k: "Auth", v: "Sessions · Roles" },
                ].map((s) => (
                  <div key={s.k}>
                    <dt className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--text)]">
                      {s.k}
                    </dt>
                    <dd className="mt-1 text-[13px] font-medium text-[var(--text-h)]">
                      {s.v}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="relative">
              <div
                aria-hidden="true"
                className="absolute -inset-6 -z-10 rounded-[2rem] opacity-60 blur-2xl"
                style={{
                  background:
                    "radial-gradient(60% 60% at 50% 50%, color-mix(in oklab, var(--accent) 35%, transparent), transparent 70%)",
                }}
              />
              <Mock variant="dashboard" />
              <div className="absolute -bottom-6 -left-6 hidden w-48 rotate-[-4deg] sm:block">
                <Mock variant="activity" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="features"
        className="border-t border-[var(--border)] bg-[color-mix(in_oklab,var(--code-bg)_55%,transparent)]"
      >
        <div className={`${sectionWrap} py-20 sm:py-28`}>
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--bg)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
              Features
            </span>
            <h2 className="!m-0 !mt-4 !text-3xl !font-semibold !tracking-tight text-[var(--text-h)] sm:!text-4xl">
              Everything you need to keep moving
            </h2>
            <p className="mt-3 text-[15px] text-[var(--text)] sm:text-[16px]">
              Three flows wired into your API routes, ready to grow with your
              project.
            </p>
          </div>

          <div className="mt-16 flex flex-col gap-20 sm:gap-24">
            {features.map((feature, idx) => {
              const reverse = idx % 2 === 1;
              return (
                <div
                  key={feature.title}
                  className={`grid items-center gap-10 lg:grid-cols-2 lg:gap-16 ${
                    reverse ? "lg:[&>*:first-child]:order-2" : ""
                  }`}
                >
                  <div>
                    <span className="inline-flex h-7 items-center rounded-full bg-[var(--accent-bg)] px-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
                      {feature.eyebrow}
                    </span>
                    <h3 className="!m-0 !mt-3 !text-2xl !font-semibold text-[var(--text-h)] sm:!text-3xl">
                      {feature.title}
                    </h3>
                    <p className="mt-4 text-[15px] leading-relaxed text-[var(--text)] sm:text-[16px]">
                      {feature.body}
                    </p>
                    <ul className="mt-6 flex flex-wrap gap-2">
                      {feature.bullets.map((b) => (
                        <li
                          key={b}
                          className="rounded-full border border-[var(--border)] bg-[var(--bg)] px-3 py-1 text-[12px] font-medium text-[var(--text-h)]"
                        >
                          {b}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="relative">
                    <div
                      aria-hidden="true"
                      className="absolute -inset-4 -z-10 rounded-[2rem] opacity-50 blur-2xl"
                      style={{
                        background:
                          "radial-gradient(50% 50% at 50% 50%, color-mix(in oklab, var(--accent) 25%, transparent), transparent 70%)",
                      }}
                    />
                    <Mock variant={feature.variant} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-t border-[var(--border)]">
        <div className={`${sectionWrap} py-20 sm:py-28`}>
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--bg)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
              How it works
            </span>
            <h2 className="!m-0 !mt-4 !text-3xl !font-semibold !tracking-tight text-[var(--text-h)] sm:!text-4xl">
              Up and running in three steps
            </h2>
          </div>

          <ol className="mt-12 grid gap-5 sm:grid-cols-3">
            {steps.map((step, i) => (
              <li
                key={step.n}
                className="relative rounded-2xl border border-[var(--border)] bg-[var(--bg)] p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--accent-bg)] text-[14px] font-semibold text-[var(--accent)]">
                    {step.n}
                  </span>
                  {i < steps.length - 1 && (
                    <span
                      aria-hidden="true"
                      className="hidden h-px flex-1 sm:block"
                      style={{
                        background:
                          "linear-gradient(90deg, var(--border), transparent)",
                      }}
                    />
                  )}
                </div>
                <h3 className="!m-0 !mt-5 !text-lg !font-semibold text-[var(--text-h)]">
                  {step.title}
                </h3>
                <p className="mt-2 text-[14px] leading-relaxed text-[var(--text)]">
                  {step.body}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="border-t border-[var(--border)] bg-[color-mix(in_oklab,var(--code-bg)_55%,transparent)]">
        <div className={`${sectionWrap} py-20 sm:py-28`}>
          <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.05fr] lg:gap-16">
            <div className="relative">
              <div
                aria-hidden="true"
                className="absolute -inset-4 -z-10 rounded-[2rem] opacity-50 blur-2xl"
                style={{
                  background:
                    "radial-gradient(50% 50% at 50% 50%, color-mix(in oklab, var(--accent) 25%, transparent), transparent 70%)",
                }}
              />
              <Mock variant="activity" />
            </div>
            <div>
              <span className="inline-flex h-7 items-center rounded-full bg-[var(--accent-bg)] px-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
                Live activity
              </span>
              <h2 className="!m-0 !mt-3 !text-3xl !font-semibold !tracking-tight text-[var(--text-h)] sm:!text-4xl">
                See progress as it happens
              </h2>
              <p className="mt-4 text-[15px] leading-relaxed text-[var(--text)] sm:text-[16px]">
                Recent activity surfaces what was created, completed, or
                updated, so you always know where the team stands without
                pinging anyone.
              </p>
              <ul className="mt-6 grid gap-3 text-[14px] text-[var(--text-h)]">
                {[
                  "Per-user and per-team views",
                  "Quick filters for priority and status",
                  "Wired to your Express + Drizzle endpoints",
                ].map((t) => (
                  <li key={t} className="flex items-center gap-3">
                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[var(--accent-bg)] text-[var(--accent)]">
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </span>
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-[var(--border)]">
        <div className={`${sectionWrap} py-20 sm:py-28`}>
          <div
            className="relative overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--bg)] p-10 text-center shadow-sm sm:p-16"
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "radial-gradient(60% 80% at 50% 0%, color-mix(in oklab, var(--accent) 22%, transparent), transparent 70%)",
              }}
            />
            <div className="relative">
              <h2 className="!m-0 !text-3xl !font-semibold !tracking-tight text-[var(--text-h)] sm:!text-4xl">
                Ready to dive in?
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-[15px] text-[var(--text)] sm:text-[16px]">
                Jump straight into your tasks and explore everything the app has
                to offer.
              </p>
              <div className="mt-8 flex justify-center">
                <Link to="/tasks" className={primaryBtn}>
                  View tasks
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

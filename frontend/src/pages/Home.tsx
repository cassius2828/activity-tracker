import { Link } from "react-router-dom";

const primaryBtn =
  "inline-flex items-center justify-center rounded-xl bg-[var(--accent)] px-5 py-3 text-[15px] font-semibold text-white shadow-md transition hover:brightness-110 active:scale-[0.99] dark:text-[#0c0a10]";

const secondaryBtn =
  "inline-flex items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--bg)] px-5 py-3 text-[15px] font-semibold text-[var(--text-h)] transition hover:bg-[var(--code-bg)]";

const Home = () => {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10 text-left sm:px-6 sm:py-14">
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">
        Welcome
      </p>
      <h1 className="!mt-2 !mb-0 !text-3xl !tracking-tight text-[var(--text-h)] sm:!text-4xl">
        Stay on top of your work
      </h1>
      <p className="mt-4 max-w-2xl text-[17px] leading-snug text-[var(--text)] sm:text-[18px]">
        A small activity tracker for learning: sign in, manage tasks with filters, and view a profile shell—all
        ready to connect to your Express + Drizzle backend.
      </p>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <Link to="/tasks" className={primaryBtn}>
          View tasks
        </Link>
        <Link to={{ pathname: "/auth", search: "?mode=login" }} className={secondaryBtn}>
          Sign in
        </Link>
        <Link to={{ pathname: "/auth", search: "?mode=signup" }} className={secondaryBtn}>
          Create account
        </Link>
      </div>

      <section className="mt-14 border-t border-[var(--border)] pt-12">
        <h2 className="!m-0 !text-xl !tracking-tight text-[var(--text-h)] sm:!text-2xl">What you can explore</h2>
        <p className="mt-2 text-[15px] text-[var(--text)]">
          Each area uses placeholder data until your API is wired up.
        </p>

        <ul className="mt-8 grid gap-4 sm:grid-cols-3">
          <li className="rounded-2xl border border-[var(--border)] bg-[var(--bg)] p-5 shadow-sm">
            <h3 className="!m-0 !text-base font-semibold text-[var(--text-h)]">Tasks</h3>
            <p className="mt-2 text-[14px] leading-relaxed text-[var(--text)]">
              Browse a sample list, search, and filter by priority—same shape as your backend enums.
            </p>
          </li>
          <li className="rounded-2xl border border-[var(--border)] bg-[var(--bg)] p-5 shadow-sm">
            <h3 className="!m-0 !text-base font-semibold text-[var(--text-h)]">Auth</h3>
            <p className="mt-2 text-[14px] leading-relaxed text-[var(--text)]">
              Login and sign-up panels styled for the `/auth` route; hook forms to `/api/auth` next.
            </p>
          </li>
          <li className="rounded-2xl border border-[var(--border)] bg-[var(--bg)] p-5 shadow-sm sm:col-span-1">
            <h3 className="!m-0 !text-base font-semibold text-[var(--text-h)]">Profile</h3>
            <p className="mt-2 text-[14px] leading-relaxed text-[var(--text)]">
              A profile card with dummy stats and activity—swap for real user data from JWT or `/api/users`.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );
};

export default Home;

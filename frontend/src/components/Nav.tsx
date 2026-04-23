import { NavLink } from "react-router-dom";

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  [
    "rounded-lg px-3 py-2 text-[14px] font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]/35",
    isActive
      ? "bg-[var(--accent-bg)] text-[var(--accent)]"
      : "text-[var(--text)] hover:bg-[var(--code-bg)] hover:text-[var(--text-h)]",
  ].join(" ");

const Nav = () => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-[var(--border)] bg-[color-mix(in_oklab,var(--bg)_85%,transparent)] backdrop-blur-md dark:bg-[color-mix(in_oklab,var(--bg)_80%,transparent)]">
      <nav
        className="mx-auto flex h-[52px] max-w-[1126px] items-center justify-between gap-4 px-4 sm:h-[56px] sm:px-6"
        aria-label="Primary"
      >
        <NavLink
          to="/"
          end
          className="shrink-0 rounded-lg px-1 py-1 outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]/35"
        >
          <span className="text-[15px] font-semibold tracking-tight text-[var(--text-h)]">
            Activity tracker
          </span>
        </NavLink>

        <ul className="flex flex-wrap items-center justify-end gap-0.5 sm:gap-1">
          <li>
            <NavLink
              to={{ pathname: "/auth", search: "?mode=login" }}
              className={navLinkClass}
            >
              Auth
            </NavLink>
          </li>
          <li>
            <NavLink to="/tasks" className={navLinkClass}>
              Tasks
            </NavLink>
          </li>
          <li>
            <NavLink to="/profile/:id" className={navLinkClass}>
              Profile
            </NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Nav;

import type { ReactNode } from "react";

type MockChromeProps = {
  title: string;
  children: ReactNode;
  className?: string;
};

/** Browser-window-style frame used to wrap each marketing mock. */
const MockChrome = ({ title, children, className = "" }: MockChromeProps) => (
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

export default MockChrome;

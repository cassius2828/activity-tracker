import { forwardRef, type ComponentPropsWithoutRef } from "react";

const baseClass =
  "w-full appearance-none rounded-xl border border-[var(--border)] bg-[var(--bg)] px-4 py-2.5 pr-10 text-[15px] text-[var(--text-h)] shadow-sm outline-none transition " +
  "cursor-pointer " +
  "focus:border-[var(--accent-border)] focus:ring-2 focus:ring-[var(--accent)]/25 " +
  "disabled:cursor-not-allowed disabled:opacity-60";

type SelectProps = ComponentPropsWithoutRef<"select"> & {
  /** Wrapper className (e.g. layout/width overrides). */
  wrapperClassName?: string;
};

/**
 * Styled native <select> with a themed chevron overlay.
 * Drop-in replacement for `<select>` — accepts the same props.
 */
const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className = "", wrapperClassName = "", children, ...rest }, ref) => (
    <div className={`relative ${wrapperClassName}`}>
      <select
        ref={ref}
        className={`${baseClass} ${className}`}
        // Hint to the OS dropdown panel which palette to render in so the
        // popup honors dark mode where supported.
        style={{ colorScheme: "light dark", ...rest.style }}
        {...rest}
      >
        {children}
      </select>
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.25"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-h)]"
      >
        <polyline points="6 9 12 15 18 9" />
      </svg>
    </div>
  ),
);

Select.displayName = "Select";

export default Select;

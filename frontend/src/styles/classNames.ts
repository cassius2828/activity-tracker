/**
 * Canonical Tailwind class strings shared across the app.
 *
 * Anything reused in 2+ places lives here so we have a single source of truth.
 * Feature-specific one-offs (e.g. auth panel chrome) stay co-located with the feature.
 */

/* ------------------------------------------------------------------ */
/* Form controls                                                       */
/* ------------------------------------------------------------------ */

export const inputClass =
  "w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] px-4 py-2.5 text-[15px] text-[var(--text-h)] shadow-sm outline-none transition " +
  "placeholder:text-[var(--text)]/60 " +
  "focus:border-[var(--accent-border)] focus:ring-2 focus:ring-[var(--accent)]/25 " +
  "dark:bg-[color-mix(in_oklab,var(--bg)_100%,#000_12%)]";

export const labelClass =
  "mb-1.5 block text-[13px] font-medium text-[var(--text-h)]";

/* ------------------------------------------------------------------ */
/* Buttons                                                             */
/* ------------------------------------------------------------------ */

export const primaryBtnClass =
  "rounded-xl bg-[var(--accent)] px-4 py-2.5 text-[14px] font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60";

export const subtleBtnClass =
  "rounded-xl border border-[var(--border)] px-4 py-2.5 text-[14px] font-medium text-[var(--text-h)] transition hover:bg-[var(--code-bg)] disabled:cursor-not-allowed disabled:opacity-60";

export const dangerBtnClass =
  "rounded-xl border border-rose-400/40 bg-rose-500/10 px-4 py-2 text-[14px] font-medium text-rose-800 transition hover:bg-rose-500/20 disabled:cursor-not-allowed disabled:opacity-60 dark:text-rose-100";

/** Larger CTA variant for marketing-style sections (Home page). */
export const ctaPrimaryBtnClass =
  "inline-flex items-center justify-center rounded-xl bg-[var(--accent)] px-5 py-3 text-[15px] font-semibold text-white shadow-lg shadow-[color-mix(in_oklab,var(--accent)_35%,transparent)] transition hover:brightness-110 active:scale-[0.99] dark:text-[#0c0a10]";

export const ctaSecondaryBtnClass =
  "inline-flex items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--bg)] px-5 py-3 text-[15px] font-semibold text-[var(--text-h)] transition hover:bg-[var(--code-bg)]";

/* ------------------------------------------------------------------ */
/* Layout / chrome                                                     */
/* ------------------------------------------------------------------ */

export const eyebrowClass =
  "text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--accent)]";

export const cardClass =
  "rounded-2xl border border-[var(--border)] bg-[var(--bg)] p-5 shadow-sm";

export const cardCompactClass =
  "rounded-2xl border border-[var(--border)] bg-[var(--bg)] p-4 shadow-sm";

/** Standard banner / inline notice. */
export const noticeClass =
  "rounded-xl border border-[var(--border)] bg-[var(--code-bg)] px-4 py-3 text-[14px] text-[var(--text)]";

/** Compact variant used inside cards (smaller padding). */
export const noticeCompactClass =
  "rounded-xl border border-[var(--border)] bg-[var(--code-bg)] px-3 py-2 text-[14px] text-[var(--text)]";

export const warningNoticeClass =
  "rounded-xl border border-amber-400/40 bg-amber-500/10 px-4 py-3 text-[14px] text-amber-900 dark:text-amber-100";

export const errorNoticeClass =
  "rounded-xl border border-rose-400/40 bg-rose-500/10 px-4 py-3 text-[14px] text-rose-800 dark:text-rose-100";

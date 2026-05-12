/** Shared Tailwind strings for auth panels */

export const shellClass = "flex flex-col gap-6 text-left";

export const formStackClass = "flex flex-col gap-4";

export const headerStackClass = "space-y-1";

export const eyebrowClass =
  "text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--accent)]";

export const panelTitleClass =
  "text-2xl font-semibold tracking-tight text-[var(--text-h)] sm:text-[26px]";

export const panelSubtitleClass = "text-[15px] leading-snug text-[var(--text)]";

export const inputClass =
  "w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] px-4 py-3 text-[15px] text-[var(--text-h)] shadow-sm outline-none transition " +
  "placeholder:text-[var(--text)]/60 " +
  "focus:border-[var(--accent-border)] focus:ring-2 focus:ring-[var(--accent)]/25 " +
  "dark:bg-[color-mix(in_oklab,var(--bg)_100%,#000_12%)]";

export const labelClass =
  "mb-1.5 block text-left text-[13px] font-medium tracking-wide text-[var(--text-h)]";

export const primarySubmitClass =
  "mt-1 w-full rounded-xl bg-[var(--accent)] py-3.5 text-[15px] font-semibold text-white shadow-md transition hover:brightness-110 active:scale-[0.99] dark:text-[#0c0a10]";

export const modeFooterClass = "text-center text-[14px] text-[var(--text)]";

export const modeLinkClass =
  "font-semibold text-[var(--accent)] underline-offset-2 transition hover:underline";

export const authPageWrapClass =
  "mx-auto w-full max-w-[480px] px-4 py-8 sm:px-6 sm:py-10";

export const authCardClass =
  "relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg)] p-8 shadow-[var(--shadow)] dark:border-[var(--border)] dark:bg-[color-mix(in_oklab,var(--bg)_92%,transparent)]";

export const authGlowTopClass =
  "pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-[var(--accent-bg)] blur-3xl";

export const authGlowBottomClass =
  "pointer-events-none absolute -bottom-20 -left-12 h-36 w-36 rounded-full bg-[var(--accent-bg)] opacity-60 blur-3xl";

export const authCardInnerClass = "relative";

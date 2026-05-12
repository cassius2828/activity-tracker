/** Auth-panel-specific styles. Shared primitives live in `src/styles/classNames.ts`. */

export {
  eyebrowClass,
  inputClass,
  labelClass,
} from "../../styles/classNames";

export const shellClass = "flex flex-col gap-6 text-left";

export const formStackClass = "flex flex-col gap-4";

export const headerStackClass = "space-y-1";

export const panelTitleClass =
  "text-2xl font-semibold tracking-tight text-[var(--text-h)] sm:text-[26px]";

export const panelSubtitleClass = "text-[15px] leading-snug text-[var(--text)]";

/** Auth submit is taller / bolder than the standard primaryBtn. */
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

import CheckIcon from "../Icons/CheckIcon";
import Mock from "./Mock";
import { liveActivityBullets, sectionWrapClass } from "./data";

const LiveActivitySection = () => (
  <section className="border-t border-[var(--border)] bg-[color-mix(in_oklab,var(--code-bg)_55%,transparent)]">
    <div className={`${sectionWrapClass} py-20 sm:py-28`}>
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
            Recent activity surfaces what was created, completed, or updated, so
            you always know where the team stands without pinging anyone.
          </p>
          <ul className="mt-6 grid gap-3 text-[14px] text-[var(--text-h)]">
            {liveActivityBullets.map((t) => (
              <li key={t} className="flex items-center gap-3">
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[var(--accent-bg)] text-[var(--accent)]">
                  <CheckIcon />
                </span>
                {t}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  </section>
);

export default LiveActivitySection;

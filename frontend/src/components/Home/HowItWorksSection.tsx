import { sectionWrapClass, steps } from "./data";

const HowItWorksSection = () => (
  <section className="border-t border-[var(--border)]">
    <div className={`${sectionWrapClass} py-20 sm:py-28`}>
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
);

export default HowItWorksSection;

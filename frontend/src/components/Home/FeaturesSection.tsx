import Mock from "./Mock";
import { features, sectionWrapClass } from "./data";

const FeaturesSection = () => (
  <section
    id="features"
    className="border-t border-[var(--border)] bg-[color-mix(in_oklab,var(--code-bg)_55%,transparent)]"
  >
    <div className={`${sectionWrapClass} py-20 sm:py-28`}>
      <div className="mx-auto max-w-2xl text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--bg)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
          Features
        </span>
        <h2 className="!m-0 !mt-4 !text-3xl !font-semibold !tracking-tight text-[var(--text-h)] sm:!text-4xl">
          Everything you need to keep moving
        </h2>
        <p className="mt-3 text-[15px] text-[var(--text)] sm:text-[16px]">
          Three flows wired into your API routes, ready to grow with your project.
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
);

export default FeaturesSection;

import { Link } from "react-router-dom";
import {
  ctaPrimaryBtnClass,
  ctaSecondaryBtnClass,
} from "../../styles/classNames";
import Mock from "./Mock";
import { heroStats, sectionWrapClass } from "./data";

const HeroSection = () => (
  <section className="relative overflow-hidden">
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0"
      style={{
        background:
          "radial-gradient(60% 70% at 75% 10%, color-mix(in oklab, var(--accent) 28%, transparent) 0%, transparent 60%), radial-gradient(50% 60% at 10% 90%, color-mix(in oklab, var(--accent) 18%, transparent) 0%, transparent 65%)",
      }}
    />
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 bottom-0 h-px"
      style={{
        background:
          "linear-gradient(90deg, transparent, var(--border), transparent)",
      }}
    />

    <div className={`${sectionWrapClass} relative pt-16 pb-20 sm:pt-24 sm:pb-28`}>
      <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--bg)]/70 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--accent)] backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
            Welcome
          </span>
          <h1 className="!mt-5 !mb-0 !text-4xl !font-semibold !leading-[1.05] !tracking-tight text-[var(--text-h)] sm:!text-6xl">
            Stay on top of <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-[var(--accent)] to-[#7c3aed] bg-clip-text text-transparent">
              your work
            </span>
          </h1>
          <p className="mt-8 max-w-xl text-[16px] leading-relaxed text-[var(--text)] sm:text-[18px]">
            A small activity tracker for learning. Manage tasks with filters,
            collaborate in teams, and see your activity—all powered by an
            Express + Drizzle backend.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <Link to="/tasks" className={ctaPrimaryBtnClass}>
              View tasks
            </Link>
            <a href="#features" className={ctaSecondaryBtnClass}>
              Take a tour
            </a>
          </div>

          <dl className="mt-12 grid max-w-md grid-cols-3 gap-6 border-t border-[var(--border)] pt-6">
            {heroStats.map((s) => (
              <div key={s.k}>
                <dt className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--text)]">
                  {s.k}
                </dt>
                <dd className="mt-1 text-[13px] font-medium text-[var(--text-h)]">
                  {s.v}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative">
          <div
            aria-hidden="true"
            className="absolute -inset-6 -z-10 rounded-[2rem] opacity-60 blur-2xl"
            style={{
              background:
                "radial-gradient(60% 60% at 50% 50%, color-mix(in oklab, var(--accent) 35%, transparent), transparent 70%)",
            }}
          />
          <Mock variant="dashboard" />
          <div className="absolute -bottom-6 -left-6 hidden w-48 rotate-[-4deg] sm:block">
            <Mock variant="activity" />
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default HeroSection;

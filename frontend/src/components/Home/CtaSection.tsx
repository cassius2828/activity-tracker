import { Link } from "react-router-dom";
import { ctaPrimaryBtnClass } from "../../styles/classNames";
import { sectionWrapClass } from "./data";

const CtaSection = () => (
  <section className="border-t border-[var(--border)]">
    <div className={`${sectionWrapClass} py-20 sm:py-28`}>
      <div className="relative overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--bg)] p-10 text-center shadow-sm sm:p-16">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(60% 80% at 50% 0%, color-mix(in oklab, var(--accent) 22%, transparent), transparent 70%)",
          }}
        />
        <div className="relative">
          <h2 className="!m-0 !text-3xl !font-semibold !tracking-tight text-[var(--text-h)] sm:!text-4xl">
            Ready to dive in?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-[15px] text-[var(--text)] sm:text-[16px]">
            Jump straight into your tasks and explore everything the app has to
            offer.
          </p>
          <div className="mt-8 flex justify-center">
            <Link to="/tasks" className={ctaPrimaryBtnClass}>
              View tasks
            </Link>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default CtaSection;

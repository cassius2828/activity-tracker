import { eyebrowClass } from "../../styles/classNames";

const TeamsHeader = () => (
  <header className="mb-8 space-y-2">
    <p className={eyebrowClass}>Teams</p>
    <h1 className="!m-0 !text-3xl !tracking-tight text-[var(--text-h)] sm:!text-4xl">
      Choose or create a team
    </h1>
    <p className="text-[15px] text-[var(--text)]">
      Pick where you want to work, or spin up a new team for your tasks.
    </p>
  </header>
);

export default TeamsHeader;

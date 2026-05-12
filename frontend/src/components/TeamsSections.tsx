import type { FormEvent } from "react";
import type { Team } from "../service/teams";

const inputClass =
  "w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] px-4 py-2.5 text-[15px] text-[var(--text-h)] shadow-sm outline-none transition " +
  "placeholder:text-[var(--text)]/60 " +
  "focus:border-[var(--accent-border)] focus:ring-2 focus:ring-[var(--accent)]/25";

const actionBtnClass =
  "rounded-xl bg-[var(--accent)] px-4 py-2.5 text-[14px] font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60";

const subtleBtnClass =
  "rounded-xl border border-[var(--border)] px-4 py-2.5 text-[14px] font-medium text-[var(--text-h)] transition hover:bg-[var(--code-bg)] disabled:cursor-not-allowed disabled:opacity-60";

export type TeamForm = {
  name: string;
  description: string;
};

export const TeamsHeader = () => (
  <header className="mb-8 space-y-2">
    <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">
      Teams
    </p>
    <h1 className="!m-0 !text-3xl !tracking-tight text-[var(--text-h)] sm:!text-4xl">
      Choose or create a team
    </h1>
    <p className="text-[15px] text-[var(--text)]">
      Pick where you want to work, or spin up a new team for your tasks.
    </p>
  </header>
);

export const TeamNotice = ({ notice }: { notice: string | null }) =>
  notice ? (
    <p className="mb-5 rounded-xl border border-[var(--border)] bg-[var(--code-bg)] px-4 py-3 text-[14px] text-[var(--text)]">
      {notice}
    </p>
  ) : null;

export const ChooseTeamSection = ({
  teams,
  selectedTeamId,
  onSelectedTeamChange,
  isLoadingTeams,
  isChoosing,
  onOpenTeam,
}: {
  teams: Team[];
  selectedTeamId: string;
  onSelectedTeamChange: (teamId: string) => void;
  isLoadingTeams: boolean;
  isChoosing: boolean;
  onOpenTeam: (teamId: string) => void;
}) => (
  <section className="mb-8 rounded-2xl border border-[var(--border)] bg-[var(--bg)] p-5 shadow-sm">
    <h2 className="!m-0 !text-lg !tracking-tight text-[var(--text-h)]">Choose team</h2>
    <p className="mt-1 text-[14px] text-[var(--text)]">
      Your selected team controls the team tasks view.
    </p>

    <div className="mt-4 flex flex-col gap-3 sm:flex-row">
      <select
        className={inputClass}
        value={selectedTeamId}
        onChange={(event) => onSelectedTeamChange(event.target.value)}
        disabled={isLoadingTeams || teams.length === 0}
      >
        {isLoadingTeams ? <option>Loading teams...</option> : null}
        {!isLoadingTeams && teams.length === 0 ? <option>No teams yet</option> : null}
        {teams.map((team) => (
          <option key={team.id} value={team.id}>
            {team.name}
          </option>
        ))}
      </select>
      <button
        type="button"
        className={actionBtnClass}
        onClick={() => onOpenTeam(selectedTeamId)}
        disabled={!selectedTeamId || isChoosing || isLoadingTeams}
      >
        {isChoosing ? "Selecting..." : "Open team tasks"}
      </button>
    </div>
  </section>
);

export const CreateTeamSection = ({
  teamForm,
  isCreating,
  selectedTeamId,
  onFormSubmit,
  onNameChange,
  onDescriptionChange,
  onGoToSelectedTeam,
}: {
  teamForm: TeamForm;
  isCreating: boolean;
  selectedTeamId: string;
  onFormSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onNameChange: (name: string) => void;
  onDescriptionChange: (description: string) => void;
  onGoToSelectedTeam: () => void;
}) => (
  <section className="rounded-2xl border border-[var(--border)] bg-[var(--bg)] p-5 shadow-sm">
    <h2 className="!m-0 !text-lg !tracking-tight text-[var(--text-h)]">Create team</h2>
    <p className="mt-1 text-[14px] text-[var(--text)]">
      Create a team and select it immediately.
    </p>

    <form className="mt-4 space-y-3" onSubmit={onFormSubmit}>
      <div>
        <label className="mb-1.5 block text-[13px] font-medium text-[var(--text-h)]" htmlFor="team-name">
          Team name
        </label>
        <input
          id="team-name"
          className={inputClass}
          value={teamForm.name}
          onChange={(event) => onNameChange(event.target.value)}
          placeholder="Platform team"
          maxLength={80}
        />
      </div>
      <div>
        <label
          className="mb-1.5 block text-[13px] font-medium text-[var(--text-h)]"
          htmlFor="team-description"
        >
          Description
        </label>
        <textarea
          id="team-description"
          className={`${inputClass} min-h-24 resize-y`}
          value={teamForm.description}
          onChange={(event) => onDescriptionChange(event.target.value)}
          placeholder="What this team owns..."
          maxLength={240}
        />
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <button type="submit" className={actionBtnClass} disabled={isCreating}>
          {isCreating ? "Creating..." : "Create team"}
        </button>
        {selectedTeamId ? (
          <button
            type="button"
            className={subtleBtnClass}
            onClick={onGoToSelectedTeam}
          >
            Go to selected team
          </button>
        ) : null}
      </div>
    </form>
  </section>
);

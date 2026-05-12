import type { Team } from "../../types/team";
import Select from "../Ui/Select";
import { cardClass, primaryBtnClass } from "../../styles/classNames";

type ChooseTeamSectionProps = {
  teams: Team[];
  selectedTeamId: string;
  onSelectedTeamChange: (teamId: string) => void;
  isLoadingTeams: boolean;
  isChoosing: boolean;
  onOpenTeam: (teamId: string) => void;
  myTeamId?: string | null;
  onOpenMyTeam?: () => void;
};

const ChooseTeamSection = ({
  teams,
  selectedTeamId,
  onSelectedTeamChange,
  isLoadingTeams,
  isChoosing,
  onOpenTeam,
  myTeamId,
  onOpenMyTeam,
}: ChooseTeamSectionProps) => {
  const myTeam = myTeamId ? teams.find((team) => team.id === myTeamId) : null;
  const myTeamLabel = myTeam?.name ?? "your team";

  return (
    <section className={`mb-8 ${cardClass}`}>
      <h2 className="!m-0 !text-lg !tracking-tight text-[var(--text-h)]">Choose team</h2>
      <p className="mt-1 text-[14px] text-[var(--text)]">
        Your selected team controls the team tasks view.
      </p>

      {myTeamId && onOpenMyTeam ? (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[var(--accent-border)]/40 bg-[var(--accent)]/10 px-4 py-3">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
              Your team
            </p>
            <p className="mt-0.5 truncate text-[14px] font-medium text-[var(--text-h)]">
              {myTeamLabel}
            </p>
          </div>
          <button
            type="button"
            className={primaryBtnClass}
            onClick={onOpenMyTeam}
            disabled={isLoadingTeams}
          >
            Go to your team
          </button>
        </div>
      ) : null}

      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <Select
          value={selectedTeamId}
          onChange={(event) => onSelectedTeamChange(event.target.value)}
          disabled={isLoadingTeams || teams.length === 0}
        >
          {isLoadingTeams ? <option>Loading teams...</option> : null}
          {!isLoadingTeams && teams.length === 0 ? (
            <option>No teams yet</option>
          ) : null}
          {teams.map((team) => (
            <option key={team.id} value={team.id}>
              {team.name}
            </option>
          ))}
        </Select>
        <button
          type="button"
          className={primaryBtnClass}
          onClick={() => onOpenTeam(selectedTeamId)}
          disabled={!selectedTeamId || isChoosing || isLoadingTeams}
        >
          {isChoosing ? "Selecting..." : "Open team tasks"}
        </button>
      </div>
    </section>
  );
};

export default ChooseTeamSection;

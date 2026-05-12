import type { FormEvent } from "react";
import type { TeamForm } from "../../types/team";
import {
  cardClass,
  inputClass,
  labelClass,
  primaryBtnClass,
  subtleBtnClass,
  warningNoticeClass,
} from "../../styles/classNames";

type CreateTeamSectionProps = {
  teamForm: TeamForm;
  isCreating: boolean;
  selectedTeamId: string;
  onFormSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onNameChange: (name: string) => void;
  onDescriptionChange: (description: string) => void;
  onGoToSelectedTeam: () => void;
  isAlreadyOnTeam?: boolean;
};

const CreateTeamSection = ({
  teamForm,
  isCreating,
  selectedTeamId,
  onFormSubmit,
  onNameChange,
  onDescriptionChange,
  onGoToSelectedTeam,
  isAlreadyOnTeam = false,
}: CreateTeamSectionProps) => {
  const disableForm = isCreating || isAlreadyOnTeam;

  return (
    <section className={cardClass}>
      <h2 className="!m-0 !text-lg !tracking-tight text-[var(--text-h)]">Create team</h2>
      <p className="mt-1 text-[14px] text-[var(--text)]">
        Create a team and select it immediately.
      </p>

      {isAlreadyOnTeam ? (
        <p className={`mt-3 ${warningNoticeClass}`}>
          You are already on a team. Leave your current team before creating a new one.
        </p>
      ) : null}

      <form className="mt-4 space-y-3" onSubmit={onFormSubmit}>
        <fieldset disabled={isAlreadyOnTeam} className="space-y-3 disabled:opacity-60">
          <div>
            <label className={labelClass} htmlFor="team-name">
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
            <label className={labelClass} htmlFor="team-description">
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
        </fieldset>
        <div className="flex flex-wrap items-center gap-2">
          <button type="submit" className={primaryBtnClass} disabled={disableForm}>
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
};

export default CreateTeamSection;

import { useMemo } from "react";
import type { MyJoinRequestRow } from "../../types/joinRequest";
import {
  cardCompactClass,
  dangerBtnClass,
  primaryBtnClass,
} from "../../styles/classNames";
import AdminUserSearchPanel from "./AdminUserSearchPanel";
import type { TeamUser } from "../../types/team";

type TeamActionsCardProps = {
  teamId: string;
  isMember: boolean;
  isOnDifferentTeam: boolean;
  isAdmin: boolean;
  currentUserId: string;
  myJoinRequests: MyJoinRequestRow[];
  isActionLoading: boolean;
  onLeave: () => void;
  onRequestJoin: () => void;
  onAdminAssigned: (user: TeamUser, teamId: string) => void;
  onError: (message: string) => void;
};

const TeamActionsCard = ({
  teamId,
  isMember,
  isOnDifferentTeam,
  isAdmin,
  currentUserId,
  myJoinRequests,
  isActionLoading,
  onLeave,
  onRequestJoin,
  onAdminAssigned,
  onError,
}: TeamActionsCardProps) => {
  const hasPendingRequest = useMemo(
    () => myJoinRequests.some((row) => String(row.teamId) === teamId),
    [teamId, myJoinRequests],
  );

  const joinDisabled =
    isActionLoading || hasPendingRequest || isOnDifferentTeam;

  const joinLabel = isOnDifferentTeam
    ? "You must leave your team before joining another team"
    : hasPendingRequest
      ? "Requested to join team"
      : isActionLoading
        ? "Submitting..."
        : "Request to join team";

  return (
    <section className={`mb-6 ${cardCompactClass}`}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="!m-0 !text-lg !tracking-tight text-[var(--text-h)]">
            Team actions
          </h2>
          <p className="mt-1 text-[14px] text-[var(--text)]">
            Team ID{" "}
            <span className="font-mono text-[var(--text-h)]">{teamId}</span>
          </p>
        </div>
        {isMember ? (
          <button
            type="button"
            onClick={onLeave}
            disabled={isActionLoading}
            className={dangerBtnClass}
          >
            {isActionLoading ? "Leaving..." : "Leave team"}
          </button>
        ) : (
          <button
            type="button"
            onClick={onRequestJoin}
            disabled={joinDisabled}
            className={primaryBtnClass}
          >
            {joinLabel}
          </button>
        )}
      </div>

      {isAdmin && (
        <AdminUserSearchPanel
          teamId={teamId}
          currentUserId={currentUserId}
          onAssigned={onAdminAssigned}
          onError={onError}
        />
      )}
    </section>
  );
};

export default TeamActionsCard;

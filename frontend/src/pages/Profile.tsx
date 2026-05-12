import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import PageShell from "../components/Ui/PageShell";
import { useTeam } from "../hooks/useTeam";
import { useUser } from "../hooks/useUser";
import { eyebrowClass, errorNoticeClass } from "../styles/classNames";

const usernameFromEmail = (email: string | undefined, fallbackId: string) => {
  if (email) return email.split("@")[0] || email;
  return `user-${fallbackId}`;
};

const Profile = () => {
  const { id: routeId } = useParams<{ id: string }>();
  const { session } = useAuth();

  const isOwnProfile = Boolean(
    routeId && session && String(session.userId) === String(routeId),
  );
  const showOtherUser = Boolean(routeId && !isOwnProfile);

  const {
    user: otherUser,
    isLoading: isLoadingOther,
    error: otherError,
  } = useUser(routeId, showOtherUser);

  const profile = useMemo(() => {
    if (showOtherUser && otherUser) {
      return {
        id: String(otherUser.id),
        email: otherUser.email,
        role: otherUser.role,
        teamId: otherUser.teamId ? String(otherUser.teamId) : null,
        username: usernameFromEmail(otherUser.email, String(otherUser.id)),
      };
    }
    if (session) {
      return {
        id: session.userId,
        email: session.email,
        role: session.role,
        teamId: session.teamId ?? null,
        username: usernameFromEmail(session.email, session.userId),
      };
    }
    return null;
  }, [showOtherUser, otherUser, session]);

  const { teamName } = useTeam(profile?.teamId);

  if (showOtherUser && isLoadingOther) {
    return (
      <PageShell size="sm">
        <p className="text-[15px] text-[var(--text)]">Loading user...</p>
      </PageShell>
    );
  }

  if (showOtherUser && otherError) {
    return (
      <PageShell size="sm">
        <p className={errorNoticeClass}>{otherError}</p>
      </PageShell>
    );
  }

  if (!profile) {
    return (
      <PageShell size="sm">
        <p className="text-[15px] text-[var(--text)]">No profile to show.</p>
      </PageShell>
    );
  }

  const teamLabel = profile.teamId
    ? (teamName ?? `Team ${profile.teamId}`)
    : "No team selected";
  const emailLabel = profile.email ?? "Not available";

  return (
    <PageShell size="sm">
      <header className="mb-8 space-y-2">
        <p className={eyebrowClass}>Profile</p>
        <h1 className="!m-0 !text-3xl !tracking-tight text-[var(--text-h)] sm:!text-4xl">
          {isOwnProfile || !showOtherUser ? "Account" : profile.username}
        </h1>
        <p className="text-[15px] text-[var(--text)]">
          Profile for{" "}
          <span className="font-semibold text-[var(--text-h)]">
            {profile.username}
          </span>
        </p>
      </header>

      <section className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg)] shadow-[var(--shadow)]">
        <div className="border-b border-[var(--border)] bg-[var(--accent-bg)] px-6 py-8">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
            <img
              src="/anon-user.webp"
              alt="User avatar"
              className="h-20 w-20 shrink-0 rounded-2xl border border-[var(--accent-border)] object-cover"
            />
            <div className="min-w-0 flex-1 text-center sm:text-left">
              <h2 className="!m-0 !text-2xl !tracking-tight text-[var(--text-h)]">
                {profile.username}
              </h2>
              <p className="mt-1 truncate text-[15px] text-[var(--text)]">
                {emailLabel}
              </p>
              <p className="mt-2 inline-block rounded-lg border border-[var(--border)] bg-[var(--code-bg)] px-2.5 py-1 text-[12px] font-semibold uppercase tracking-wide text-[var(--text-h)]">
                {profile.role}
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-px bg-[var(--border)] sm:grid-cols-3">
          <div className="bg-[var(--bg)] px-4 py-4 text-center sm:px-5 sm:text-left">
            <p className="text-[12px] font-medium uppercase tracking-wide text-[var(--text)]">
              User ID
            </p>
            <p className="mt-1 truncate text-[16px] font-semibold text-[var(--text-h)]">
              {profile.id}
            </p>
          </div>
          <div className="bg-[var(--bg)] px-4 py-4 text-center sm:px-5 sm:text-left">
            <p className="text-[12px] font-medium uppercase tracking-wide text-[var(--text)]">
              Team
            </p>
            <p className="mt-1 truncate text-[16px] font-semibold text-[var(--text-h)]">
              {teamLabel}
            </p>
          </div>
          <div className="bg-[var(--bg)] px-4 py-4 text-center sm:px-5 sm:text-left">
            <p className="text-[12px] font-medium uppercase tracking-wide text-[var(--text)]">
              Role
            </p>
            <p className="mt-1 text-[16px] font-semibold text-[var(--text-h)]">
              {profile.role}
            </p>
          </div>
        </div>
      </section>
    </PageShell>
  );
};

export default Profile;

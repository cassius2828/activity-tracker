import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getTeamById } from "../service/teams";

const Profile = () => {
  const { id } = useParams<{ id: string }>();
  const { session } = useAuth();
  const [teamName, setTeamName] = useState<string | null>(null);

  const username = useMemo(() => {
    if (session?.email) {
      return session.email.split("@")[0] || session.email;
    }
    if (session?.userId) {
      return `user-${session.userId}`;
    }
    return "Guest";
  }, [session?.email, session?.userId]);

  useEffect(() => {
    const loadTeam = async () => {
      if (!session?.teamId) {
        setTeamName(null);
        return;
      }

      try {
        const team = await getTeamById(session.teamId);
        setTeamName(team?.name ?? null);
      } catch (err) {
        console.error(err);
        setTeamName(null);
      }
    };

    void loadTeam();
  }, [session?.teamId]);

  const userId = session?.userId ?? id ?? "—";
  const email = session?.email ?? "Not available";
  const role = session?.role ?? "user";
  const team = session?.teamId ? (teamName ?? `Team ${session.teamId}`) : "No team selected";

  return (
    <div className="mx-auto w-full max-w-xl px-4 py-8 text-left sm:px-6 sm:py-10">
      <header className="mb-8 space-y-2">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">
          Profile
        </p>
        <h1 className="!m-0 !text-3xl !tracking-tight text-[var(--text-h)] sm:!text-4xl">
          Account
        </h1>
        <p className="text-[15px] text-[var(--text)]">
          Profile for <span className="font-semibold text-[var(--text-h)]">{username}</span>
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
              <h2 className="!m-0 !text-2xl !tracking-tight text-[var(--text-h)]">{username}</h2>
              <p className="mt-1 truncate text-[15px] text-[var(--text)]">{email}</p>
              <p className="mt-2 inline-block rounded-lg border border-[var(--border)] bg-[var(--code-bg)] px-2.5 py-1 text-[12px] font-semibold uppercase tracking-wide text-[var(--text-h)]">
                {role}
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-px bg-[var(--border)] sm:grid-cols-3">
          <div className="bg-[var(--bg)] px-4 py-4 text-center sm:px-5 sm:text-left">
            <p className="text-[12px] font-medium uppercase tracking-wide text-[var(--text)]">User ID</p>
            <p className="mt-1 truncate text-[16px] font-semibold text-[var(--text-h)]">{userId}</p>
          </div>
          <div className="bg-[var(--bg)] px-4 py-4 text-center sm:px-5 sm:text-left">
            <p className="text-[12px] font-medium uppercase tracking-wide text-[var(--text)]">Team</p>
            <p className="mt-1 truncate text-[16px] font-semibold text-[var(--text-h)]">{team}</p>
          </div>
          <div className="bg-[var(--bg)] px-4 py-4 text-center sm:px-5 sm:text-left">
            <p className="text-[12px] font-medium uppercase tracking-wide text-[var(--text)]">Session role</p>
            <p className="mt-1 text-[16px] font-semibold text-[var(--text-h)]">{role}</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Profile;

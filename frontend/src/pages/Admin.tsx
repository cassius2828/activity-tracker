import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  approveJoinRequest,
  denyJoinRequest,
  getJoinRequests,
  type JoinRequestRow,
} from "../service/joinRequests";

const approveBtnClass =
  "rounded-xl bg-[var(--accent)] px-4 py-2 text-[14px] font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60";

const denyBtnClass =
  "rounded-xl border border-rose-400/40 bg-rose-500/10 px-4 py-2 text-[14px] font-medium text-rose-800 transition hover:bg-rose-500/20 disabled:cursor-not-allowed disabled:opacity-60 dark:text-rose-100";

type PendingAction = { id: number; type: "approve" | "deny" } | null;

const Admin = () => {
  const { session, refreshSession } = useAuth();
  const [requests, setRequests] = useState<JoinRequestRow[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [pendingAction, setPendingAction] = useState<PendingAction>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const isAdmin = session?.role === "admin";

  useEffect(() => {
    if (!isAdmin) {
      setIsLoading(false);
      return;
    }

    const loadRequests = async () => {
      setIsLoading(true);
      setNotice(null);
      try {
        const rows = await getJoinRequests();
        setRequests(rows);
      } catch (err) {
        console.error(err);
        setNotice("Failed to load join requests.");
      } finally {
        setIsLoading(false);
      }
    };

    void loadRequests();
  }, [isAdmin]);

  const handleApprove = async (request: JoinRequestRow) => {
    setPendingAction({ id: request.id, type: "approve" });
    const previousRequests = requests;
    setRequests((rows) => rows.filter((row) => row.id !== request.id));
    try {
      await approveJoinRequest(request.id);
      // If the admin approved their own pending request, the cached session
      // is now stale (their teamId just changed). Refresh from the server.
      if (session && String(request.userId) === session.userId) {
        await refreshSession();
      }
      setNotice(`Approved ${request.userEmail} for ${request.teamName}.`);
    } catch (err) {
      console.error(err);
      setRequests(previousRequests);
      setNotice("Failed to approve join request.");
    } finally {
      setPendingAction(null);
    }
  };

  const handleDeny = async (request: JoinRequestRow) => {
    setPendingAction({ id: request.id, type: "deny" });
    const previousRequests = requests;
    setRequests((rows) => rows.filter((row) => row.id !== request.id));
    try {
      await denyJoinRequest(request.id);
      setNotice(`Denied join request from ${request.userEmail}.`);
    } catch (err) {
      console.error(err);
      setRequests(previousRequests);
      setNotice("Failed to deny join request.");
    } finally {
      setPendingAction(null);
    }
  };

  if (!isAdmin) {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-8 text-left sm:px-6 sm:py-10">
        <header className="mb-6 space-y-2">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">
            Admin
          </p>
          <h1 className="!m-0 !text-3xl !tracking-tight text-[var(--text-h)] sm:!text-4xl">
            Access denied
          </h1>
        </header>
        <p className="rounded-xl border border-[var(--border)] bg-[var(--code-bg)] px-4 py-3 text-[14px] text-[var(--text)]">
          You must be signed in as an admin to view this page.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8 text-left sm:px-6 sm:py-10">
      <header className="mb-8 space-y-2">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">
          Admin
        </p>
        <h1 className="!m-0 !text-3xl !tracking-tight text-[var(--text-h)] sm:!text-4xl">
          Team join requests
        </h1>
        <p className="text-[15px] text-[var(--text)]">
          Approve or deny pending requests. Both actions remove the request.
        </p>
      </header>

      {notice && (
        <p className="mb-5 rounded-xl border border-[var(--border)] bg-[var(--code-bg)] px-4 py-3 text-[14px] text-[var(--text)]">
          {notice}
        </p>
      )}

      <section className="rounded-2xl border border-[var(--border)] bg-[var(--bg)] p-5 shadow-sm">
        <h2 className="!m-0 !text-lg !tracking-tight text-[var(--text-h)]">
          Pending requests
        </h2>

        {isLoading ? (
          <p className="mt-4 text-[14px] text-[var(--text)]">Loading requests...</p>
        ) : requests.length === 0 ? (
          <p className="mt-4 text-[14px] text-[var(--text)]">
            No pending join requests.
          </p>
        ) : (
          <ul className="mt-4 space-y-3">
            {requests.map((request) => {
              const isRowBusy = pendingAction?.id === request.id;
              return (
                <li
                  key={request.id}
                  className="flex flex-col gap-3 rounded-xl border border-[var(--border)] px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <p className="text-[14px] font-medium text-[var(--text-h)]">
                      {request.teamName}{" "}
                      <span className="text-[12px] font-normal text-[var(--text)]">
                        (team #{request.teamId})
                      </span>
                    </p>
                    <p className="mt-1 text-[13px] text-[var(--text)]">
                      Requested by{" "}
                      <span className="font-medium text-[var(--text-h)]">
                        {request.userEmail}
                      </span>{" "}
                      <span className="text-[12px]">(user #{request.userId})</span>
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2 sm:justify-end">
                    <button
                      type="button"
                      onClick={() => void handleApprove(request)}
                      disabled={isRowBusy}
                      className={approveBtnClass}
                    >
                      {isRowBusy && pendingAction?.type === "approve"
                        ? "Approving..."
                        : "Approve"}
                    </button>
                    <button
                      type="button"
                      onClick={() => void handleDeny(request)}
                      disabled={isRowBusy}
                      className={denyBtnClass}
                    >
                      {isRowBusy && pendingAction?.type === "deny"
                        ? "Denying..."
                        : "Deny"}
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
};

export default Admin;

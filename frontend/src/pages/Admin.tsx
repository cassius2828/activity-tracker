import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import {
  approveJoinRequest,
  denyJoinRequest,
} from "../services/joinRequests";
import type { JoinRequestRow } from "../types/joinRequest";
import PageShell from "../components/Ui/PageShell";
import { useAdminJoinRequests } from "../hooks/useAdminJoinRequests";
import {
  cardClass,
  dangerBtnClass,
  eyebrowClass,
  noticeClass,
  primaryBtnClass,
} from "../styles/classNames";

type PendingAction = { id: number; type: "approve" | "deny" } | null;

const Admin = () => {
  const { session, refreshSession } = useAuth();
  const isAdmin = session?.role === "admin";

  const {
    requests,
    setRequests,
    isLoading,
    error: loadError,
  } = useAdminJoinRequests(isAdmin);
  const [pendingAction, setPendingAction] = useState<PendingAction>(null);

  useEffect(() => {
    if (loadError) toast.error(loadError);
  }, [loadError]);

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
      toast.success(`Approved ${request.userEmail} for ${request.teamName}.`);
    } catch {
      setRequests(previousRequests);
      toast.error("Failed to approve join request.");
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
      toast.success(`Denied join request from ${request.userEmail}.`);
    } catch {
      setRequests(previousRequests);
      toast.error("Failed to deny join request.");
    } finally {
      setPendingAction(null);
    }
  };

  if (!isAdmin) {
    return (
      <PageShell>
        <header className="mb-6 space-y-2">
          <p className={eyebrowClass}>Admin</p>
          <h1 className="!m-0 !text-3xl !tracking-tight text-[var(--text-h)] sm:!text-4xl">
            Access denied
          </h1>
        </header>
        <p className={noticeClass}>
          You must be signed in as an admin to view this page.
        </p>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <header className="mb-8 space-y-2">
        <p className={eyebrowClass}>Admin</p>
        <h1 className="!m-0 !text-3xl !tracking-tight text-[var(--text-h)] sm:!text-4xl">
          Team join requests
        </h1>
        <p className="text-[15px] text-[var(--text)]">
          Approve or deny pending requests. Both actions remove the request.
        </p>
      </header>

      <section className={cardClass}>
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
                      className={primaryBtnClass}
                    >
                      {isRowBusy && pendingAction?.type === "approve"
                        ? "Approving..."
                        : "Approve"}
                    </button>
                    <button
                      type="button"
                      onClick={() => void handleDeny(request)}
                      disabled={isRowBusy}
                      className={dangerBtnClass}
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
    </PageShell>
  );
};

export default Admin;

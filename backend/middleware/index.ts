/** Cookie session lookup → attaches `req.user` / `req.authSession` for downstream handlers. */
import { eq } from "drizzle-orm";
import type { NextFunction, Request, Response } from "express";
import db from "../config/db";
import { sessions, users } from "../config/schema";
import type { DbSession, User } from "../types";
import { hashToken } from "../utils";

type AuthenticatedSession = {
  session: DbSession;
  user: Omit<User, "password">;
};

/**
 * Validate the cookie session token and load the owning user.
 * Returns `null` when the request is not authenticated for any reason
 * (missing cookie, unknown/expired/revoked session, missing user).
 */
const loadSessionUser = async (
  req: Request,
): Promise<AuthenticatedSession | null> => {
  // Opaque token from httpOnly cookie — matched via SHA-256 hash in `sessions`
  const sessionToken = req.cookies.sessionToken;
  if (!sessionToken) return null;

  const tokenHash = hashToken(sessionToken);

  const [session] = await db
    .select()
    .from(sessions)
    .where(eq(sessions.tokenHash, tokenHash));

  if (
    !session ||
    session.expiresAt < new Date() ||
    session.revokedAt !== null
  ) {
    return null;
  }

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, session.userId));

  if (!user) return null;

  // Never send password hash to route handlers or JSON serializers
  const { password: _password, ...safeUser } = user;
  return { session, user: safeUser };
};

const attachAuth = (req: Request, auth: AuthenticatedSession) => {
  req.user = auth.user;
  req.authSession = auth.session;
};

export const isSignedIn = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const auth = await loadSessionUser(req);
    if (!auth) return res.status(401).json({ message: "Unauthorized" });
    attachAuth(req, auth);
    next();
  } catch (err) {
    next(err);
  }
};

export const isAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const auth = await loadSessionUser(req);
    if (!auth) return res.status(401).json({ message: "Unauthorized" });
    if (auth.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }
    attachAuth(req, auth);
    next();
  } catch (err) {
    next(err);
  }
};

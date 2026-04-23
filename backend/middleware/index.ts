import { eq } from "drizzle-orm";
import type { NextFunction, Request, Response } from "express";
import db from "../config/db";
import { sessions, users } from "../config/schema";
import { hashToken } from "../utils";

export const isSignedIn = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const sessionToken = req.cookies.sessionToken;
    if (!sessionToken) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const tokenHash = hashToken(sessionToken);

    const [session] = await db
      .select()
      .from(sessions)
      .where(eq(sessions.tokenHash, tokenHash));

    if (!session) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    if (session.expiresAt < new Date() || session.revokedAt !== null) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, session.userId));

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { password: _password, ...safeUser } = user;
    req.user = safeUser;
    req.authSession = session;
    next();
  } catch (err) {
    next(err);
  }
};

/**
 * Must run AFTER `isSignedIn` so `req.user` is populated.
 * Mount as: router.use(isSignedIn, isAdmin)
 */
export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Forbidden" });
  }
  next();
};

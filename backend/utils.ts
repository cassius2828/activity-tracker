/** Auth helpers: opaque session tokens, DB session rows, httpOnly cookie. */
import crypto from "node:crypto";
import type { Request, Response } from "express";
import { db } from "./config/db";
import { sessions } from "./config/schema";
import type { User } from "./types";
import { SESSION_COOKIE_MAX_AGE_MS } from "./consts";

// Normalize Express header values (string | string[] | undefined)
const headerString = (value: string | string[] | undefined) =>
  Array.isArray(value) ? (value[0] ?? "") : (value ?? "");

// Store only a hash of the session token in the DB — cookie carries the raw value
export const hashToken = (token: string): string =>
  crypto.createHash("sha256").update(token).digest("hex");

export const generateSessionToken = (): string =>
  crypto.randomBytes(32).toString("hex");

export const createSession = async ({
  user,
  req,
}: {
  user: Pick<User, "id" | "email" | "role">;
  req: Request;
}) => {
  const sessionToken = generateSessionToken();
  const tokenHash = hashToken(sessionToken);

  const [row] = await db
    .insert(sessions)
    .values({
      userId: user.id,
      tokenHash,
      expiresAt: new Date(Date.now() + SESSION_COOKIE_MAX_AGE_MS),
      ipAddress: req.ip ?? "",
      userAgent: headerString(req.headers["user-agent"]),
      deviceName: headerString(req.headers["x-device-name"]) || "unknown",
    })
    .returning({ id: sessions.id });

  return {
    sessionToken,
    sessionId: row?.id,
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
    },
  };
};

/** Route params are strings; treat non-integers as invalid. */
export const parseId = (value: string | string[] | undefined): number | null => {
  const raw = Array.isArray(value) ? value[0] : value;
  if (!raw) return null;
  const id = Number(raw);
  return Number.isInteger(id) ? id : null;
};

export const setSessionCookie = (res: Response, sessionToken: string) => {
  res.cookie("sessionToken", sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_COOKIE_MAX_AGE_MS,
  });
};
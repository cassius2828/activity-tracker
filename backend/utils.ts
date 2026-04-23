import crypto from "node:crypto";
import type { Request } from "express";

import { db } from "./config/db";
import { sessions } from "./config/schema";
import type { User } from "./types";

const headerString = (value: string | string[] | undefined) =>
  Array.isArray(value) ? (value[0] ?? "") : (value ?? "");

/**
 * Deterministic hash for opaque session tokens.
 *
 * SHA-256 is the right tool for this (NOT bcrypt):
 * - The input is already 256 bits of cryptographic randomness, so
 *   the slow-hashing properties of bcrypt add no security.
 * - bcrypt is non-deterministic (random salt per call), so it cannot
 *   be used for equality lookups against a stored hash.
 *
 * Use bcrypt for *passwords*, this for *session tokens*.
 */
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
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
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

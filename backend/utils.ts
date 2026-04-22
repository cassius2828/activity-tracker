import crypto from "node:crypto";
import bcrypt from "bcrypt";
import type { Request } from "express";

import { db } from "./config/db";
import { sessions } from "./config/schema";
import type { User } from "./types";

const headerString = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] ?? "" : value ?? "";

export const createSession = async ({
  user,
  req,
}: {
  user: Pick<User, "id" | "email" | "role">;
  req: Request;
}) => {
  const sessionToken = crypto.randomBytes(32).toString("hex");
  const tokenHash = await bcrypt.hash(sessionToken, 10);
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
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    sessionId: row?.id,
  };
};

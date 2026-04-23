import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import { db } from "../config/db";
import { sessions, users } from "../config/schema";
import { BCRYPT_SALT_ROUNDS } from "../consts";
import { generateSessionToken, hashToken } from "../utils";

const headerString = (value: string | string[] | undefined) =>
  Array.isArray(value) ? (value[0] ?? "") : (value ?? "");

const SESSION_COOKIE_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

const setSessionCookie = (
  res: Response,
  sessionToken: string,
) => {
  res.cookie("sessionToken", sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_COOKIE_MAX_AGE_MS,
  });
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body as { email: string; password: string };

    const [user] = await db.select().from(users).where(eq(users.email, email));

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const sessionToken = generateSessionToken();
    const tokenHash = hashToken(sessionToken);
    const [session] = await db
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

    setSessionCookie(res, sessionToken);

    return res.status(200).json({
      message: "Login successful",
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      sessionId: session?.id,
    });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, confirmPassword } = req.body as {
      email: string;
      password: string;
      confirmPassword: string;
    };

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const [existing] = await db
      .select()
      .from(users)
      .where(eq(users.email, email));

    if (existing) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
    const [newUser] = await db
      .insert(users)
      .values({ email, password: hashedPassword })
      .returning({ id: users.id, email: users.email, role: users.role });

    if (!newUser) {
      return res.status(500).json({ message: "Failed to create user" });
    }
    const sessionToken = generateSessionToken();
    const tokenHash = hashToken(sessionToken);
    const [session] = await db
      .insert(sessions)
      .values({
        userId: newUser.id,
        tokenHash,
        expiresAt: new Date(Date.now() + SESSION_COOKIE_MAX_AGE_MS),
        ipAddress: req.ip ?? "",
        userAgent: headerString(req.headers["user-agent"]),
        deviceName: headerString(req.headers["x-device-name"]) || "unknown",
      })
      .returning({ id: sessions.id });

    setSessionCookie(res, sessionToken);

    return res.status(201).json({
      message: "Registration successful",
      user: {
        id: newUser.id,
        email: newUser.email,
        role: newUser.role,
      },
      sessionId: session?.id,
    });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    const sessionToken = req.cookies.sessionToken;
    if (!sessionToken) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const tokenHash = hashToken(sessionToken);
    await db.delete(sessions).where(eq(sessions.tokenHash, tokenHash));
    res.clearCookie("sessionToken");
    return res.status(200).json({ message: "Logout successful" });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

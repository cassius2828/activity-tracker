import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import { db } from "../config/db";
import { sessions, users } from "../config/schema";
import { BCRYPT_SALT_ROUNDS } from "../consts";
import {
  createSession,
  hashToken,
  setSessionCookie,
} from "../utils";



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

    const session = await createSession({ user, req });
    setSessionCookie(res, session.sessionToken);

    return res.status(200).json({
      message: "Login successful",
      user: session.user,
      sessionId: session.sessionId,
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
    const session = await createSession({ user: newUser, req });
    setSessionCookie(res, session.sessionToken);

    return res.status(201).json({
      message: "Registration successful",
      user: session.user,
      sessionId: session.sessionId,
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

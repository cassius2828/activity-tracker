import type { Request, Response } from "express";
import { eq, ilike } from "drizzle-orm";
import { db } from "../config/db";
import { users } from "../config/schema";
import { parseId } from "../utils";

const safeUserSelection = {
  id: users.id,
  email: users.email,
  role: users.role,
  teamId: users.teamId,
};

export const getUsers = async (req: Request, res: Response) => {
  try {
    const rawQuery = req.query.q;
    const query =
      typeof rawQuery === "string"
        ? rawQuery.trim()
        : Array.isArray(rawQuery) && typeof rawQuery[0] === "string"
          ? rawQuery[0].trim()
          : "";

    if (query.length === 0) {
      const fetched = await db.select(safeUserSelection).from(users).limit(20);
      return res.status(200).json(fetched);
    }

    const fetched = await db
      .select(safeUserSelection)
      .from(users)
      .where(ilike(users.email, `%${query}%`))
      .limit(20);
    return res.status(200).json(fetched);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const userId = parseId(req.params.userId);
    if (userId === null) {
      return res.status(400).json({ message: "Invalid user id" });
    }
    const [user] = await db
      .select(safeUserSelection)
      .from(users)
      .where(eq(users.id, userId));
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json(user);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

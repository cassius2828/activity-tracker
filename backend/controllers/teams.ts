import { db } from "../config/db";
import { teams, users } from "../config/schema";
import { Request, Response } from "express";
import { inArray, eq } from "drizzle-orm";

export const createTeam = async (req: Request, res: Response) => {
  try {
    const { name, description, userIds } = req.body as {
      name: string;
      description: string;
      userIds?: number[];
    };
    if (!name || !description) {
      return res
        .status(400)
        .json({ message: "name and description are required" });
    }

    const [newTeam] = await db
      .insert(teams)
      .values({ name, description })
      .returning();

    // we will update all users to have the team id in thier table
    if (userIds) {
      await db
        .update(users)
        .set({ teamId: newTeam.id })
        .where(inArray(users.id, userIds));
    }
    return res.status(201).json(newTeam);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getTeams = async (req: Request, res: Response) => {
  try {
    const fetchedTeams = await db.select().from(teams);
    return res.status(200).json(fetchedTeams);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getTeamsById = async (
  req: Request<{ teamId: string | null }>,
  res: Response,
) => {
  try {
    const teamId = req.params.teamId ? parseInt(req.params.teamId) : null;
    if (teamId === null) {
      return res.status(400).json({ message: "Invalid team id" });
    }
    const fetchedTeams = await db
      .select()
      .from(teams)
      .where(eq(teams.id, teamId));
    return res.status(200).json(fetchedTeams);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// for this practice app, we will only allow one team per user
export const getTeamByUserId = async (
  req: Request<{ userId: string | null }>,
  res: Response,
) => {
  try {
    const userId = req.params.userId ? parseInt(req.params.userId) : null;
    if (userId === null) {
      return res.status(400).json({ message: "Invalid user id" });
    }
    const [fetchedUser] = await db
      .select({ teamId: users.teamId })
      .from(users)
      .where(eq(users.id, userId));
    // if the user is not found, return a 404 error
    if (!fetchedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    // if the user is not part of a team, return a 404 error
    if (fetchedUser.teamId === null) {
      return res.status(404).json({ message: "Team not found for user" });
    }
    // if the team is found, return the team
    const [fetchedTeam] = await db
      .select()
      .from(teams)
      .where(eq(teams.id, fetchedUser.teamId));
    return res.status(200).json(fetchedTeam);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

import type { Request, Response } from "express";
import { and, eq } from "drizzle-orm";
import { db } from "../config/db";
import { joinRequests, teams, users } from "../config/schema";
import { parseId } from "../utils";

export const getJoinRequests = async (_req: Request, res: Response) => {
  try {
    const rows = await db
      .select({
        id: joinRequests.id,
        teamId: teams.id,
        teamName: teams.name,
        userId: users.id,
        userEmail: users.email,
      })
      .from(joinRequests)
      .innerJoin(teams, eq(joinRequests.teamId, teams.id))
      .innerJoin(users, eq(joinRequests.userId, users.id));
    return res.status(200).json(rows);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getMyJoinRequests = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const rows = await db
      .select({
        id: joinRequests.id,
        teamId: teams.id,
        teamName: teams.name,
      })
      .from(joinRequests)
      .innerJoin(teams, eq(joinRequests.teamId, teams.id))
      .where(eq(joinRequests.userId, req.user.id));
    return res.status(200).json(rows);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const requestJoinTeam = async (req: Request, res: Response) => {
  try {
    const { teamId, userId } = req.body as {
      teamId?: string | number;
      userId?: string | number;
    };
    if (teamId === undefined || userId === undefined) {
      return res
        .status(400)
        .json({ message: "teamId and userId are required" });
    }

    const parsedTeamId = parseId(String(teamId));
    const parsedUserId = parseId(String(userId));
    if (parsedTeamId === null || parsedUserId === null) {
      return res.status(400).json({ message: "Invalid teamId or userId" });
    }

    const [existingJoinRequest] = await db
      .select({ id: joinRequests.id })
      .from(joinRequests)
      .where(
        and(
          eq(joinRequests.teamId, parsedTeamId),
          eq(joinRequests.userId, parsedUserId),
        ),
      );
    if (existingJoinRequest) {
      return res.status(400).json({ message: "Join request already exists" });
    }

    await db
      .insert(joinRequests)
      .values({ teamId: parsedTeamId, userId: parsedUserId });
    return res
      .status(201)
      .json({ message: `Join request sent to team ${parsedTeamId}` });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const approveJoinRequest = async (req: Request, res: Response) => {
  try {
    const parsedJoinRequestId = parseId(req.params.joinRequestId);
    if (parsedJoinRequestId === null) {
      return res.status(400).json({ message: "Invalid joinRequestId" });
    }

    const [joinRequest] = await db
      .select()
      .from(joinRequests)
      .where(eq(joinRequests.id, parsedJoinRequestId));

    if (
      !joinRequest ||
      joinRequest.teamId === null ||
      joinRequest.userId === null
    ) {
      return res.status(404).json({ message: "Join request not found" });
    }

    const [updatedUser] = await db
      .update(users)
      .set({ teamId: joinRequest.teamId })
      .where(eq(users.id, joinRequest.userId))
      .returning();

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    await db
      .delete(joinRequests)
      .where(eq(joinRequests.id, parsedJoinRequestId));

    return res.status(200).json({
      message: `${updatedUser.email} joined team ${joinRequest.teamId} successfully`,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const denyJoinRequest = async (req: Request, res: Response) => {
  try {
    const parsedJoinRequestId = parseId(req.params.joinRequestId);
    if (parsedJoinRequestId === null) {
      return res.status(400).json({ message: "Invalid joinRequestId" });
    }

    const [deleted] = await db
      .delete(joinRequests)
      .where(eq(joinRequests.id, parsedJoinRequestId))
      .returning();

    if (!deleted) {
      return res.status(404).json({ message: "Join request not found" });
    }

    return res.status(200).json({ message: "Join request denied" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

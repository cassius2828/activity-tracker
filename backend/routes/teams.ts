import express from "express";
import { createTeam, getTeams, getTeamsById, getTeamByUserId } from "../controllers/teams";

const router = express.Router();

router.post("/", createTeam);
router.get("/", getTeams);
router.get("/:teamId", getTeamsById);
router.get("/user/:userId", getTeamByUserId);

export default router;

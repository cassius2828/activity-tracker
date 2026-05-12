import express from "express";
import {
  createTeam,
  getTeams,
  getTeamsById,
  getTeamByUserId,
  leaveTeam,
  joinTeam,
} from "../controllers/teams";
import { isAdmin } from "../middleware";

const router = express.Router();

router.post("/", createTeam);
router.get("/", getTeams);
router.get("/user/:userId", getTeamByUserId);
router.put("/:teamId/join", isAdmin, joinTeam);
router.put("/:teamId/leave", leaveTeam);
router.get("/:teamId", getTeamsById);

export default router;

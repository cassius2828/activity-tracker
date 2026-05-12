import express from "express";
import {
  createTeam,
  getTeams,
  getTeamsById,
  getTeamByUserId,
  leaveTeam,
  requestJoinTeam,
  approveJoinRequest,
  joinTeam,
} from "../controllers/teams";
import { isAdmin } from "../middleware";

const router = express.Router();

router.post("/", createTeam);
router.get("/", getTeams);
router.get("/user/:userId", getTeamByUserId);
router.post("/:teamId/join", requestJoinTeam);
router.put("/:teamId/join", isAdmin, joinTeam);
router.put("/:teamId/leave", leaveTeam);
router.put("/:joinRequestId/approve", isAdmin, approveJoinRequest);
router.get("/:teamId", getTeamsById);
export default router;

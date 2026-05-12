import { Router } from "express";
import {
  approveJoinRequest,
  denyJoinRequest,
  getJoinRequests,
  getMyJoinRequests,
  requestJoinTeam,
} from "../controllers/joinRequests";
import { isAdmin, isSignedIn } from "../middleware";

const router = Router();

router.post("/", requestJoinTeam);
router.get("/me", isSignedIn, getMyJoinRequests);
router.get("/", isAdmin, getJoinRequests);
router.put("/:joinRequestId/approve", isAdmin, approveJoinRequest);
router.delete("/:joinRequestId", isAdmin, denyJoinRequest);

export default router;

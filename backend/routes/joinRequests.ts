import { Router } from "express";
import {
  approveJoinRequest,
  denyJoinRequest,
  getJoinRequests,
  requestJoinTeam,
} from "../controllers/joinRequests";
import { isAdmin } from "../middleware";

const router = Router();

router.post("/", requestJoinTeam);
router.get("/", isAdmin, getJoinRequests);
router.put("/:joinRequestId/approve", isAdmin, approveJoinRequest);
router.delete("/:joinRequestId", isAdmin, denyJoinRequest);

export default router;

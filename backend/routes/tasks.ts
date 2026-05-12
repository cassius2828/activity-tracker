import { Router } from "express";
import {
  createTask,
  deleteTask,
  getTaskById,
  getTasksByTeamId,
  getTasksByUserId,
  updateTask,
} from "../controllers/tasks";
import { isSignedIn } from "../middleware";

const router = Router();

router.post("/", isSignedIn, createTask);
router.get("/team/:teamId", getTasksByTeamId);
router.get("/user/:userId", getTasksByUserId);
router.get("/:id", getTaskById);
router.put("/:id", isSignedIn, updateTask);
router.delete("/:id", isSignedIn, deleteTask);

export default router;

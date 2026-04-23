import { Router } from "express";
import {
  createTask,
  deleteTask,
  getTaskById,
  getTasks,
  getTasksByUserId,
  updateTask,
} from "../controllers/tasks";
import { isSignedIn } from "../middleware";

const router = Router();

router.post("/", createTask, isSignedIn);
router.get("/", getTasks);
router.get("/:id", getTaskById);
router.get("/user/:userId", getTasksByUserId);
router.put("/:id", updateTask, isSignedIn);
router.delete("/:id", deleteTask, isSignedIn);

export default router;

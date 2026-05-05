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

router.post("/", isSignedIn, createTask);
router.get("/", getTasks);
router.get("/:id", getTaskById);
router.get("/user/:userId", getTasksByUserId);
router.put("/:id", isSignedIn, updateTask);
router.delete("/:id", isSignedIn, deleteTask);

export default router;

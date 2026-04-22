import { Router } from "express";
import {
  createTask,
  deleteTask,
  getTaskById,
  getTasks,
  getTasksByUserId,
  updateTask,
} from "../controllers/tasks";

const router = Router();

router.post("/", createTask);
router.get("/", getTasks);
router.get("/:id", getTaskById);
router.get("/user/:userId", getTasksByUserId);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);

export default router;

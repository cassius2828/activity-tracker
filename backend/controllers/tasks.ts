import type { Request, Response } from "express";
const { eq } = require("drizzle-orm");
const db = require("../config/db");
const { tasks: tasksTable } = require("../config/schema");

const createTask = async (req: Request, res: Response) => {
  try {
    const { title, description, dueDate, priority } = req.body;
    const newTask = await db.insert(tasksTable).values({
      userId: req.user!.id,
      title,
      description,
      dueDate,
      priority,
    });
    res.status(201).json(newTask);
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const getTasks = async (req: Request, res: Response) => {
  try {
    const rows = await db.select().from(tasksTable);
    res.status(200).json(rows);
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const getTaskById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const task = await db.select().from(tasksTable).where(eq(tasksTable.id, id));
    res.status(200).json(task);
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const getTasksByUserId = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    // ensure this is checking the token or session, however we decide to approach auth
    if (userId !== String(req.user!.id)) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    const rows = await db
      .select()
      .from(tasksTable)
      .where(eq(tasksTable.userId, userId));
    if (!rows) {
      return res.status(404).json({ message: "Tasks not found" });
    }
    res.status(200).json(rows);
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, dueDate, priority } = req.body;
    const updatedTask = await db
      .update(tasksTable)
      .set({ title, description, dueDate, priority })
      .where(eq(tasksTable.id, id));
    res.status(200).json(updatedTask);
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const deleteTask = async (req: Request, res: Response) => {
  try {
    const { id, userId } = req.params;
    const task = await db.select().from(tasksTable).where(eq(tasksTable.id, id));
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    if (task.userId !== userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    await db.delete(tasksTable).where(eq(tasksTable.id, id));
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getTaskById,
  getTasksByUserId,
  getTasks,
  createTask,
  updateTask,
  deleteTask,
};

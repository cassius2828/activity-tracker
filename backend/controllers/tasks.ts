import type { Request, Response } from "express";
import { eq } from "drizzle-orm";
import { db } from "../config/db";
import { tasks as tasksTable } from "../config/schema";
import type { NewTask } from "../types";

const parseId = (value: string | string[] | undefined): number | null => {
  const raw = Array.isArray(value) ? value[0] : value;
  if (!raw) return null;
  const id = Number(raw);
  return Number.isInteger(id) ? id : null;
};

export const createTask = async (req: Request, res: Response) => {
  try {
    const { title, description, dueDate, priority, category, status } =
      req.body as Partial<NewTask>;

    if (!title || !description) {
      return res
        .status(400)
        .json({ message: "title and description are required" });
    }

    const [newTask] = await db
      .insert(tasksTable)
      .values({
        userId: req.user!.id,
        title,
        description,
        dueDate: dueDate ? new Date(dueDate) : null,
        priority,
        category,
        status,
      })
      .returning();

    res.status(201).json(newTask);
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getTasks = async (_req: Request, res: Response) => {
  try {
    const rows = await db.select().from(tasksTable);
    res.status(200).json(rows);
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getTaskById = async (req: Request, res: Response) => {
  try {
    const id = parseId(req.params.id);
    if (id === null) {
      return res.status(400).json({ message: "Invalid task id" });
    }

    const [task] = await db
      .select()
      .from(tasksTable)
      .where(eq(tasksTable.id, id));

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.status(200).json(task);
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getTasksByUserId = async (req: Request, res: Response) => {
  try {
    const userId = parseId(req.params.userId);
    if (userId === null) {
      return res.status(400).json({ message: "Invalid user id" });
    }
    if (userId !== req.user!.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const rows = await db
      .select()
      .from(tasksTable)
      .where(eq(tasksTable.userId, userId));

    res.status(200).json(rows);
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateTask = async (req: Request, res: Response) => {
  try {
    const id = parseId(req.params.id);
    if (id === null) {
      return res.status(400).json({ message: "Invalid task id" });
    }

    const { title, description, dueDate, priority, category, status } =
      req.body as Partial<NewTask>;

    const [updatedTask] = await db
      .update(tasksTable)
      .set({
        title,
        description,
        dueDate: dueDate ? new Date(dueDate) : undefined,
        priority,
        category,
        status,
        updatedAt: new Date(),
      })
      .where(eq(tasksTable.id, id))
      .returning();

    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.status(200).json(updatedTask);
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteTask = async (req: Request, res: Response) => {
  try {
    const id = parseId(req.params.id);
    if (id === null) {
      return res.status(400).json({ message: "Invalid task id" });
    }

    const [task] = await db
      .select()
      .from(tasksTable)
      .where(eq(tasksTable.id, id));

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    if (task.userId !== req.user!.id && req.user!.role !== "admin") {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await db.delete(tasksTable).where(eq(tasksTable.id, id));
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

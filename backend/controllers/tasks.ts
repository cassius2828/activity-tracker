const TaskModel = require("../models/Task");

const createTask = async (req: Request, res: Response) => {
  try {
    const { title, description, dueDate, priority } = req.body;
    const newTask = await TaskModel.create({
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
    const tasks = await TaskModel.find({});
    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const getTaskById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const task = await TaskModel.findById(id);
    res.status(200).json(task);
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const getTasksByUserId = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    // ensure this is checking the token or session, however we decide to approach auth
    if (userId !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    const tasks = await TaskModel.find({ userId });
    if (!tasks) {
      return res.status(404).json({ message: "Tasks not found" });
    }
    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, dueDate, priority } = req.body;
    const updatedTask = await TaskModel.findByIdAndUpdate(
      id,
      { title, description, dueDate, priority },
      { new: true },
    );
    res.status(200).json(updatedTask);
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const deleteTask = async (req: Request, res: Response) => {
  try {
    const { id, userId } = req.params;
    const task = await TaskModel.findById(id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    if (task.userId !== userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    await TaskModel.findByIdAndDelete(id);
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  getTaskById,
  getTasksByUserId,
  getTasks,
  createTask,
  updateTask,
  deleteTask,
};

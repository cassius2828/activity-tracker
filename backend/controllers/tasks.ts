const TaskModel = require('../models/Task');

const createTask = async (req:Request, res:Response) => {
    try {
        const {title, description, dueDate, priority} = req.body;
        const newTask = await TaskModel.create({title, description, dueDate, priority});
        res.status(201).json(newTask);
        
    } catch (err) {
        res.status(500).json({message: "Internal server error"});
    }
}

const getTasks = async (req:Request, res:Response) => {
    try {
        const tasks = await TaskModel.find({});
        res.status(200).json(tasks);
        
    } catch (err) {
        res.status(500).json({message: "Internal server error"});
    }
}

const getTaskById = async (req:Request, res:Response) => {
    try {
        const {id} = req.params;
        const task = await TaskModel.findById(id);
        res.status(200).json(task);
        
    } catch (err) {
        res.status(500).json({message: "Internal server error"});
    }
}
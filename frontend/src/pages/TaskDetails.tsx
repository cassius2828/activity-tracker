import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { getTaskById, type Task } from '../service/tasks';
const TaskDetails = () => {
    const { id } = useParams();
    const [task, setTask] = useState<Task | null>(null);
    useEffect(() => {
        const fetchTask = async () => {
            if (!id) return;
            const task = await getTaskById(id);
            setTask(task);
        }
        void fetchTask();
    }, [id]);
    return (
        <div>Task Details {task?.title}</div>
    )
}

export default TaskDetails
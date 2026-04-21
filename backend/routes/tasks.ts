const express = require('express');
const router = express.Router();
const { createTask, getTasks, getTaskById, getTasksByUserId, updateTask, deleteTask } = require('../controllers/tasks');

router.post('/', createTask);
router.get('/', getTasks);
router.get('/:id', getTaskById);
router.get('/user/:userId', getTasksByUserId);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);


module.exports = router;
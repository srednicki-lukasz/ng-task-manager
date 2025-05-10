import express from 'express';
import { createTask, deleteTask, getTasks, updateTask } from '../controllers/task.controller.mjs';

const router = express.Router();

// GET /api/tasks(?status=active|completed)
router.get('/', getTasks);

// POST /api/tasks
router.post('/', createTask);

// PUT /api/tasks/:id
router.put('/:id', updateTask);

// DELETE /api/tasks/:id
router.delete('/:id', deleteTask);

export default router;

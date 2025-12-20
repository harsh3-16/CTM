/**
 * Task Controller
 * 
 * Handles HTTP requests for task operations.
 * Delegates business logic to TaskService.
 */

import { Response } from 'express';
import { taskService } from '../services';
import type { TaskFilters } from '../services';

/**
 * GET /tasks
 * Get all tasks with optional filtering and sorting
 */
export const getTasks = async (req: any, res: Response) => {
    try {
        const filters: TaskFilters = {
            status: req.query.status as string,
            priority: req.query.priority as string,
            sortBy: req.query.sortBy as string,
            sortOrder: req.query.sortOrder as 'asc' | 'desc',
            assignedToId: req.query.assignedToId as string,
            creatorId: req.query.creatorId as string,
            overdue: req.query.overdue === 'true',
        };

        const tasks = await taskService.getTasks(filters);
        res.json(tasks);
    } catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({ error: 'Failed to fetch tasks' });
    }
};

/**
 * GET /tasks/:id
 * Get a single task by ID
 */
export const getTaskById = async (req: any, res: Response) => {
    try {
        const { id } = req.params;
        const task = await taskService.getTaskById(id);

        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }

        res.json(task);
    } catch (error) {
        console.error('Error fetching task:', error);
        res.status(500).json({ error: 'Failed to fetch task' });
    }
};

/**
 * POST /tasks
 * Create a new task
 */
export const createTask = async (req: any, res: Response) => {
    try {
        const task = await taskService.createTask(req.body, req.user.userId);
        res.status(201).json(task);
    } catch (error: any) {
        console.error('Error creating task:', error);
        if (error.name === 'ZodError') {
            return res.status(400).json({ error: 'Validation error', details: error.errors });
        }
        res.status(500).json({ error: 'Failed to create task' });
    }
};

/**
 * PUT /tasks/:id
 * Update an existing task
 */
export const updateTask = async (req: any, res: Response) => {
    try {
        const { id } = req.params;
        const task = await taskService.updateTask(id, req.body, req.user.userId);
        res.json(task);
    } catch (error: any) {
        console.error('Error updating task:', error);
        if (error.name === 'ZodError') {
            return res.status(400).json({ error: 'Validation error', details: error.errors });
        }
        if (error.code === 'P2025') {
            return res.status(404).json({ error: 'Task not found' });
        }
        res.status(500).json({ error: 'Failed to update task' });
    }
};

/**
 * DELETE /tasks/:id
 * Delete a task
 */
export const deleteTask = async (req: any, res: Response) => {
    try {
        const { id } = req.params;
        await taskService.deleteTask(id);
        res.sendStatus(204);
    } catch (error: any) {
        console.error('Error deleting task:', error);
        if (error.code === 'P2025') {
            return res.status(404).json({ error: 'Task not found' });
        }
        res.status(500).json({ error: 'Failed to delete task' });
    }
};

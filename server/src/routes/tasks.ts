/**
 * Task Routes
 * 
 * Defines all routes for task CRUD operations.
 * All routes are protected and require authentication.
 */

import { Router } from 'express';
import { getTasks, getTaskById, createTask, updateTask, deleteTask } from '../controllers/taskController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Protect all task routes
router.use(authenticateToken);

/**
 * GET /tasks
 * Get all tasks with optional filters:
 * - status: TODO | IN_PROGRESS | REVIEW | COMPLETED
 * - priority: LOW | MEDIUM | HIGH | URGENT
 * - sortBy: dueDate
 * - sortOrder: asc | desc
 * - assignedToId: Filter by assigned user
 * - creatorId: Filter by creator
 * - overdue: true - Show only overdue tasks
 */
router.get('/', getTasks);

/**
 * GET /tasks/:id
 * Get a single task by ID
 */
router.get('/:id', getTaskById);

/**
 * POST /tasks
 * Create a new task
 */
router.post('/', createTask);

/**
 * PUT /tasks/:id
 * Update an existing task
 */
router.put('/:id', updateTask);

/**
 * DELETE /tasks/:id
 * Delete a task
 */
router.delete('/:id', deleteTask);

export default router;

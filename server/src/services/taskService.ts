/**
 * Task Service
 * 
 * This service handles all business logic related to tasks.
 * It separates concerns from the controller layer and provides
 * reusable methods for task operations.
 */

import { prisma } from '../utils/prisma';
import { createTaskSchema, updateTaskSchema } from '../utils/validation';
import type { Server as SocketServer } from 'socket.io';

export interface TaskFilters {
    status?: string;
    priority?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    assignedToId?: string;
    creatorId?: string;
    overdue?: boolean;
}

export interface CreateTaskData {
    title: string;
    description: string;
    dueDate?: string;
    priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
    assignedToId?: string;
}

export interface UpdateTaskData {
    title?: string;
    description?: string;
    dueDate?: string;
    priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
    status?: 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'COMPLETED';
    assignedToId?: string;
}

/**
 * TaskService class handles all task-related business logic
 */
export class TaskService {
    private io: SocketServer | null = null;

    /**
     * Set the Socket.io server instance for real-time notifications
     */
    setSocketServer(io: SocketServer) {
        this.io = io;
    }

    /**
     * Get all tasks with optional filtering and sorting
     * @param filters - Optional filters for status, priority, assignedTo, etc.
     */
    async getTasks(filters: TaskFilters = {}) {
        const { status, priority, sortBy, sortOrder, assignedToId, creatorId, overdue } = filters;

        const where: any = {};
        if (status) where.status = status;
        if (priority) where.priority = priority;
        if (assignedToId) where.assignedToId = assignedToId;
        if (creatorId) where.creatorId = creatorId;

        // Filter for overdue tasks
        if (overdue) {
            where.dueDate = { lt: new Date() };
            where.status = { not: 'COMPLETED' };
        }

        const orderBy: any = {};
        if (sortBy === 'dueDate') {
            orderBy.dueDate = sortOrder === 'desc' ? 'desc' : 'asc';
        } else {
            orderBy.createdAt = 'desc';
        }

        return prisma.task.findMany({
            where,
            orderBy,
            include: {
                creator: { select: { id: true, name: true, email: true } },
                assignedTo: { select: { id: true, name: true, email: true } }
            }
        });
    }

    /**
     * Get a single task by ID
     */
    async getTaskById(id: string) {
        return prisma.task.findUnique({
            where: { id },
            include: {
                creator: { select: { id: true, name: true, email: true } },
                assignedTo: { select: { id: true, name: true, email: true } }
            }
        });
    }

    /**
     * Create a new task
     * @param data - Task creation data
     * @param creatorId - ID of the user creating the task
     */
    async createTask(data: CreateTaskData, creatorId: string) {
        const validated = createTaskSchema.parse(data);

        const task = await prisma.task.create({
            data: {
                ...validated,
                dueDate: validated.dueDate ? new Date(validated.dueDate) : null,
                creatorId,
            },
            include: {
                creator: { select: { id: true, name: true, email: true } },
                assignedTo: { select: { id: true, name: true, email: true } }
            }
        });

        // Emit real-time event
        if (this.io) {
            this.io.emit('task_created', task);

            // Send assignment notification if task is assigned
            if (task.assignedToId && task.assignedToId !== creatorId) {
                this.emitAssignmentNotification(task.assignedToId, task, 'assigned');
            }
        }

        return task;
    }

    /**
     * Update an existing task
     * @param id - Task ID
     * @param data - Update data
     * @param updatedBy - ID of the user making the update
     */
    async updateTask(id: string, data: UpdateTaskData, updatedBy: string) {
        const validated = updateTaskSchema.parse(data);

        // Get the previous task state to check assignment changes
        const previousTask = await this.getTaskById(id);

        const task = await prisma.task.update({
            where: { id },
            data: {
                ...validated,
                dueDate: validated.dueDate ? new Date(validated.dueDate) : undefined
            },
            include: {
                creator: { select: { id: true, name: true, email: true } },
                assignedTo: { select: { id: true, name: true, email: true } }
            }
        });

        // Emit real-time event
        if (this.io) {
            this.io.emit('task_updated', task);

            // Check if assignment changed and notify new assignee
            if (
                task.assignedToId &&
                task.assignedToId !== previousTask?.assignedToId &&
                task.assignedToId !== updatedBy
            ) {
                this.emitAssignmentNotification(task.assignedToId, task, 'assigned');
            }
        }

        return task;
    }

    /**
     * Delete a task
     * @param id - Task ID
     */
    async deleteTask(id: string) {
        await prisma.task.delete({ where: { id } });

        if (this.io) {
            this.io.emit('task_deleted', id);
        }
    }

    /**
     * Emit assignment notification to a specific user
     * @private
     */
    private emitAssignmentNotification(
        userId: string,
        task: any,
        action: 'assigned' | 'unassigned'
    ) {
        if (!this.io) return;

        const notification = {
            id: `notif_${Date.now()}`,
            type: 'task_assignment',
            action,
            task: {
                id: task.id,
                title: task.title,
                priority: task.priority,
                dueDate: task.dueDate,
            },
            message: action === 'assigned'
                ? `You have been assigned to task: "${task.title}"`
                : `You have been unassigned from task: "${task.title}"`,
            createdAt: new Date().toISOString(),
            read: false,
        };

        // Emit to specific user room
        this.io.to(`user_${userId}`).emit('notification', notification);

        // Also emit globally for the notification system
        this.io.emit('task_assigned', { userId, task, notification });
    }
}

// Export singleton instance
export const taskService = new TaskService();

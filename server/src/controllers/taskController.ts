import { Request, Response } from 'express';
import { prisma } from '../utils/prisma';
import { createTaskSchema, updateTaskSchema } from '../utils/validation';

export const getTasks = async (req: any, res: Response) => {
    try {
        const { status, priority, sortBy, sortOrder } = req.query;

        const where: any = {};
        if (status) where.status = status;
        if (priority) where.priority = priority;

        const orderBy: any = {};
        if (sortBy === 'dueDate') {
            orderBy.dueDate = sortOrder === 'desc' ? 'desc' : 'asc';
        } else {
            orderBy.createdAt = 'desc'; // Default sort
        }

        const tasks = await prisma.task.findMany({
            where,
            orderBy,
            include: {
                creator: { select: { id: true, name: true } },
                assignedTo: { select: { id: true, name: true } }
            }
        });

        res.json(tasks);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

export const createTask = async (req: any, res: Response) => {
    try {
        const data = createTaskSchema.parse(req.body);
        const task = await prisma.task.create({
            data: {
                ...data,
                dueDate: data.dueDate ? new Date(data.dueDate) : null,
                creatorId: req.user.userId,
            },
            include: {
                creator: { select: { id: true, name: true } },
                assignedTo: { select: { id: true, name: true } }
            }
        });

        const io = req.app.get('io');
        io.emit('task_created', task);

        res.status(201).json(task);
    } catch (error) {
        res.status(400).json({ error: 'Validation error' });
    }
};

export const updateTask = async (req: any, res: Response) => {
    try {
        const { id } = req.params;
        const data = updateTaskSchema.parse(req.body);

        const task = await prisma.task.update({
            where: { id },
            data: {
                ...data,
                dueDate: data.dueDate ? new Date(data.dueDate) : undefined
            },
            include: {
                creator: { select: { id: true, name: true } },
                assignedTo: { select: { id: true, name: true } }
            }
        });

        const io = req.app.get('io');
        io.emit('task_updated', task);

        res.json(task);
    } catch (e) {
        res.status(400).json({ error: 'Update failed' });
    }
}

export const deleteTask = async (req: any, res: Response) => {
    try {
        const { id } = req.params;
        await prisma.task.delete({ where: { id } });
        const io = req.app.get('io');
        io.emit('task_deleted', id);
        res.sendStatus(204);
    } catch (e) {
        res.sendStatus(500);
    }
}

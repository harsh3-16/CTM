import { z } from 'zod';

export const registerSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    name: z.string().min(2).optional(),
});

export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
});

export const createTaskSchema = z.object({
    title: z.string().min(1).max(100),
    description: z.string().min(1),
    dueDate: z.string().optional(), // Should be ISO date string
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']),
    assignedToId: z.string().uuid().optional(),
});

export const updateTaskSchema = createTaskSchema.partial().extend({
    status: z.enum(['TODO', 'IN_PROGRESS', 'REVIEW', 'COMPLETED']).optional(),
});

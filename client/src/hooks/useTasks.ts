import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { tasksApi } from '../lib/api/tasks';
import type { CreateTaskDto, UpdateTaskDto } from '../types';

/**
 * Task filtering options
 */
interface TaskFilters {
    status?: string;
    priority?: string;
    sortBy?: 'dueDate';
    sortOrder?: 'asc' | 'desc';
    assignedToId?: string;
    creatorId?: string;
    overdue?: string;
}

/**
 * Hook to fetch tasks with optional filters
 * Supports filtering by status, priority, assignee, creator, and overdue status
 */
export const useTasks = (filters?: TaskFilters) => {
    return useQuery({
        queryKey: ['tasks', filters],
        queryFn: () => tasksApi.getTasks(filters),
    });
};

/**
 * Hook to fetch a single task by ID
 */
export const useTask = (id: string) => {
    return useQuery({
        queryKey: ['task', id],
        queryFn: () => tasksApi.getTask(id),
        enabled: !!id,
    });
};

/**
 * Hook to create a new task
 * Automatically invalidates task list on success
 */
export const useCreateTask = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateTaskDto) => tasksApi.createTask(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
        },
    });
};

/**
 * Hook to update an existing task
 * Automatically invalidates task list on success
 */
export const useUpdateTask = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateTaskDto }) =>
            tasksApi.updateTask(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
        },
    });
};

/**
 * Hook to delete a task
 * Automatically invalidates task list on success
 */
export const useDeleteTask = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => tasksApi.deleteTask(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
        },
    });
};

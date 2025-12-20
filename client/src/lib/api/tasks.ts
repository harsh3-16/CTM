import api from '../axios';
import type { Task, CreateTaskDto, UpdateTaskDto } from '../../types';

/**
 * Task filtering parameters
 */
interface GetTasksParams {
  status?: string;
  priority?: string;
  sortBy?: 'dueDate';
  sortOrder?: 'asc' | 'desc';
  assignedToId?: string;
  creatorId?: string;
  overdue?: string;
}

/**
 * Tasks API client
 * Handles all task-related HTTP requests
 */
export const tasksApi = {
  /**
   * Get all tasks with optional filters
   */
  getTasks: async (params?: GetTasksParams): Promise<Task[]> => {
    const response = await api.get<Task[]>('/tasks', { params });
    return response.data;
  },

  /**
   * Get a single task by ID
   */
  getTask: async (id: string): Promise<Task> => {
    const response = await api.get<Task>(`/tasks/${id}`);
    return response.data;
  },

  /**
   * Create a new task
   */
  createTask: async (data: CreateTaskDto): Promise<Task> => {
    const response = await api.post<Task>('/tasks', data);
    return response.data;
  },

  /**
   * Update an existing task
   */
  updateTask: async (id: string, data: UpdateTaskDto): Promise<Task> => {
    const response = await api.put<Task>(`/tasks/${id}`, data);
    return response.data;
  },

  /**
   * Delete a task
   */
  deleteTask: async (id: string): Promise<void> => {
    await api.delete(`/tasks/${id}`);
  },
};

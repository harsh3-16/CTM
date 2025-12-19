import api from '../axios';
import type { Task, CreateTaskDto, UpdateTaskDto } from '../../types';

interface GetTasksParams {
  status?: string;
  priority?: string;
  sortBy?: 'dueDate';
  sortOrder?: 'asc' | 'desc';
}

export const tasksApi = {
  getTasks: async (params?: GetTasksParams): Promise<Task[]> => {
    const response = await api.get<Task[]>('/tasks', { params });
    return response.data;
  },

  createTask: async (data: CreateTaskDto): Promise<Task> => {
    const response = await api.post<Task>('/tasks', data);
    return response.data;
  },

  updateTask: async (id: string, data: UpdateTaskDto): Promise<Task> => {
    const response = await api.put<Task>(`/tasks/${id}`, data);
    return response.data;
  },

  deleteTask: async (id: string): Promise<void> => {
    await api.delete(`/tasks/${id}`);
  },
};

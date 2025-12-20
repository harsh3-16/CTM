/**
 * Services barrel export
 * 
 * This file exports all service classes for easy importing
 * throughout the application.
 */

export { taskService, TaskService } from './taskService';
export { authService, AuthService } from './authService';

export type { TaskFilters, CreateTaskData, UpdateTaskData } from './taskService';
export type { RegisterData, LoginData, AuthResponse } from './authService';

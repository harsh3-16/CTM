// Shared types matching backend models
export interface User {
    id: string;
    email: string;
    name: string | null;
}

export interface Task {
    id: string;
    title: string;
    description: string;
    dueDate: string | null;
    priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
    status: 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'COMPLETED';
    creatorId: string;
    assignedToId: string | null;
    createdAt: string;
    updatedAt: string;
    creator?: { id: string; name: string | null };
    assignedTo?: { id: string; name: string | null };
}

export interface CreateTaskDto {
    title: string;
    description: string;
    dueDate?: string;
    priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
    assignedToId?: string;
}

export interface UpdateTaskDto {
    title?: string;
    description?: string;
    dueDate?: string;
    priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
    status?: 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'COMPLETED';
    assignedToId?: string;
}

export interface LoginDto {
    email: string;
    password: string;
}

export interface RegisterDto {
    email: string;
    password: string;
    name?: string;
}

export interface AuthResponse {
    token: string;
    user: User;
}

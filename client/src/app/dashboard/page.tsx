'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTasks, useCreateTask, useUpdateTask, useDeleteTask } from '@/hooks/useTasks';
import { useSocket } from '@/hooks/useSocket';
import { useLogout } from '@/hooks/useAuth';
import { useAppSelector } from '@/store/hooks';
import { TaskCard } from '@/components/TaskCard';
import { TaskForm } from '@/components/TaskForm';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import type { Task, CreateTaskDto, UpdateTaskDto } from '@/types';

export default function DashboardPage() {
    useSocket(); // Enable real-time updates
    const router = useRouter();
    const logout = useLogout();
    const user = useAppSelector((state) => state.auth.user);

    const [statusFilter, setStatusFilter] = useState<string>('');
    const [priorityFilter, setPriorityFilter] = useState<string>('');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);

    const { data: tasks = [], isLoading } = useTasks({
        status: statusFilter || undefined,
        priority: priorityFilter || undefined,
    });

    const createTask = useCreateTask();
    const updateTask = useUpdateTask();
    const deleteTask = useDeleteTask();

    const handleLogout = () => {
        logout();
        router.push('/login');
    };

    const handleCreateTask = (data: CreateTaskDto) => {
        createTask.mutate(data, {
            onSuccess: () => setIsCreateModalOpen(false),
        });
    };

    const handleUpdateTask = (data: UpdateTaskDto) => {
        if (editingTask) {
            updateTask.mutate(
                { id: editingTask.id, data },
                {
                    onSuccess: () => setEditingTask(null),
                }
            );
        }
    };

    const handleDeleteTask = (id: string) => {
        if (confirm('Are you sure you want to delete this task?')) {
            deleteTask.mutate(id);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Task Dashboard</h1>
                        <p className="text-sm text-gray-600">Welcome, {user?.name || user?.email}</p>
                    </div>
                    <Button variant="ghost" onClick={handleLogout}>
                        Logout
                    </Button>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 py-8">
                {/* Filters and Create Button */}
                <div className="flex flex-wrap gap-4 mb-6">
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    >
                        <option value="">All Statuses</option>
                        <option value="TODO">To Do</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="REVIEW">Review</option>
                        <option value="COMPLETED">Completed</option>
                    </select>

                    <select
                        value={priorityFilter}
                        onChange={(e) => setPriorityFilter(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    >
                        <option value="">All Priorities</option>
                        <option value="LOW">Low</option>
                        <option value="MEDIUM">Medium</option>
                        <option value="HIGH">High</option>
                        <option value="URGENT">Urgent</option>
                    </select>

                    <div className="ml-auto">
                        <Button onClick={() => setIsCreateModalOpen(true)}>
                            + Create Task
                        </Button>
                    </div>
                </div>

                {/* Task List */}
                {isLoading ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500">Loading tasks...</p>
                    </div>
                ) : tasks.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500">No tasks found. Create one to get started!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {tasks.map((task) => (
                            <div key={task.id} className="relative group">
                                <TaskCard task={task} onClick={() => setEditingTask(task)} />
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteTask(task.id);
                                    }}
                                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition-all"
                                >
                                    🗑️
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            {/* Create Task Modal */}
            <Modal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                title="Create New Task"
            >
                <TaskForm
                    onSubmit={handleCreateTask}
                    onCancel={() => setIsCreateModalOpen(false)}
                    isLoading={createTask.isPending}
                />
            </Modal>

            {/* Edit Task Modal */}
            <Modal
                isOpen={!!editingTask}
                onClose={() => setEditingTask(null)}
                title="Edit Task"
            >
                {editingTask && (
                    <TaskForm
                        initialData={{
                            title: editingTask.title,
                            description: editingTask.description,
                            priority: editingTask.priority,
                            status: editingTask.status,
                            dueDate: editingTask.dueDate || undefined,
                        }}
                        onSubmit={handleUpdateTask}
                        onCancel={() => setEditingTask(null)}
                        isLoading={updateTask.isPending}
                    />
                )}
            </Modal>
        </div>
    );
}

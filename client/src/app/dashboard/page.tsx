'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useTasks, useCreateTask, useUpdateTask, useDeleteTask } from '@/hooks/useTasks';
import { useSocket } from '@/hooks/useSocket';
import { useLogout } from '@/hooks/useAuth';
import { useAppSelector } from '@/store/hooks';
import { TaskCard } from '@/components/TaskCard';
import { TaskForm } from '@/components/TaskForm';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { TaskCardSkeleton } from '@/components/TaskCardSkeleton';
import { NotificationBell } from '@/components/NotificationBell';
import { useToast } from '@/components/ToastProvider';
import type { Task, CreateTaskDto, UpdateTaskDto } from '@/types';

type ViewTab = 'all' | 'assigned' | 'created' | 'overdue';

export default function DashboardPage() {
    const router = useRouter();
    const logout = useLogout();
    const user = useAppSelector((state) => state.auth.user);
    const { showToast } = useToast();

    // Enable real-time updates with user's notification room
    const { notifications, unreadCount, markAsRead, clearNotifications } = useSocket(user?.id);

    const [viewTab, setViewTab] = useState<ViewTab>('all');
    const [statusFilter, setStatusFilter] = useState<string>('');
    const [priorityFilter, setPriorityFilter] = useState<string>('');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);

    // Build filters based on view tab
    const filters = useMemo(() => {
        const baseFilters: Record<string, string | undefined> = {
            status: statusFilter || undefined,
            priority: priorityFilter || undefined,
        };

        switch (viewTab) {
            case 'assigned':
                return { ...baseFilters, assignedToId: user?.id };
            case 'created':
                return { ...baseFilters, creatorId: user?.id };
            case 'overdue':
                return { ...baseFilters, overdue: 'true' };
            default:
                return baseFilters;
        }
    }, [viewTab, statusFilter, priorityFilter, user?.id]);

    const { data: tasks = [], isLoading } = useTasks(filters);

    const createTask = useCreateTask();
    const updateTask = useUpdateTask();
    const deleteTask = useDeleteTask();

    const handleLogout = () => {
        logout();
        showToast('Logged out successfully. See you soon!', 'info');
        router.push('/login');
    };

    const handleCreateTask = (data: CreateTaskDto) => {
        createTask.mutate(data, {
            onSuccess: () => {
                setIsCreateModalOpen(false);
                showToast('Task created successfully!', 'success');
            },
            onError: () => {
                showToast('Failed to create task', 'error');
            },
        });
    };

    const handleUpdateTask = (data: UpdateTaskDto) => {
        if (editingTask) {
            updateTask.mutate(
                { id: editingTask.id, data },
                {
                    onSuccess: () => {
                        setEditingTask(null);
                        showToast('Task updated successfully!', 'success');
                    },
                    onError: () => {
                        showToast('Failed to update task', 'error');
                    },
                }
            );
        }
    };

    const handleDeleteTask = (id: string) => {
        if (confirm('Are you sure you want to delete this task?')) {
            deleteTask.mutate(id, {
                onSuccess: () => {
                    showToast('Task deleted successfully!', 'success');
                },
                onError: () => {
                    showToast('Failed to delete task', 'error');
                },
            });
        }
    };

    const viewTabs: { key: ViewTab; label: string; icon: string }[] = [
        { key: 'all', label: 'All Tasks', icon: '📋' },
        { key: 'assigned', label: 'Assigned to Me', icon: '👤' },
        { key: 'created', label: 'Created by Me', icon: '✏️' },
        { key: 'overdue', label: 'Overdue', icon: '⚠️' },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            {/* Header */}
            <header className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                            Task Dashboard
                        </h1>
                        <p className="text-sm text-gray-600 mt-1">
                            Welcome back, <span className="font-semibold text-gray-900">{user?.name || user?.email}</span>
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <NotificationBell
                            notifications={notifications}
                            unreadCount={unreadCount}
                            onMarkAsRead={markAsRead}
                            onClear={clearNotifications}
                        />
                        <Button variant="ghost" onClick={handleLogout} className="hover:bg-red-50 hover:text-red-600">
                            Logout
                        </Button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 py-8">
                {/* View Tabs */}
                <div className="flex flex-wrap gap-2 mb-6">
                    {viewTabs.map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => setViewTab(tab.key)}
                            className={`px-4 py-2 rounded-lg font-medium transition-all ${viewTab === tab.key
                                    ? 'bg-indigo-600 text-white shadow-md'
                                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                                }`}
                        >
                            <span className="mr-2">{tab.icon}</span>
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Filters and Create Button */}
                <div className="flex flex-wrap gap-4 mb-8 bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
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
                        className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    >
                        <option value="">All Priorities</option>
                        <option value="LOW">Low</option>
                        <option value="MEDIUM">Medium</option>
                        <option value="HIGH">High</option>
                        <option value="URGENT">Urgent</option>
                    </select>

                    <div className="ml-auto">
                        <Button onClick={() => setIsCreateModalOpen(true)} className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
                            <svg className="w-5 h-5 mr-2 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Create Task
                        </Button>
                    </div>
                </div>

                {/* Task List */}
                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <TaskCardSkeleton key={i} />
                        ))}
                    </div>
                ) : tasks.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
                        <p className="text-gray-500 text-lg">
                            {viewTab === 'assigned' && 'No tasks assigned to you.'}
                            {viewTab === 'created' && 'You haven\'t created any tasks yet.'}
                            {viewTab === 'overdue' && '🎉 No overdue tasks! Great job!'}
                            {viewTab === 'all' && 'No tasks found. Create one to get started!'}
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {tasks.map((task) => (
                            <div key={task.id} className="relative">
                                <TaskCard task={task} onClick={() => setEditingTask(task)} />
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteTask(task.id);
                                    }}
                                    className="absolute -top-2 -right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors shadow-lg hover:shadow-xl z-10"
                                    title="Delete task"
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
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
                            assignedToId: editingTask.assignedToId || undefined,
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

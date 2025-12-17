import { Task } from '@/types';
import { Card } from './ui/Card';

interface TaskCardProps {
    task: Task;
    onClick?: () => void;
}

const priorityColors = {
    LOW: 'bg-gray-100 text-gray-800',
    MEDIUM: 'bg-blue-100 text-blue-800',
    HIGH: 'bg-orange-100 text-orange-800',
    URGENT: 'bg-red-100 text-red-800',
};

const statusColors = {
    TODO: 'bg-gray-100 text-gray-800',
    IN_PROGRESS: 'bg-yellow-100 text-yellow-800',
    REVIEW: 'bg-purple-100 text-purple-800',
    COMPLETED: 'bg-green-100 text-green-800',
};

export function TaskCard({ task, onClick }: TaskCardProps) {
    return (
        <Card onClick={onClick} className="hover:border-indigo-300 border-2 border-transparent">
            <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-semibold text-gray-900">{task.title}</h3>
                <div className="flex gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityColors[task.priority]}`}>
                        {task.priority}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[task.status]}`}>
                        {task.status.replace('_', ' ')}
                    </span>
                </div>
            </div>

            <p className="text-gray-600 text-sm mb-4 line-clamp-2">{task.description}</p>

            <div className="flex justify-between items-center text-sm text-gray-500">
                <div>
                    {task.assignedTo ? (
                        <span>Assigned to: <span className="font-medium">{task.assignedTo.name || task.assignedTo.id}</span></span>
                    ) : (
                        <span className="text-gray-400">Unassigned</span>
                    )}
                </div>
                {task.dueDate && (
                    <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                )}
            </div>
        </Card>
    );
}

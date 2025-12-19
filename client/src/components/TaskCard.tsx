import { Task } from '@/types';
import { Card } from './ui/Card';

interface TaskCardProps {
    task: Task;
    onClick?: () => void;
}

const priorityColors = {
    LOW: 'bg-blue-50 text-blue-700 border-blue-200',
    MEDIUM: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    HIGH: 'bg-orange-50 text-orange-700 border-orange-200',
    URGENT: 'bg-red-50 text-red-700 border-red-200',
};

const statusColors = {
    TODO: 'bg-gray-50 text-gray-700 border-gray-200',
    IN_PROGRESS: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    REVIEW: 'bg-purple-50 text-purple-700 border-purple-200',
    COMPLETED: 'bg-green-50 text-green-700 border-green-200',
};

export function TaskCard({ task, onClick }: TaskCardProps) {
    return (
        <Card
            onClick={onClick}
            className="hover:shadow-lg hover:border-indigo-200 transition-all duration-200 cursor-pointer"
        >
            {/* Header */}
            <div className="flex justify-between items-start gap-3 mb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex-1 leading-tight">
                    {task.title}
                </h3>
                <div className="flex gap-2 flex-shrink-0">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${priorityColors[task.priority]}`}>
                        {task.priority}
                    </span>
                </div>
            </div>

            {/* Status Badge */}
            <div className="mb-3">
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${statusColors[task.status]}`}>
                    {task.status.replace('_', ' ')}
                </span>
            </div>

            {/* Description */}
            <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
                {task.description}
            </p>

            {/* Footer */}
            <div className="flex justify-between items-center text-xs text-gray-500 pt-3 border-t border-gray-100">
                <div className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    {task.assignedTo ? (
                        <span className="font-medium text-gray-700">{task.assignedTo.name || task.assignedTo.id}</span>
                    ) : (
                        <span className="text-gray-400">Unassigned</span>
                    )}
                </div>
                {task.dueDate && (
                    <div className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                    </div>
                )}
            </div>
        </Card>
    );
}

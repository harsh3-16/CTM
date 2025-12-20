'use client';

import { useState } from 'react';
import type { Notification } from '@/hooks/useSocket';

interface NotificationBellProps {
    notifications: Notification[];
    unreadCount: number;
    onMarkAsRead: (id: string) => void;
    onClear: () => void;
}

/**
 * NotificationBell component
 * Displays a bell icon with unread notification count and dropdown
 */
export function NotificationBell({
    notifications,
    unreadCount,
    onMarkAsRead,
    onClear
}: NotificationBellProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative">
            {/* Bell Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                aria-label={`Notifications (${unreadCount} unread)`}
            >
                <svg
                    className="w-6 h-6 text-gray-600 dark:text-gray-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    />
                </svg>

                {/* Unread Badge */}
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown */}
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Dropdown Panel */}
                    <div className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                        {/* Header */}
                        <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-700">
                            <h3 className="font-semibold text-gray-900 dark:text-white">
                                Notifications
                            </h3>
                            {notifications.length > 0 && (
                                <button
                                    onClick={onClear}
                                    className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400"
                                >
                                    Clear all
                                </button>
                            )}
                        </div>

                        {/* Notification List */}
                        {notifications.length === 0 ? (
                            <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                                No notifications
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-100 dark:divide-gray-700">
                                {notifications.map((notification) => (
                                    <div
                                        key={notification.id}
                                        className={`p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors ${!notification.read ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                                            }`}
                                        onClick={() => onMarkAsRead(notification.id)}
                                    >
                                        <p className="text-sm text-gray-900 dark:text-white">
                                            {notification.message}
                                        </p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className={`text-xs px-2 py-0.5 rounded ${getPriorityColor(notification.task.priority)}`}>
                                                {notification.task.priority}
                                            </span>
                                            <span className="text-xs text-gray-400">
                                                {formatTime(notification.createdAt)}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}

function getPriorityColor(priority: string): string {
    switch (priority) {
        case 'URGENT': return 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300';
        case 'HIGH': return 'bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300';
        case 'MEDIUM': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300';
        default: return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
    }
}

function formatTime(isoString: string): string {
    const date = new Date(isoString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();

    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;

    return date.toLocaleDateString();
}

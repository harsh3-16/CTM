'use client';

import { useEffect, useCallback, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useQueryClient } from '@tanstack/react-query';

let socket: Socket | null = null;

export interface Notification {
  id: string;
  type: string;
  action: string;
  task: {
    id: string;
    title: string;
    priority: string;
    dueDate: string | null;
  };
  message: string;
  createdAt: string;
  read: boolean;
}

export function useSocket(userId?: string) {
  const queryClient = useQueryClient();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback((notification: Notification) => {
    setNotifications(prev => [notification, ...prev].slice(0, 50)); // Keep last 50
  }, []);

  const markAsRead = useCallback((notificationId: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
    );
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  useEffect(() => {
    // Initialize socket connection
    if (!socket) {
      socket = io(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000');

      socket.on('connect', () => {
        console.log('✅ Socket connected:', socket?.id);

        // Join user's personal notification room if userId available
        if (userId) {
          socket?.emit('join_user_room', userId);
        }
      });

      socket.on('disconnect', () => {
        console.log('❌ Socket disconnected');
      });

      // Listen for task events
      socket.on('task_created', (task) => {
        console.log('📬 Task created:', task.title);
        queryClient.invalidateQueries({ queryKey: ['tasks'] });
      });

      socket.on('task_updated', (task) => {
        console.log('📬 Task updated:', task.title);
        queryClient.invalidateQueries({ queryKey: ['tasks'] });
      });

      socket.on('task_deleted', (taskId) => {
        console.log('📬 Task deleted:', taskId);
        queryClient.invalidateQueries({ queryKey: ['tasks'] });
      });

      // Listen for assignment notifications
      socket.on('notification', (notification: Notification) => {
        console.log('🔔 Notification received:', notification.message);
        addNotification(notification);
      });

      socket.on('task_assigned', (data) => {
        console.log('📋 Task assigned event:', data);
        queryClient.invalidateQueries({ queryKey: ['tasks'] });
      });
    } else if (userId && socket.connected) {
      // If socket already exists, just join the user room
      socket.emit('join_user_room', userId);
    }

    return () => {
      // Don't disconnect on unmount to maintain connection across page navigation
    };
  }, [queryClient, userId, addNotification]);

  return {
    socket,
    notifications,
    unreadCount: notifications.filter(n => !n.read).length,
    markAsRead,
    clearNotifications
  };
}

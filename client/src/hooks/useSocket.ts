'use client';

import { useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { useQueryClient } from '@tanstack/react-query';

let socket: Socket | null = null;

export function useSocket() {
  const queryClient = useQueryClient();

  useEffect(() => {
    // Initialize socket connection
    if (!socket) {
      socket = io(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000');

      socket.on('connect', () => {
        console.log('✅ Socket connected:', socket?.id);
      });

      socket.on('disconnect', () => {
        console.log('❌ Socket disconnected');
      });

      // Listen for task events
      socket.on('task_created', (task) => {
        console.log('📬 Task created event received:', task);
        queryClient.invalidateQueries({ queryKey: ['tasks'] });
      });

      socket.on('task_updated', (task) => {
        console.log('📬 Task updated event received:', task);
        queryClient.invalidateQueries({ queryKey: ['tasks'] });
      });

      socket.on('task_deleted', (taskId) => {
        console.log('📬 Task deleted event received:', taskId);
        queryClient.invalidateQueries({ queryKey: ['tasks'] });
      });
    }

    return () => {
      // Don't disconnect on unmount to maintain connection across page navigation
    };
  }, [queryClient]);

  return socket;
}

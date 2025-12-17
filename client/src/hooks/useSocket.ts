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
      socket = io(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000');

      socket.on('connect', () => {
        console.log('✅ Socket connected:', socket?.id);
      });

      socket.on('disconnect', () => {
        console.log('❌ Socket disconnected');
      });

      // Listen for task events
      socket.on('task_created', () => {
        console.log('📬 Task created event received');
        queryClient.invalidateQueries({ queryKey: ['tasks'] });
      });

      socket.on('task_updated', () => {
        console.log('📬 Task updated event received');
        queryClient.invalidateQueries({ queryKey: ['tasks'] });
      });

      socket.on('task_deleted', () => {
        console.log('📬 Task deleted event received');
        queryClient.invalidateQueries({ queryKey: ['tasks'] });
      });
    }

    return () => {
      if (socket) {
        socket.disconnect();
        socket = null;
      }
    };
  }, [queryClient]);

  return socket;
}

/**
 * Server Entry Point
 * 
 * Main server configuration for the Collaborative Task Manager API.
 * Sets up Express, Socket.io, and all middleware/routes.
 */

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import { createServer } from 'http';
import { Server } from 'socket.io';
import authRoutes from './routes/auth';
import taskRoutes from './routes/tasks';
import userRoutes from './routes/users';
import { taskService } from './services';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE"]
    }
});

// Initialize TaskService with Socket.io for real-time notifications
taskService.setSocketServer(io);

// Make io accessible to routers (backward compatibility)
app.set('io', io);

// Middleware
app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/', (req, res) => {
    res.json({
        message: 'Collaborative Task Manager API',
        status: 'healthy',
        version: '1.0.0'
    });
});

// Routes
app.use('/auth', authRoutes);
app.use('/tasks', taskRoutes);
app.use('/users', userRoutes);

// Socket.io connection handling
io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Allow users to join their personal notification room
    socket.on('join_user_room', (userId: string) => {
        socket.join(`user_${userId}`);
        console.log(`User ${userId} joined their notification room`);
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

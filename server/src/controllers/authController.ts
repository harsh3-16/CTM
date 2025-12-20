/**
 * Auth Controller
 * 
 * Handles HTTP requests for authentication operations.
 * Delegates business logic to AuthService.
 */

import { Request, Response } from 'express';
import { authService } from '../services';

/**
 * POST /auth/register
 * Register a new user
 */
export const register = async (req: Request, res: Response) => {
    try {
        const result = await authService.register(req.body);
        res.status(201).json(result);
    } catch (error: any) {
        console.error('Registration error:', error);

        if (error.message === 'User already exists') {
            return res.status(400).json({ error: 'User already exists' });
        }
        if (error.name === 'ZodError') {
            return res.status(400).json({ error: 'Validation error', details: error.errors });
        }
        res.status(500).json({ error: 'Registration failed' });
    }
};

/**
 * POST /auth/login
 * Authenticate a user
 */
export const login = async (req: Request, res: Response) => {
    try {
        const result = await authService.login(req.body);
        res.json(result);
    } catch (error: any) {
        console.error('Login error:', error);

        if (error.message === 'Invalid credentials') {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        if (error.name === 'ZodError') {
            return res.status(400).json({ error: 'Validation error', details: error.errors });
        }
        res.status(500).json({ error: 'Login failed' });
    }
};

/**
 * GET /auth/me
 * Get current user profile
 */
export const getMe = async (req: any, res: Response) => {
    try {
        const user = await authService.getUserById(req.user.userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ error: 'Failed to get profile' });
    }
};

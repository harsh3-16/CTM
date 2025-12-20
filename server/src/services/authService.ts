/**
 * Auth Service
 * 
 * This service handles all authentication-related business logic.
 * It separates concerns from the controller layer and provides
 * reusable methods for user authentication operations.
 */

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../utils/prisma';
import { registerSchema, loginSchema } from '../utils/validation';

export interface RegisterData {
    email: string;
    password: string;
    name?: string;
}

export interface LoginData {
    email: string;
    password: string;
}

export interface AuthResponse {
    token: string;
    user: {
        id: string;
        email: string;
        name: string | null;
    };
}

/**
 * AuthService class handles all authentication-related business logic
 */
export class AuthService {
    private readonly SALT_ROUNDS = 10;
    private readonly TOKEN_EXPIRY = '7d';

    /**
     * Register a new user
     * @param data - Registration data (email, password, name)
     * @throws Error if user already exists or validation fails
     */
    async register(data: RegisterData): Promise<AuthResponse> {
        const validated = registerSchema.parse(data);
        const { email, password, name } = validated;

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            throw new Error('User already exists');
        }

        // Hash password
        const passwordHash = await bcrypt.hash(password, this.SALT_ROUNDS);

        // Create user
        const user = await prisma.user.create({
            data: { email, passwordHash, name },
        });

        // Generate token
        const token = this.generateToken(user.id);

        return {
            token,
            user: { id: user.id, email: user.email, name: user.name }
        };
    }

    /**
     * Authenticate a user with email and password
     * @param data - Login credentials
     * @throws Error if credentials are invalid
     */
    async login(data: LoginData): Promise<AuthResponse> {
        const validated = loginSchema.parse(data);
        const { email, password } = validated;

        // Find user
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            throw new Error('Invalid credentials');
        }

        // Verify password
        const validPassword = await bcrypt.compare(password, user.passwordHash);
        if (!validPassword) {
            throw new Error('Invalid credentials');
        }

        // Generate token
        const token = this.generateToken(user.id);

        return {
            token,
            user: { id: user.id, email: user.email, name: user.name }
        };
    }

    /**
     * Get user profile by ID
     * @param userId - User ID
     */
    async getUserById(userId: string) {
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            return null;
        }
        return { id: user.id, email: user.email, name: user.name };
    }

    /**
     * Verify a JWT token
     * @param token - JWT token string
     */
    verifyToken(token: string): { userId: string } | null {
        try {
            return jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string };
        } catch {
            return null;
        }
    }

    /**
     * Generate a JWT token for a user
     * @private
     */
    private generateToken(userId: string): string {
        return jwt.sign(
            { userId },
            process.env.JWT_SECRET as string,
            { expiresIn: this.TOKEN_EXPIRY }
        );
    }
}

// Export singleton instance
export const authService = new AuthService();

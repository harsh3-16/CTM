import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Mock environment variable
process.env.JWT_SECRET = 'test-secret-key';

describe('Auth Logic', () => {
    describe('Password Hashing', () => {
        it('should hash passwords correctly', async () => {
            const password = 'testpassword123';
            const hash = await bcrypt.hash(password, 10);

            expect(hash).not.toBe(password);
            expect(hash.length).toBeGreaterThan(0);
        });

        it('should verify correct password', async () => {
            const password = 'testpassword123';
            const hash = await bcrypt.hash(password, 10);

            const isValid = await bcrypt.compare(password, hash);
            expect(isValid).toBe(true);
        });

        it('should reject incorrect password', async () => {
            const password = 'testpassword123';
            const wrongPassword = 'wrongpassword';
            const hash = await bcrypt.hash(password, 10);

            const isValid = await bcrypt.compare(wrongPassword, hash);
            expect(isValid).toBe(false);
        });
    });

    describe('JWT Token', () => {
        it('should generate valid JWT token', () => {
            const payload = { userId: 'test-user-id' };
            const token = jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: '7d' });

            expect(token).toBeDefined();
            expect(typeof token).toBe('string');
            expect(token.split('.').length).toBe(3); // JWT has 3 parts
        });

        it('should verify valid JWT token', () => {
            const payload = { userId: 'test-user-id' };
            const token = jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: '7d' });

            const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string };
            expect(decoded.userId).toBe('test-user-id');
        });

        it('should reject invalid JWT token', () => {
            const invalidToken = 'invalid.token.here';

            expect(() => {
                jwt.verify(invalidToken, process.env.JWT_SECRET as string);
            }).toThrow();
        });

        it('should reject token with wrong secret', () => {
            const payload = { userId: 'test-user-id' };
            const token = jwt.sign(payload, 'different-secret', { expiresIn: '7d' });

            expect(() => {
                jwt.verify(token, process.env.JWT_SECRET as string);
            }).toThrow();
        });
    });
});

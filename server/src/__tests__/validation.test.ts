import { registerSchema, loginSchema, createTaskSchema, updateTaskSchema } from '../utils/validation';

describe('Validation Schemas', () => {
  describe('registerSchema', () => {
    it('should validate correct registration data', () => {
      const validData = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      };
      
      const result = registerSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject invalid email', () => {
      const invalidData = {
        email: 'not-an-email',
        password: 'password123',
      };
      
      const result = registerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject short password', () => {
      const invalidData = {
        email: 'test@example.com',
        password: '12345', // Less than 6 characters
      };
      
      const result = registerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should allow optional name field', () => {
      const validData = {
        email: 'test@example.com',
        password: 'password123',
      };
      
      const result = registerSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });
  });

  describe('loginSchema', () => {
    it('should validate correct login data', () => {
      const validData = {
        email: 'test@example.com',
        password: 'password123',
      };
      
      const result = loginSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject missing email', () => {
      const invalidData = {
        password: 'password123',
      };
      
      const result = loginSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject missing password', () => {
      const invalidData = {
        email: 'test@example.com',
      };
      
      const result = loginSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe('createTaskSchema', () => {
    it('should validate correct task data', () => {
      const validData = {
        title: 'Test Task',
        description: 'This is a test task description',
        priority: 'HIGH',
      };
      
      const result = createTaskSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject empty title', () => {
      const invalidData = {
        title: '',
        description: 'Description',
        priority: 'MEDIUM',
      };
      
      const result = createTaskSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject title longer than 100 characters', () => {
      const invalidData = {
        title: 'A'.repeat(101),
        description: 'Description',
        priority: 'MEDIUM',
      };
      
      const result = createTaskSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject invalid priority', () => {
      const invalidData = {
        title: 'Test Task',
        description: 'Description',
        priority: 'INVALID_PRIORITY',
      };
      
      const result = createTaskSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should accept valid priority values', () => {
      const priorities = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];
      
      priorities.forEach((priority) => {
        const result = createTaskSchema.safeParse({
          title: 'Test',
          description: 'Description',
          priority,
        });
        expect(result.success).toBe(true);
      });
    });

    it('should allow optional dueDate', () => {
      const validData = {
        title: 'Test Task',
        description: 'Description',
        priority: 'MEDIUM',
        dueDate: '2025-12-31',
      };
      
      const result = createTaskSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });
  });

  describe('updateTaskSchema', () => {
    it('should allow partial updates', () => {
      const validData = {
        status: 'IN_PROGRESS',
      };
      
      const result = updateTaskSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should validate status values', () => {
      const statuses = ['TODO', 'IN_PROGRESS', 'REVIEW', 'COMPLETED'];
      
      statuses.forEach((status) => {
        const result = updateTaskSchema.safeParse({ status });
        expect(result.success).toBe(true);
      });
    });

    it('should reject invalid status', () => {
      const invalidData = {
        status: 'INVALID_STATUS',
      };
      
      const result = updateTaskSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });
});

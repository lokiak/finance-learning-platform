import { AuthService } from '../../services/authService';
import { prisma } from '../../index';
import bcrypt from 'bcrypt';

// Mock Prisma
jest.mock('../../index', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    userProfile: {
      create: jest.fn(),
    },
  },
}));

// Mock bcrypt
jest.mock('bcrypt');

describe('AuthService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should create a new user and profile', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        name: 'Test User',
        password_hash: 'hashed-password',
        role: 'user',
        created_at: new Date(),
        updated_at: new Date(),
        last_login: null,
        profile_completed: false,
      };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed-password');
      (prisma.user.create as jest.Mock).mockResolvedValue(mockUser);
      (prisma.userProfile.create as jest.Mock).mockResolvedValue({});

      const result = await AuthService.register({
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      });

      expect(result).toHaveProperty('token');
      expect(result.user.email).toBe('test@example.com');
      expect(result.user.name).toBe('Test User');
      expect(prisma.user.create).toHaveBeenCalled();
      expect(prisma.userProfile.create).toHaveBeenCalled();
    });

    it('should throw error if user already exists', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue({
        id: 'existing-user',
        email: 'test@example.com',
      });

      await expect(
        AuthService.register({
          email: 'test@example.com',
          password: 'password123',
          name: 'Test User',
        })
      ).rejects.toThrow();
    });
  });

  describe('login', () => {
    it('should return token and user on successful login', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        name: 'Test User',
        password_hash: 'hashed-password',
        role: 'admin',
        created_at: new Date(),
        updated_at: new Date(),
        last_login: null,
        profile_completed: false,
      };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (prisma.user.update as jest.Mock).mockResolvedValue(mockUser);

      const result = await AuthService.login({
        email: 'test@example.com',
        password: 'password123',
      });

      expect(result).toHaveProperty('token');
      expect(result.user.email).toBe('test@example.com');
      expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashed-password');
    });

    it('should throw error if user not found', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(
        AuthService.login({
          email: 'nonexistent@example.com',
          password: 'password123',
        })
      ).rejects.toThrow();
    });

    it('should throw error if password is incorrect', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        password_hash: 'hashed-password',
      };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        AuthService.login({
          email: 'test@example.com',
          password: 'wrong-password',
        })
      ).rejects.toThrow();
    });
  });

  describe('getUserById', () => {
    it('should return user without password hash', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        name: 'Test User',
        password_hash: 'hashed-password',
        role: 'admin',
        created_at: new Date(),
        updated_at: new Date(),
        last_login: null,
        profile_completed: false,
        profile: null,
      };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

      const result = await AuthService.getUserById('user-123');

      expect(result).not.toHaveProperty('password_hash');
      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('email');
      expect(result).toHaveProperty('role');
    });

    it('should throw error if user not found', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(AuthService.getUserById('nonexistent-id')).rejects.toThrow();
    });
  });
});


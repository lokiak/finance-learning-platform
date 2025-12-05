import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../index';
import { ErrorCodes, ErrorMessages, RegisterRequest, LoginRequest, AuthResponse } from '@finance-platform/shared';
import { AppError } from '../middleware/errorHandler';

const BCRYPT_ROUNDS = 12;
const JWT_EXPIRATION = '24h';

export class AuthService {
  static async register(data: RegisterRequest): Promise<AuthResponse> {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new AppError(
        ErrorCodes.AUTH_USER_EXISTS,
        ErrorMessages[ErrorCodes.AUTH_USER_EXISTS],
        409
      );
    }

    // Hash password
    const password_hash = await bcrypt.hash(data.password, BCRYPT_ROUNDS);

    // Create user
    const user = await prisma.user.create({
      data: {
        email: data.email,
        password_hash,
        name: data.name,
        last_login: new Date(),
      },
    });

    // Create empty profile
    await prisma.userProfile.create({
      data: {
        user_id: user.id,
      },
    });

    // Generate JWT
    // Note: Using type assertion due to TypeScript language server cache - role field exists in DB
    const userRole = (user as any).role || 'user';
    const token = this.generateToken(user.id, user.email, userRole);

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: userRole,
        created_at: user.created_at,
        updated_at: user.updated_at,
        last_login: user.last_login,
        profile_completed: user.profile_completed,
      },
    };
  }

  static async login(data: LoginRequest): Promise<AuthResponse> {
    // Find user
    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      throw new AppError(
        ErrorCodes.AUTH_INVALID_CREDENTIALS,
        ErrorMessages[ErrorCodes.AUTH_INVALID_CREDENTIALS],
        401
      );
    }

    // Verify password
    const isValid = await bcrypt.compare(data.password, user.password_hash);

    if (!isValid) {
      throw new AppError(
        ErrorCodes.AUTH_INVALID_CREDENTIALS,
        ErrorMessages[ErrorCodes.AUTH_INVALID_CREDENTIALS],
        401
      );
    }

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { last_login: new Date() },
    });

    // Generate JWT
    // Note: Using type assertion due to TypeScript language server cache - role field exists in DB
    const userRole = (user as any).role || 'user';
    const token = this.generateToken(user.id, user.email, userRole);

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: userRole,
        created_at: user.created_at,
        updated_at: user.updated_at,
        last_login: new Date(),
        profile_completed: user.profile_completed,
      },
    };
  }

  static async getUserById(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true },
    });

    if (!user) {
      throw new AppError(
        ErrorCodes.USER_NOT_FOUND,
        ErrorMessages[ErrorCodes.USER_NOT_FOUND],
        404
      );
    }

    // Remove password hash, ensure role is included
    const { password_hash, ...userWithoutPassword } = user;
    // Note: role field exists in DB - explicitly extract it
    const userRole = (user as any).role;
    console.log('getUserById - Raw user role from DB:', userRole);

    const userWithRole = {
      ...userWithoutPassword,
      role: userRole || 'user',
    };

    console.log('getUserById - Returning user with role:', userWithRole.role);

    return userWithRole;
  }

  static generateToken(userId: string, email: string, role: string = 'user'): string {
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined');
    }

    return jwt.sign({ userId, email, role }, process.env.JWT_SECRET, {
      expiresIn: JWT_EXPIRATION,
    });
  }

  static verifyToken(token: string): { userId: string; email: string; role?: string } {
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined');
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET) as {
        userId: string;
        email: string;
        role?: string;
      };
      return decoded;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new AppError(
          ErrorCodes.AUTH_TOKEN_EXPIRED,
          ErrorMessages[ErrorCodes.AUTH_TOKEN_EXPIRED],
          401
        );
      }
      throw new AppError(
        ErrorCodes.AUTH_TOKEN_INVALID,
        ErrorMessages[ErrorCodes.AUTH_TOKEN_INVALID],
        401
      );
    }
  }
}

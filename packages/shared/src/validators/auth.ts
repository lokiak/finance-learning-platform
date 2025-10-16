import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  name: z.string().min(1, 'Name is required').max(255, 'Name is too long'),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const updateProfileSchema = z.object({
  age: z.number().min(18, 'Must be at least 18').max(120, 'Invalid age').optional(),
  current_income: z.number().min(0, 'Income cannot be negative').optional(),
  financial_goals: z.array(z.string()).optional(),
  risk_tolerance: z.enum(['conservative', 'moderate', 'aggressive']).optional(),
  has_debt: z.boolean().optional(),
  has_emergency_fund: z.boolean().optional(),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

import { z } from 'zod';

// Progress validators
export const updateProgressSchema = z.object({
  progress_percentage: z.number().min(0).max(100).optional(),
  time_spent_minutes: z.number().min(0).optional(),
});

export const completeSectionSchema = z.object({
  notes: z.string().max(5000, 'Notes are too long').optional(),
});

// Goal validators
export const createGoalSchema = z.object({
  goal_type: z.string().min(1, 'Goal type is required'),
  title: z.string().min(1, 'Title is required').max(255, 'Title is too long'),
  description: z.string().max(1000, 'Description is too long').optional(),
  target_amount: z.number().min(0, 'Target amount must be non-negative').optional(),
  target_date: z.string().datetime().optional(),
});

export const updateGoalSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255, 'Title is too long').optional(),
  description: z.string().max(1000, 'Description is too long').optional(),
  target_amount: z.number().min(0, 'Target amount must be non-negative').optional(),
  target_date: z.string().datetime().optional(),
  current_progress: z.number().min(0, 'Progress must be non-negative').optional(),
  status: z.enum(['active', 'completed', 'paused', 'abandoned']).optional(),
});

// AI validators
export const chatRequestSchema = z.object({
  message: z.string().min(1, 'Message is required').max(2000, 'Message is too long'),
  conversation_id: z.string().uuid().optional(),
  module_id: z.string().uuid().optional(),
  context: z.string().max(500, 'Context is too long').optional(),
});

// UUID validator
export const uuidSchema = z.string().uuid('Invalid ID format');

export type UpdateProgressInput = z.infer<typeof updateProgressSchema>;
export type CompleteSectionInput = z.infer<typeof completeSectionSchema>;
export type CreateGoalInput = z.infer<typeof createGoalSchema>;
export type UpdateGoalInput = z.infer<typeof updateGoalSchema>;
export type ChatRequestInput = z.infer<typeof chatRequestSchema>;

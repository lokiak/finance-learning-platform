import { Router, Response } from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import { authenticate, AuthRequest } from '../middleware/auth';
import { prisma } from '../index';

const router = Router();
router.use(authenticate);

// GET /api/preferences - Get user preferences
router.get(
  '/',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    let preferences = await prisma.userPreferences.findUnique({
      where: { user_id: req.user!.userId },
    });

    // Create default preferences if none exist
    if (!preferences) {
      preferences = await prisma.userPreferences.create({
        data: {
          user_id: req.user!.userId,
          theme: 'auto',
          seasonal_theme: true,
          time_based_theme: true,
          soundscape_enabled: false,
          soundscape_volume: 0.5,
          sound_effects_enabled: true,
          journal_reminders: true,
          reminder_frequency: 'daily',
          show_stress_exercises: true,
          content_pacing: 'medium',
          reduce_motion: false,
          high_contrast: false,
          font_size_adjust: 0,
        },
      });
    }

    res.json({ preferences });
  })
);

// PUT /api/preferences - Update user preferences
router.put(
  '/',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const updates = req.body;

    const preferences = await prisma.userPreferences.upsert({
      where: { user_id: req.user!.userId },
      create: {
        user_id: req.user!.userId,
        ...updates,
      },
      update: updates,
    });

    res.json({ preferences });
  })
);

export default router;

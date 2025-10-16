import { Router, Response } from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import { authenticate, AuthRequest } from '../middleware/auth';
import { prisma } from '../index';

const router = Router();
router.use(authenticate);

// GET /api/achievements
router.get(
  '/',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const achievements = await prisma.achievement.findMany({
      where: { user_id: req.user!.userId },
      orderBy: { earned_at: 'desc' },
    });

    // TODO: Implement available achievements logic
    const available = [];

    res.json({ achievements, available });
  })
);

export default router;

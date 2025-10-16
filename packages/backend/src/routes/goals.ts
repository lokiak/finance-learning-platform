import { Router, Response } from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import { authenticate, AuthRequest } from '../middleware/auth';
import { prisma } from '../index';

const router = Router();
router.use(authenticate);

// GET /api/goals
router.get(
  '/',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const goals = await prisma.userGoal.findMany({
      where: { user_id: req.user!.userId },
      orderBy: { created_at: 'desc' },
    });

    res.json({ goals });
  })
);

// POST /api/goals
router.post(
  '/',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const { goal_type, title, description, target_amount, target_date } = req.body;

    const goal = await prisma.userGoal.create({
      data: {
        user_id: req.user!.userId,
        goal_type,
        title,
        description,
        target_amount,
        target_date: target_date ? new Date(target_date) : null,
      },
    });

    res.status(201).json({ goal });
  })
);

// PUT /api/goals/:goalId
router.put(
  '/:goalId',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const goal = await prisma.userGoal.update({
      where: { id: req.params.goalId },
      data: {
        ...req.body,
        target_date: req.body.target_date ? new Date(req.body.target_date) : undefined,
      },
    });

    res.json({ goal });
  })
);

// DELETE /api/goals/:goalId
router.delete(
  '/:goalId',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    await prisma.userGoal.delete({
      where: { id: req.params.goalId },
    });

    res.json({ success: true });
  })
);

export default router;

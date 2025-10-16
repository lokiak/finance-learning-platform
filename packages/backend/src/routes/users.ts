import { Router, Response } from 'express';
import { UserService } from '../services/userService';
import { asyncHandler } from '../middleware/errorHandler';
import { validateBody } from '../middleware/validation';
import { updateProfileSchema } from '@finance-platform/shared';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(authenticate);

// GET /api/users/profile
router.get(
  '/profile',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const profile = await UserService.getProfile(req.user!.userId);
    res.json({ profile });
  })
);

// PUT /api/users/profile
router.put(
  '/profile',
  validateBody(updateProfileSchema),
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const profile = await UserService.updateProfile(req.user!.userId, req.body);
    res.json({ profile });
  })
);

// GET /api/users/dashboard
router.get(
  '/dashboard',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const dashboardData = await UserService.getDashboardData(req.user!.userId);
    res.json(dashboardData);
  })
);

export default router;

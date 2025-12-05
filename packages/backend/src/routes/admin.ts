import { Router, Response } from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import { authenticate, AuthRequest } from '../middleware/auth';
import { requireAdmin } from '../middleware/admin';
import { AdminAnalyticsService } from '../services/adminAnalyticsService';

const router = Router();

// All routes require authentication and admin role
router.use(authenticate);
router.use(requireAdmin);

// GET /api/admin/analytics
router.get(
  '/analytics',
  asyncHandler(async (_req: AuthRequest, res: Response) => {
    const analytics = await AdminAnalyticsService.getAnalytics();
    res.json({ analytics });
  })
);

// GET /api/admin/analytics/overview
router.get(
  '/analytics/overview',
  asyncHandler(async (_req: AuthRequest, res: Response) => {
    const analytics = await AdminAnalyticsService.getAnalytics();
    res.json({ overview: analytics.overview });
  })
);

// GET /api/admin/analytics/predictions
router.get(
  '/analytics/predictions',
  asyncHandler(async (_req: AuthRequest, res: Response) => {
    const analytics = await AdminAnalyticsService.getAnalytics();
    res.json({ predictions: analytics.predictions });
  })
);

// GET /api/admin/analytics/adaptations
router.get(
  '/analytics/adaptations',
  asyncHandler(async (_req: AuthRequest, res: Response) => {
    const analytics = await AdminAnalyticsService.getAnalytics();
    res.json({ adaptations: analytics.adaptations });
  })
);

// GET /api/admin/analytics/support
router.get(
  '/analytics/support',
  asyncHandler(async (_req: AuthRequest, res: Response) => {
    const analytics = await AdminAnalyticsService.getAnalytics();
    res.json({ support: analytics.support });
  })
);

// GET /api/admin/analytics/engagement
router.get(
  '/analytics/engagement',
  asyncHandler(async (_req: AuthRequest, res: Response) => {
    const analytics = await AdminAnalyticsService.getAnalytics();
    res.json({ engagement: analytics.engagement });
  })
);

// GET /api/admin/analytics/reflection
router.get(
  '/analytics/reflection',
  asyncHandler(async (_req: AuthRequest, res: Response) => {
    const analytics = await AdminAnalyticsService.getAnalytics();
    res.json({ reflection: analytics.reflection });
  })
);

// GET /api/admin/analytics/performance
router.get(
  '/analytics/performance',
  asyncHandler(async (_req: AuthRequest, res: Response) => {
    const analytics = await AdminAnalyticsService.getAnalytics();
    res.json({ performance: analytics.performance });
  })
);

export default router;


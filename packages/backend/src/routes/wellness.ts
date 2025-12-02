import { Router, Response } from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import { authenticate, AuthRequest } from '../middleware/auth';
import { PredictiveWellnessService } from '../services/predictiveWellnessService';

const router = Router();
router.use(authenticate);

// GET /api/wellness/predict-stress
router.get(
  '/predict-stress',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const { module_id } = req.query;

    const prediction = await PredictiveWellnessService.predictStress(
      req.user!.userId,
      module_id as string | undefined
    );

    res.json(prediction);
  })
);

// GET /api/wellness/optimal-time
router.get(
  '/optimal-time',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const optimalTime = await PredictiveWellnessService.detectOptimalTime(req.user!.userId);
    res.json(optimalTime);
  })
);

// GET /api/wellness/predict-engagement
router.get(
  '/predict-engagement',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const prediction = await PredictiveWellnessService.predictEngagement(req.user!.userId);
    res.json(prediction);
  })
);

// GET /api/wellness/success-probability
router.get(
  '/success-probability',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const { module_id } = req.query;

    if (!module_id) {
      return res.status(400).json({
        error: { code: 'MISSING_PARAMS', message: 'module_id is required' },
      });
    }

    const probability = await PredictiveWellnessService.modelSuccess(
      req.user!.userId,
      module_id as string
    );

    res.json(probability);
  })
);

export default router;


import { Router, Response } from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import { authenticate, AuthRequest } from '../middleware/auth';
import { HolisticEducationService } from '../services/holisticEducationService';

const router = Router();
router.use(authenticate);

// GET /api/holistic/emotional-state
router.get(
  '/emotional-state',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const { module_id } = req.query;

    const emotionalState = await HolisticEducationService.integrateEmotionalState(
      req.user!.userId,
      module_id as string | undefined
    );

    res.json(emotionalState);
  })
);

// GET /api/holistic/behavioral-patterns
router.get(
  '/behavioral-patterns',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const patterns = await HolisticEducationService.analyzeBehavioralPatterns(req.user!.userId);
    res.json(patterns);
  })
);

// GET /api/holistic/real-world-application
router.get(
  '/real-world-application',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const { module_id } = req.query;

    if (!module_id) {
      return res.status(400).json({
        error: { code: 'MISSING_PARAMS', message: 'module_id is required' },
      });
    }

    const application = await HolisticEducationService.linkRealWorldApplication(
      req.user!.userId,
      module_id as string
    );

    res.json(application);
  })
);

// GET /api/holistic/module-connections
router.get(
  '/module-connections',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const { module_id } = req.query;

    if (!module_id) {
      return res.status(400).json({
        error: { code: 'MISSING_PARAMS', message: 'module_id is required' },
      });
    }

    const connections = await HolisticEducationService.findConnections(
      req.user!.userId,
      module_id as string
    );

    res.json(connections);
  })
);

export default router;


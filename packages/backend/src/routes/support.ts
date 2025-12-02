import { Router, Response } from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import { authenticate, AuthRequest } from '../middleware/auth';
import { ProactiveSupportService } from '../services/proactiveSupportService';

const router = Router();
router.use(authenticate);

// POST /api/support/hint
router.post(
  '/hint',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const {
      module_id,
      section_id,
      condition,
      time_spent,
      error_count,
    } = req.body;

    if (!module_id || !condition) {
      return res.status(400).json({
        error: { code: 'MISSING_PARAMS', message: 'module_id and condition are required' },
      });
    }

    const hint = await ProactiveSupportService.generateHint(
      req.user!.userId,
      {
        module_id,
        section_id,
        condition,
        time_spent,
        error_count,
      }
    );

    res.json({ hint });
  })
);

// POST /api/support/encouragement
router.post(
  '/encouragement',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const {
      moment_type,
      module_id,
      progress_percentage,
      recent_achievements,
    } = req.body;

    if (!moment_type) {
      return res.status(400).json({
        error: { code: 'MISSING_PARAMS', message: 'moment_type is required' },
      });
    }

    const encouragement = await ProactiveSupportService.triggerEncouragement(
      req.user!.userId,
      {
        moment_type,
        module_id,
        progress_percentage,
        recent_achievements,
      }
    );

    res.json({ encouragement });
  })
);

// GET /api/support/break-suggestion
router.get(
  '/break-suggestion',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const suggestion = await ProactiveSupportService.suggestBreak(req.user!.userId);
    res.json({ suggestion });
  })
);

// POST /api/support/celebrate
router.post(
  '/celebrate',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const {
      achievement_type,
      module_id,
      module_title,
      significance,
    } = req.body;

    if (!achievement_type) {
      return res.status(400).json({
        error: { code: 'MISSING_PARAMS', message: 'achievement_type is required' },
      });
    }

    const celebration = await ProactiveSupportService.celebrateProgress(
      req.user!.userId,
      {
        achievement_type,
        module_id,
        module_title,
        significance,
      }
    );

    res.json({ celebration });
  })
);

export default router;


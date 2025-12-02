import { Router, Response } from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import { authenticate, AuthRequest } from '../middleware/auth';
import { AdaptiveLearningService } from '../services/adaptiveLearningService';

const router = Router();
router.use(authenticate);

// POST /api/learning/performance
router.post(
  '/performance',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const {
      module_id,
      section_id,
      concept_id,
      time_spent_seconds,
      assessment_score,
      error_count,
      error_patterns,
      completion_status,
      notes_taken,
      content_reviewed,
      interactive_engaged,
    } = req.body;

    const performance = await AdaptiveLearningService.trackPerformance(
      req.user!.userId,
      module_id,
      {
        section_id,
        concept_id,
        time_spent_seconds,
        assessment_score,
        error_count,
        error_patterns,
        completion_status,
        notes_taken,
        content_reviewed,
        interactive_engaged,
      }
    );

    // Get adaptations based on performance
    const adaptations = {
      content_difficulty: assessment_score && assessment_score < 60 ? 'remedial' : 'standard',
      next_section_recommendation: completion_status === 'completed' ? 'proceed' : 'review',
      remediation_needed: assessment_score !== undefined && assessment_score < 60,
    };

    res.json({
      performance_id: performance.id,
      adaptations,
    });
  })
);

// GET /api/learning/style
router.get(
  '/style',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const learningStyle = await AdaptiveLearningService.detectLearningStyle(req.user!.userId);
    res.json({ learning_style: learningStyle });
  })
);

// GET /api/learning/adapt-content
router.get(
  '/adapt-content',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const { module_id, section_id } = req.query;

    if (!module_id || !section_id) {
      return res.status(400).json({
        error: { code: 'MISSING_PARAMS', message: 'module_id and section_id are required' },
      });
    }

    const adaptedContent = await AdaptiveLearningService.adaptContent(
      req.user!.userId,
      module_id as string,
      section_id as string
    );

    res.json({ adapted_content: adaptedContent });
  })
);

// GET /api/learning/mastery
router.get(
  '/mastery',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const { concept_id } = req.query;

    if (!concept_id) {
      return res.status(400).json({
        error: { code: 'MISSING_PARAMS', message: 'concept_id is required' },
      });
    }

    const mastery = await AdaptiveLearningService.calculateMastery(
      req.user!.userId,
      concept_id as string
    );

    res.json({
      concept_id: concept_id as string,
      mastery_level: mastery.mastery_level,
      status: mastery.status,
      assessment_history: mastery.assessment_history,
      next_review_date: mastery.next_review_date,
      spaced_interval_days: mastery.spaced_interval_days,
    });
  })
);

// GET /api/learning/path
router.get(
  '/path',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const { current_module } = req.query;

    if (!current_module) {
      return res.status(400).json({
        error: { code: 'MISSING_PARAMS', message: 'current_module is required' },
      });
    }

    const learningPath = await AdaptiveLearningService.recommendPath(
      req.user!.userId,
      current_module as string
    );

    res.json(learningPath);
  })
);

// GET /api/learning/remediation
router.get(
  '/remediation',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const { concept_id } = req.query;

    if (!concept_id) {
      return res.status(400).json({
        error: { code: 'MISSING_PARAMS', message: 'concept_id is required' },
      });
    }

    try {
      const remediationPath = await AdaptiveLearningService.getRemediationPath(
        req.user!.userId,
        concept_id as string
      );
      res.json(remediationPath);
    } catch (error: any) {
      if (error.message.includes('does not require remediation')) {
        return res.status(400).json({
          error: { code: 'NO_REMEDIATION_NEEDED', message: error.message },
        });
      }
      throw error;
    }
  })
);

export default router;


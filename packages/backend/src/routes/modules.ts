import { Router, Response } from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import { authenticate, AuthRequest } from '../middleware/auth';
import { prisma } from '../index';

const router = Router();
router.use(authenticate);

// GET /api/modules
router.get(
  '/',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const modules = await prisma.module.findMany({
      orderBy: { order_index: 'asc' },
    });

    // Get user progress for each module
    const userProgress = await prisma.userProgress.findMany({
      where: { user_id: req.user!.userId },
    });

    const modulesWithProgress = modules.map(module => {
      const progress = userProgress.find(p => p.module_id === module.id);
      return {
        ...module,
        progress: progress ? {
          status: progress.status,
          progress_percentage: progress.progress_percentage,
          started_at: progress.started_at,
          completed_at: progress.completed_at,
          last_accessed: progress.last_accessed,
          time_spent_minutes: progress.time_spent_minutes,
        } : null,
        is_locked: false, // TODO: Implement prerequisite checking
      };
    });

    res.json({ modules: modulesWithProgress });
  })
);

// GET /api/modules/:moduleId
router.get(
  '/:moduleId',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const module = await prisma.module.findUnique({
      where: { id: req.params.moduleId },
      include: { content: { orderBy: { order_index: 'asc' } } },
    });

    if (!module) {
      res.status(404).json({ error: { code: 'MODULE_NOT_FOUND', message: 'Module not found' } });
      return;
    }

    const progress = await prisma.userProgress.findUnique({
      where: {
        user_id_module_id: {
          user_id: req.user!.userId,
          module_id: module.id,
        },
      },
    });

    res.json({ module, progress });
  })
);

export default router;

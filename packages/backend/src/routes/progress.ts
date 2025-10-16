import { Router, Response } from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import { authenticate, AuthRequest } from '../middleware/auth';
import { prisma } from '../index';

const router = Router();
router.use(authenticate);

// POST /api/progress/module/:moduleId/start
router.post(
  '/module/:moduleId/start',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const progress = await prisma.userProgress.upsert({
      where: {
        user_id_module_id: {
          user_id: req.user!.userId,
          module_id: req.params.moduleId,
        },
      },
      update: {
        status: 'in_progress',
        last_accessed: new Date(),
      },
      create: {
        user_id: req.user!.userId,
        module_id: req.params.moduleId,
        status: 'in_progress',
        started_at: new Date(),
        last_accessed: new Date(),
      },
    });

    res.json({ progress });
  })
);

// PUT /api/progress/module/:moduleId
router.put(
  '/module/:moduleId',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const { progress_percentage, time_spent_minutes } = req.body;

    const progress = await prisma.userProgress.update({
      where: {
        user_id_module_id: {
          user_id: req.user!.userId,
          module_id: req.params.moduleId,
        },
      },
      data: {
        progress_percentage,
        time_spent_minutes,
        last_accessed: new Date(),
        status: progress_percentage === 100 ? 'completed' : 'in_progress',
        completed_at: progress_percentage === 100 ? new Date() : null,
      },
    });

    res.json({ progress });
  })
);

// POST /api/progress/section/:sectionId/complete
router.post(
  '/section/:sectionId/complete',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const { notes } = req.body;

    const sectionProgress = await prisma.sectionProgress.upsert({
      where: {
        user_id_module_content_id: {
          user_id: req.user!.userId,
          module_content_id: req.params.sectionId,
        },
      },
      update: {
        completed: true,
        completed_at: new Date(),
        notes,
      },
      create: {
        user_id: req.user!.userId,
        module_content_id: req.params.sectionId,
        completed: true,
        completed_at: new Date(),
        notes,
      },
    });

    res.json({ section_progress: sectionProgress });
  })
);

// GET /api/progress/summary
router.get(
  '/summary',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const allModules = await prisma.module.findMany();
    const userProgress = await prisma.userProgress.findMany({
      where: { user_id: req.user!.userId },
    });

    const totalModules = allModules.length;
    const completedModules = userProgress.filter(p => p.status === 'completed').length;
    const totalTime = userProgress.reduce((sum, p) => sum + p.time_spent_minutes, 0);

    const phases = [1, 2, 3, 4].map(phaseNum => {
      const phaseModules = allModules.filter(m => m.phase_number === phaseNum);
      const phaseCompleted = userProgress.filter(p =>
        phaseModules.some(m => m.id === p.module_id) && p.status === 'completed'
      ).length;

      return {
        phase_number: phaseNum,
        phase_title: `Phase ${phaseNum}`,
        modules_completed: phaseCompleted,
        total_modules: phaseModules.length,
        progress_percentage: phaseModules.length > 0
          ? Math.round((phaseCompleted / phaseModules.length) * 100)
          : 0,
      };
    });

    res.json({
      phases,
      total_progress: totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0,
      time_invested: totalTime,
      modules_completed: completedModules,
      total_modules: totalModules,
    });
  })
);

export default router;

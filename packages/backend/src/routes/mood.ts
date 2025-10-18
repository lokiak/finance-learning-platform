import { Router, Response } from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import { authenticate, AuthRequest } from '../middleware/auth';
import { prisma } from '../index';

const router = Router();
router.use(authenticate);

// POST /api/mood - Log mood entry
router.post(
  '/',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const {
      overall_mood,
      financial_stress,
      energy_level,
      note,
      journaled_today = false,
      completed_module = false,
      worked_on_goal = false,
    } = req.body;

    const mood_entry = await prisma.moodEntry.create({
      data: {
        user_id: req.user!.userId,
        overall_mood,
        financial_stress,
        energy_level,
        note,
        journaled_today,
        completed_module,
        worked_on_goal,
      },
    });

    // Get recent entries to calculate trend
    const recentEntries = await prisma.moodEntry.findMany({
      where: { user_id: req.user!.userId },
      orderBy: { created_at: 'desc' },
      take: 7,
      select: { overall_mood: true },
    });

    let mood_trend: 'improving' | 'stable' | 'declining' | 'insufficient_data' = 'insufficient_data';

    if (recentEntries.length >= 3) {
      const recentAvg = recentEntries.slice(0, 3).reduce((sum, e) => sum + e.overall_mood, 0) / 3;
      const olderAvg =
        recentEntries.length >= 6
          ? recentEntries.slice(3, 6).reduce((sum, e) => sum + e.overall_mood, 0) / 3
          : recentAvg;

      if (recentAvg > olderAvg + 0.3) {
        mood_trend = 'improving';
      } else if (recentAvg < olderAvg - 0.3) {
        mood_trend = 'declining';
      } else {
        mood_trend = 'stable';
      }
    }

    // Calculate streak (days with at least one mood entry)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const entriesGrouped = await prisma.moodEntry.groupBy({
      by: ['created_at'],
      where: { user_id: req.user!.userId },
      orderBy: { created_at: 'desc' },
    });

    let streak = 1;
    if (entriesGrouped.length > 1) {
      const dates = entriesGrouped.map((e) => {
        const d = new Date(e.created_at);
        d.setHours(0, 0, 0, 0);
        return d.getTime();
      });

      const uniqueDates = [...new Set(dates)].sort((a, b) => b - a);

      for (let i = 0; i < uniqueDates.length - 1; i++) {
        const dayDiff = (uniqueDates[i] - uniqueDates[i + 1]) / (1000 * 60 * 60 * 24);
        if (dayDiff === 1) {
          streak++;
        } else {
          break;
        }
      }
    }

    res.status(201).json({
      mood_entry,
      streak,
      mood_trend,
    });
  })
);

// GET /api/mood/history - Get mood history
router.get(
  '/history',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const { days = 30 } = req.query;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days as string));

    const entries = await prisma.moodEntry.findMany({
      where: {
        user_id: req.user!.userId,
        created_at: { gte: startDate },
      },
      orderBy: { created_at: 'asc' },
      select: {
        created_at: true,
        overall_mood: true,
        financial_stress: true,
        energy_level: true,
      },
    });

    // Calculate analytics
    const moods = entries.map((e) => e.overall_mood);
    const stresses = entries.map((e) => e.financial_stress);

    const average_mood = moods.length > 0 ? moods.reduce((a, b) => a + b, 0) / moods.length : 0;

    const average_stress = stresses.length > 0 ? stresses.reduce((a, b) => a + b, 0) / stresses.length : 0;

    let trend: 'improving' | 'stable' | 'declining' | 'insufficient_data' = 'insufficient_data';
    if (entries.length >= 6) {
      const recentMoods = moods.slice(-3);
      const olderMoods = moods.slice(-6, -3);
      const recentAvg = recentMoods.reduce((a, b) => a + b, 0) / recentMoods.length;
      const olderAvg = olderMoods.reduce((a, b) => a + b, 0) / olderMoods.length;

      if (recentAvg > olderAvg + 0.3) {
        trend = 'improving';
      } else if (recentAvg < olderAvg - 0.3) {
        trend = 'declining';
      } else {
        trend = 'stable';
      }
    }

    // Find best and worst days
    const sortedByMood = [...entries].sort((a, b) => b.overall_mood - a.overall_mood);
    const best_day = sortedByMood.length > 0 ? sortedByMood[0].created_at.toISOString().split('T')[0] : null;
    const worst_day = sortedByMood.length > 0 ? sortedByMood[sortedByMood.length - 1].created_at.toISOString().split('T')[0] : null;

    // Correlation analysis
    const entriesWithContext = await prisma.moodEntry.findMany({
      where: {
        user_id: req.user!.userId,
        created_at: { gte: startDate },
      },
      select: {
        overall_mood: true,
        journaled_today: true,
        completed_module: true,
        worked_on_goal: true,
      },
    });

    const withJournaling = entriesWithContext.filter((e) => e.journaled_today);
    const withoutJournaling = entriesWithContext.filter((e) => !e.journaled_today);

    const journaling_helps =
      withJournaling.length > 0 && withoutJournaling.length > 0
        ? withJournaling.reduce((sum, e) => sum + e.overall_mood, 0) / withJournaling.length >
          withoutJournaling.reduce((sum, e) => sum + e.overall_mood, 0) / withoutJournaling.length
        : false;

    const withModule = entriesWithContext.filter((e) => e.completed_module);
    const withoutModule = entriesWithContext.filter((e) => !e.completed_module);

    const module_completion_boosts =
      withModule.length > 0 && withoutModule.length > 0
        ? withModule.reduce((sum, e) => sum + e.overall_mood, 0) / withModule.length >
          withoutModule.reduce((sum, e) => sum + e.overall_mood, 0) / withoutModule.length
        : false;

    const withGoal = entriesWithContext.filter((e) => e.worked_on_goal);
    const withoutGoal = entriesWithContext.filter((e) => !e.worked_on_goal);

    const goal_work_improves =
      withGoal.length > 0 && withoutGoal.length > 0
        ? withGoal.reduce((sum, e) => sum + e.overall_mood, 0) / withGoal.length >
          withoutGoal.reduce((sum, e) => sum + e.overall_mood, 0) / withoutGoal.length
        : false;

    const analytics = {
      average_mood,
      average_stress,
      trend,
      best_day,
      worst_day,
      correlations: {
        journaling_helps,
        module_completion_boosts,
        goal_work_improves,
      },
    };

    res.json({
      entries: entries.map((e) => ({
        date: e.created_at.toISOString().split('T')[0],
        overall_mood: e.overall_mood,
        financial_stress: e.financial_stress,
        energy_level: e.energy_level,
      })),
      analytics,
    });
  })
);

// GET /api/mood/insights - Get AI-powered insights
router.get(
  '/insights',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user!.userId;

    // Get recent mood entries
    const recentEntries = await prisma.moodEntry.findMany({
      where: { user_id: userId },
      orderBy: { created_at: 'desc' },
      take: 14,
    });

    const insights = [];
    const recommendations = [];

    if (recentEntries.length >= 3) {
      const recentMoods = recentEntries.slice(0, 3).map((e) => e.overall_mood);
      const avgMood = recentMoods.reduce((a, b) => a + b, 0) / recentMoods.length;

      // Low mood alert
      if (avgMood < 2.5) {
        insights.push({
          type: 'alert',
          message: 'Your mood has been lower than usual. Consider taking a break or trying a breathing exercise.',
          confidence: 0.8,
        });

        recommendations.push({
          action: 'breathing',
          message: 'Try a 5-minute breathing exercise to help reduce stress',
          priority: 10,
        });
      }

      // Journaling correlation
      const withJournal = recentEntries.filter((e) => e.journaled_today);
      if (withJournal.length > 0 && withJournal.length < recentEntries.length) {
        const journalAvg = withJournal.reduce((sum, e) => sum + e.overall_mood, 0) / withJournal.length;
        const noJournalAvg =
          recentEntries
            .filter((e) => !e.journaled_today)
            .reduce((sum, e) => sum + e.overall_mood, 0) /
          (recentEntries.length - withJournal.length);

        if (journalAvg > noJournalAvg + 0.5) {
          insights.push({
            type: 'correlation',
            message: 'Journaling appears to improve your mood significantly.',
            confidence: 0.75,
            data: { mood_increase: (journalAvg - noJournalAvg).toFixed(1) },
          });

          recommendations.push({
            action: 'journal',
            message: 'Journaling seems to help your mood - try writing today!',
            priority: 8,
          });
        }
      }

      // Improvement trend
      if (recentEntries.length >= 7) {
        const olderMoods = recentEntries.slice(3, 7).map((e) => e.overall_mood);
        const olderAvg = olderMoods.reduce((a, b) => a + b, 0) / olderMoods.length;

        if (avgMood > olderAvg + 0.5) {
          insights.push({
            type: 'improvement',
            message: 'Your mood is trending upward - great progress!',
            confidence: 0.9,
          });
        }
      }
    }

    // Default recommendations
    if (recommendations.length === 0) {
      recommendations.push({
        action: 'journal',
        message: 'Reflect on your financial journey today',
        priority: 5,
      });
    }

    res.json({
      insights,
      recommendations,
    });
  })
);

export default router;

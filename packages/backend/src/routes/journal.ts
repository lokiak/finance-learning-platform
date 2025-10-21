import { Router, Response } from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import { authenticate, AuthRequest } from '../middleware/auth';
import { prisma } from '../index';
import { EntryType } from '@finance-platform/shared';

const router = Router();
router.use(authenticate);

// GET /api/journal - List journal entries with filters
router.get(
  '/',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const {
      entry_type,
      limit = 20,
      offset = 0,
      sort = 'newest',
      mood,
      stress_level,
      tags,
      date_from,
      date_to,
      module_id,
      goal_id,
      search,
    } = req.query;

    const where: any = {
      user_id: req.user!.userId,
      deleted_at: null,
    };

    if (entry_type && entry_type !== 'all') {
      where.entry_type = entry_type;
    }

    if (mood) {
      where.mood = parseInt(mood as string);
    }

    if (stress_level) {
      where.stress_level = parseInt(stress_level as string);
    }

    if (tags) {
      const tagArray = Array.isArray(tags) ? tags : [tags];
      where.tags = { hasSome: tagArray };
    }

    if (date_from || date_to) {
      where.created_at = {};
      if (date_from) where.created_at.gte = new Date(date_from as string);
      if (date_to) where.created_at.lte = new Date(date_to as string);
    }

    if (module_id) {
      where.module_id = module_id;
    }

    if (goal_id) {
      where.goal_id = goal_id;
    }

    if (search) {
      where.OR = [
        { title: { contains: search as string, mode: 'insensitive' } },
        // Note: JSON content search would require more complex query
      ];
    }

    let orderBy: any = {};
    switch (sort) {
      case 'oldest':
        orderBy = { created_at: 'asc' };
        break;
      case 'most_edited':
        orderBy = { updated_at: 'desc' };
        break;
      case 'favorites':
        orderBy = { is_favorite: 'desc', created_at: 'desc' };
        break;
      default:
        orderBy = { created_at: 'desc' };
    }

    const [entries, total] = await Promise.all([
      prisma.journalEntry.findMany({
        where,
        orderBy,
        take: parseInt(limit as string),
        skip: parseInt(offset as string),
        include: {
          module: {
            select: { id: true, title: true },
          },
          goal: {
            select: { id: true, title: true, current_progress: true },
          },
          prompt: {
            select: { id: true, prompt_text: true, category: true },
          },
        },
      }),
      prisma.journalEntry.count({ where }),
    ]);

    return res.json({
      entries,
      pagination: {
        total,
        limit: parseInt(limit as string),
        offset: parseInt(offset as string),
        has_more: total > parseInt(offset as string) + entries.length,
      },
    });
  })
);

// GET /api/journal/stats - Get journaling statistics
router.get(
  '/stats',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user!.userId;

    const [allEntries, streak, moodData] = await Promise.all([
      prisma.journalEntry.findMany({
        where: { user_id: userId, deleted_at: null },
        select: {
          entry_type: true,
          word_count: true,
          tags: true,
          mood: true,
          created_at: true,
        },
        orderBy: { created_at: 'desc' },
      }),
      prisma.journalingStreak.findUnique({
        where: { user_id: userId },
      }),
      prisma.journalEntry.aggregate({
        where: { user_id: userId, deleted_at: null, mood: { not: null } },
        _avg: { mood: true },
      }),
    ]);

    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const entries_by_type: Record<string, number> = {};
    for (const type of Object.values(EntryType)) {
      entries_by_type[type] = allEntries.filter((e) => e.entry_type === type).length;
    }

    const totalWordCount = allEntries.reduce((sum, e) => sum + e.word_count, 0);
    const entriesThisWeek = allEntries.filter((e) => new Date(e.created_at) >= oneWeekAgo).length;
    const entriesThisMonth = allEntries.filter((e) => new Date(e.created_at) >= oneMonthAgo).length;

    // Get favorite tags (top 5)
    const tagCounts: Record<string, number> = {};
    allEntries.forEach((entry) => {
      entry.tags.forEach((tag) => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });
    const favorite_tags = Object.entries(tagCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([tag]) => tag);

    return res.json({
      total_entries: allEntries.length,
      word_count_total: totalWordCount,
      current_streak: streak?.current_streak || 0,
      longest_streak: streak?.longest_streak || 0,
      entries_by_type,
      mood_average: moodData._avg.mood,
      entries_this_week: entriesThisWeek,
      entries_this_month: entriesThisMonth,
      favorite_tags,
    });
  })
);

// GET /api/journal/prompts/today - Get today's personalized prompt
router.get(
  '/prompts/today',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user!.userId;

    // Get user's recent mood data (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const [recentMoods, recentEntries] = await Promise.all([
      prisma.moodEntry.findMany({
        where: {
          user_id: userId,
          created_at: { gte: sevenDaysAgo },
        },
        orderBy: { created_at: 'desc' },
        take: 7,
      }),
      prisma.journalEntry.findMany({
        where: {
          user_id: userId,
          deleted_at: null,
          created_at: { gte: sevenDaysAgo },
        },
        select: { prompt_id: true, mood: true },
      }),
    ]);

    // Calculate average mood
    const avgMood =
      recentMoods.length > 0
        ? recentMoods.reduce((sum: number, m: { overall_mood: number }) => sum + m.overall_mood, 0) /
          recentMoods.length
        : 3; // Default to neutral

    // Get prompt IDs to exclude (recently used)
    const usedPromptIds = recentEntries
      .map((e: { prompt_id: string | null }) => e.prompt_id)
      .filter((id: string | null): id is string => id !== null);

    // Select category based on mood
    let categoryPreference: string | undefined;
    if (avgMood <= 2) {
      // Low mood: gratitude, reflection, challenges
      const categories = ['gratitude', 'reflection', 'challenges'];
      categoryPreference = categories[Math.floor(Math.random() * categories.length)];
    } else if (avgMood >= 4) {
      // High mood: goal_setting, future_vision, celebration
      const categories = ['goal_setting', 'future_vision', 'celebration'];
      categoryPreference = categories[Math.floor(Math.random() * categories.length)];
    } else {
      // Neutral: money_mindset, reflection
      const categories = ['money_mindset', 'reflection'];
      categoryPreference = categories[Math.floor(Math.random() * categories.length)];
    }

    // Find a prompt
    const where: any = {
      is_active: true,
      category: categoryPreference,
    };

    // Exclude recently used prompts
    if (usedPromptIds.length > 0) {
      where.id = { notIn: usedPromptIds };
    }

    let prompt = await prisma.journalPrompt.findFirst({
      where,
      orderBy: [{ priority: 'desc' }, { created_at: 'desc' }],
    });

    // If no prompt found with preferences, get any active prompt
    if (!prompt) {
      prompt = await prisma.journalPrompt.findFirst({
        where: {
          is_active: true,
          ...(usedPromptIds.length > 0 && { id: { notIn: usedPromptIds } }),
        },
        orderBy: [{ priority: 'desc' }, { created_at: 'desc' }],
      });
    }

    // If still no prompt, get any prompt
    if (!prompt) {
      prompt = await prisma.journalPrompt.findFirst({
        where: { is_active: true },
        orderBy: [{ priority: 'desc' }, { created_at: 'desc' }],
      });
    }

    if (!prompt) {
      return res.status(404).json({ error: 'No prompts available' });
    }

    // Add personalization context
    const promptWithContext = {
      ...prompt,
      trigger_reason:
        avgMood <= 2
          ? "We noticed you've been feeling stressed. This prompt can help you reflect and find clarity."
          : avgMood >= 4
          ? "You've been feeling great! Let's harness that positive energy."
          : undefined,
    };

    return res.json({ prompt: promptWithContext });
  })
);

// GET /api/journal/prompts - Get journal prompts (today's or suggested)
router.get(
  '/prompts',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const { category, trigger_type, limit = 5 } = req.query;

    const where: any = { is_active: true };

    if (category) {
      where.category = category;
    }

    if (trigger_type) {
      where.trigger_type = trigger_type;
    }

    const prompts = await prisma.journalPrompt.findMany({
      where,
      orderBy: [{ priority: 'desc' }, { created_at: 'desc' }],
      take: parseInt(limit as string),
    });

    // TODO: Implement personalization logic based on user data
    return res.json({ prompts });
  })
);

// GET /api/journal/:id - Get single journal entry
router.get(
  '/:id',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const entry = await prisma.journalEntry.findFirst({
      where: {
        id: req.params.id,
        user_id: req.user!.userId,
        deleted_at: null,
      },
      include: {
        module: {
          select: { id: true, title: true },
        },
        goal: {
          select: { id: true, title: true, current_progress: true },
        },
        prompt: {
          select: { id: true, prompt_text: true, category: true },
        },
      },
    });

    if (!entry) {
      return res.status(404).json({ error: 'Journal entry not found' });
    }

    return res.json({ entry });
  })
);

// POST /api/journal - Create new journal entry
router.post(
  '/',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const {
      entry_type,
      title,
      content,
      mood,
      stress_level,
      energy_level,
      word_count,
      tags = [],
      module_id,
      goal_id,
      prompt_id,
      is_favorite = false,
      is_private = true,
    } = req.body;

    const userId = req.user!.userId;

    // Create the journal entry
    const entry = await prisma.journalEntry.create({
      data: {
        user_id: userId,
        entry_type,
        title,
        content,
        mood,
        stress_level,
        energy_level,
        word_count,
        tags,
        module_id,
        goal_id,
        prompt_id,
        is_favorite,
        is_private,
      },
    });

    // Update or create streak
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get existing streak if it exists
    const existingStreak = await prisma.journalingStreak.findUnique({
      where: { user_id: userId },
    });

    let streakUpdate;
    if (existingStreak) {
      const lastEntry = existingStreak.last_entry_date ? new Date(existingStreak.last_entry_date) : null;
      let newStreak = 1;
      let streakStarted = today;

      if (lastEntry) {
        lastEntry.setHours(0, 0, 0, 0);
        const daysDiff = Math.floor((today.getTime() - lastEntry.getTime()) / (1000 * 60 * 60 * 24));

        if (daysDiff === 0) {
          // Same day, maintain streak
          newStreak = existingStreak.current_streak || 1;
          streakStarted = existingStreak.streak_started || today;
        } else if (daysDiff === 1) {
          // Consecutive day
          newStreak = (existingStreak.current_streak || 0) + 1;
          streakStarted = existingStreak.streak_started || today;
        } else {
          // Streak broken
          newStreak = 1;
          streakStarted = today;
        }
      }

      streakUpdate = {
        current_streak: newStreak,
        longest_streak: Math.max(newStreak, existingStreak.longest_streak || 0),
        total_entries: (existingStreak.total_entries || 0) + 1,
        last_entry_date: today,
        streak_started: streakStarted,
      };
    }

    const streak = await prisma.journalingStreak.upsert({
      where: { user_id: userId },
      create: {
        user_id: userId,
        current_streak: 1,
        longest_streak: 1,
        total_entries: 1,
        last_entry_date: today,
        streak_started: today,
      },
      update: streakUpdate || {},
    });

    res.status(201).json({
      entry,
      streak: {
        current: streak.current_streak,
        longest: streak.longest_streak,
      },
    });
  })
);

// PUT /api/journal/:id - Update journal entry
router.put(
  '/:id',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const { title, content, mood, stress_level, energy_level, word_count, tags, is_favorite, is_private } = req.body;

    const entry = await prisma.journalEntry.updateMany({
      where: {
        id: req.params.id,
        user_id: req.user!.userId,
        deleted_at: null,
      },
      data: {
        title,
        content,
        mood,
        stress_level,
        energy_level,
        word_count,
        tags,
        is_favorite,
        is_private,
      },
    });

    if (entry.count === 0) {
      return res.status(404).json({ error: 'Journal entry not found' });
    }

    const updatedEntry = await prisma.journalEntry.findUnique({
      where: { id: req.params.id },
    });

    return res.json({ entry: updatedEntry });
  })
);

// DELETE /api/journal/:id - Soft delete journal entry
router.delete(
  '/:id',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const entry = await prisma.journalEntry.updateMany({
      where: {
        id: req.params.id,
        user_id: req.user!.userId,
        deleted_at: null,
      },
      data: {
        deleted_at: new Date(),
      },
    });

    if (entry.count === 0) {
      return res.status(404).json({ error: 'Journal entry not found' });
    }

    return res.json({ success: true });
  })
);

export default router;

import { prisma } from '../index';
import { ErrorCodes, ErrorMessages, UpdateProfileRequest } from '@finance-platform/shared';
import { AppError } from '../middleware/errorHandler';

export class UserService {
  static async getProfile(userId: string) {
    const profile = await prisma.userProfile.findUnique({
      where: { user_id: userId },
    });

    if (!profile) {
      throw new AppError(
        ErrorCodes.RESOURCE_NOT_FOUND,
        'Profile not found',
        404
      );
    }

    return profile;
  }

  static async updateProfile(userId: string, data: UpdateProfileRequest) {
    const profile = await prisma.userProfile.update({
      where: { user_id: userId },
      data: {
        ...data,
        updated_at: new Date(),
      },
    });

    // Update user profile_completed flag if relevant fields are filled
    if (data.age && data.current_income && data.risk_tolerance) {
      await prisma.user.update({
        where: { id: userId },
        data: { profile_completed: true },
      });
    }

    return profile;
  }

  static async getDashboard Data(userId: string) {
    // Get user progress summary
    const allProgress = await prisma.userProgress.findMany({
      where: { user_id: userId },
      include: { module: true },
    });

    const totalModules = await prisma.module.count();
    const completedModules = allProgress.filter(p => p.status === 'completed').length;
    const totalTimeInvested = allProgress.reduce((sum, p) => sum + p.time_spent_minutes, 0);

    // Get recent achievements
    const recentAchievements = await prisma.achievement.findMany({
      where: { user_id: userId },
      orderBy: { earned_at: 'desc' },
      take: 5,
    });

    // Get active goals
    const activeGoals = await prisma.userGoal.findMany({
      where: { user_id: userId, status: 'active' },
      take: 3,
    });

    // Determine current phase
    let currentPhase = 1;
    for (let phase = 1; phase <= 4; phase++) {
      const phaseModules = await prisma.module.findMany({
        where: { phase_number: phase },
      });
      const phaseProgress = await prisma.userProgress.findMany({
        where: {
          user_id: userId,
          module_id: { in: phaseModules.map(m => m.id) },
          status: 'completed',
        },
      });
      if (phaseProgress.length < phaseModules.length) {
        currentPhase = phase;
        break;
      }
      if (phase === 4 && phaseProgress.length === phaseModules.length) {
        currentPhase = 4;
      }
    }

    return {
      overview: {
        total_progress: totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0,
        modules_completed: completedModules,
        total_modules: totalModules,
        time_invested: totalTimeInvested,
        current_phase: currentPhase,
      },
      recent_activity: allProgress
        .sort((a, b) => (b.last_accessed?.getTime() || 0) - (a.last_accessed?.getTime() || 0))
        .slice(0, 5)
        .map(p => ({
          type: p.status === 'completed' ? 'module_completed' : 'module_started' as const,
          title: p.module.title,
          timestamp: p.last_accessed || p.created_at,
          module_id: p.module_id,
        })),
      next_steps: [], // Will be populated by logic
      achievements: recentAchievements.map(a => ({
        id: a.id,
        title: a.title,
        description: a.description || '',
        earned_at: a.earned_at,
      })),
    };
  }
}

import { prisma } from '../index';
import {
  StressPrediction,
  OptimalLearningTime,
  EngagementPrediction,
  SuccessProbability,
} from '@finance-platform/shared';

export class PredictiveWellnessService {
  /**
   * Predict stress level for a user entering a module
   */
  static async predictStress(
    userId: string,
    moduleId?: string
  ): Promise<StressPrediction> {
    // Get recent mood entries to determine trend
    const recentMoods = await prisma.moodEntry.findMany({
      where: { user_id: userId },
      orderBy: { created_at: 'desc' },
      take: 7, // Last 7 days
    });

    // Calculate mood trend
    let moodTrend: 'improving' | 'stable' | 'declining' = 'stable';
    if (recentMoods.length >= 3) {
      const recent = recentMoods.slice(0, 3).reduce((sum: number, m: any) => sum + m.overall_mood, 0) / 3;
      const older = recentMoods.slice(3, 6).reduce((sum: number, m: any) => sum + m.overall_mood, 0) / 3;
      if (recent > older + 0.5) moodTrend = 'improving';
      else if (recent < older - 0.5) moodTrend = 'declining';
      else moodTrend = 'stable';
    }

    // Get current stress level
    const currentMood = recentMoods[0];
    const currentStress = currentMood?.financial_stress || 5;

    // Get recent learning performance
    const recentPerformance = await (prisma as any).learningPerformance.findMany({
      where: { user_id: userId },
      orderBy: { created_at: 'desc' },
      take: 5,
    });

    // Calculate time since last break (simplified - would track session start)
    const lastBreakTime = recentPerformance.length > 0
      ? Math.floor((Date.now() - recentPerformance[0].created_at.getTime()) / 1000 / 60)
      : 0;

    // Get module difficulty if provided
    let moduleDifficulty = 5; // Default
    if (moduleId) {
      const module = await prisma.module.findUnique({
        where: { id: moduleId },
      });
      // Estimate difficulty based on phase (higher phase = more difficult)
      moduleDifficulty = module ? module.phase_number * 2 : 5;
    }

    // Calculate predicted stress level (rule-based)
    let predictedStress = currentStress;
    let confidence = 0.5;

    // Factor adjustments
    if (moduleDifficulty > 7) predictedStress += 2;
    if (moodTrend === 'declining') predictedStress += 1.5;
    if (lastBreakTime > 45) predictedStress += 1;
    if (recentPerformance.some((p: any) => p.completion_status === 'abandoned')) predictedStress += 1;

    predictedStress = Math.min(10, Math.max(1, Math.round(predictedStress)));

    // Increase confidence with more data
    if (recentMoods.length >= 3 && recentPerformance.length >= 2) {
      confidence = 0.75;
    }

    // Generate recommendations
    const recommendations = {
      suggest_break: predictedStress > 6 || lastBreakTime > 45,
      simplify_content: predictedStress > 7 || moduleDifficulty > 8,
      add_encouragement: predictedStress > 5 || moodTrend === 'declining',
      recommend_breathing: predictedStress > 7,
    };

    // Save prediction
    await (prisma as any).stressPrediction.create({
      data: {
        user_id: userId,
        module_id: moduleId || null,
        predicted_stress_level: predictedStress,
        confidence: confidence,
        factors: {
          module_difficulty: moduleDifficulty,
          recent_mood_trend: moodTrend,
          time_since_last_break: lastBreakTime,
          consecutive_learning_time: lastBreakTime,
          upcoming_challenging_content: moduleDifficulty > 7,
        },
        recommendations: recommendations,
      },
    });

    return {
      predicted_stress_level: predictedStress,
      confidence: confidence,
      factors: {
        module_difficulty: moduleDifficulty,
        recent_mood_trend: moodTrend,
        time_since_last_break: lastBreakTime,
        consecutive_learning_time: lastBreakTime,
        upcoming_challenging_content: moduleDifficulty > 7,
      },
      recommendations: recommendations,
    };
  }

  /**
   * Detect optimal learning time for user
   */
  static async detectOptimalTime(userId: string): Promise<OptimalLearningTime> {
    // Get user's learning performance history
    const performances = await (prisma as any).learningPerformance.findMany({
      where: { user_id: userId },
      orderBy: { created_at: 'desc' },
      take: 50,
    });

    // Analyze best times (simplified - would analyze completion rates by hour/day)
    const now = new Date();
    const currentHour = now.getHours();
    const dayOfWeek = now.toLocaleDateString('en-US', { weekday: 'long' });

    // Get current mood and energy
    const recentMood = await prisma.moodEntry.findFirst({
      where: { user_id: userId },
      orderBy: { created_at: 'desc' },
    });

    const moodLevel = recentMood?.overall_mood || 3;
    const energyLevel = recentMood?.energy_level || 3;

    // Determine readiness (rule-based)
    let currentReadiness: 'optimal' | 'good' | 'moderate' | 'poor' = 'moderate';

    // Optimal conditions
    if (moodLevel >= 4 && energyLevel >= 4 && currentHour >= 9 && currentHour <= 17) {
      currentReadiness = 'optimal';
    } else if (moodLevel >= 3 && energyLevel >= 3) {
      currentReadiness = 'good';
    } else if (moodLevel >= 2 && energyLevel >= 2) {
      currentReadiness = 'moderate';
    } else {
      currentReadiness = 'poor';
    }

    // Generate recommendations
    const recommendations = {
      start_learning: currentReadiness === 'optimal' || currentReadiness === 'good',
      wait_time: currentReadiness === 'poor' ? 30 : currentReadiness === 'moderate' ? 10 : 0,
      suggested_activity: currentReadiness === 'optimal'
        ? 'Start a new module'
        : currentReadiness === 'good'
        ? 'Consider a 10-minute warm-up activity'
        : currentReadiness === 'moderate'
        ? 'Do a quick mood check-in first'
        : 'Consider journaling or taking a break',
    };

    return {
      current_readiness: currentReadiness,
      factors: {
        time_of_day: `${currentHour}:00`,
        day_of_week: dayOfWeek,
        mood_level: moodLevel,
        energy_level: energyLevel,
        recent_activity: performances.length > 0 ? 'completed_module' : 'none',
      },
      recommendations: recommendations,
    };
  }

  /**
   * Predict engagement drop-off risk
   */
  static async predictEngagement(userId: string): Promise<EngagementPrediction> {
    // Get current session data (simplified - would track actual session)
    const recentPerformance = await (prisma as any).learningPerformance.findMany({
      where: { user_id: userId },
      orderBy: { created_at: 'desc' },
      take: 10,
    });

    // Calculate session length (estimate based on recent activity)
    const sessionStart = recentPerformance[recentPerformance.length - 1]?.created_at || new Date();
    const sessionLength = Math.floor((Date.now() - sessionStart.getTime()) / 1000 / 60);

    // Check for recent abandonment
    const recentAbandonment = recentPerformance.some(
      (p: any) => p.completion_status === 'abandoned'
    );

    // Get current module difficulty
    const currentModuleId = recentPerformance[0]?.module_id;
    let currentModuleDifficulty = 5;
    if (currentModuleId) {
      const module = await prisma.module.findUnique({
        where: { id: currentModuleId },
      });
      currentModuleDifficulty = module ? module.phase_number * 2 : 5;
    }

    // Calculate time since last progress
    const timeSinceLastProgress = recentPerformance.length > 0
      ? Math.floor((Date.now() - recentPerformance[0].created_at.getTime()) / 1000 / 60)
      : 0;

    // Get current stress level
    const recentMood = await prisma.moodEntry.findFirst({
      where: { user_id: userId },
      orderBy: { created_at: 'desc' },
    });
    const stressLevel = recentMood?.financial_stress || 5;

    // Calculate drop-off risk
    let dropOffRisk: 'low' | 'medium' | 'high' = 'low';
    let confidence = 0.5;

    if (
      sessionLength > 60 ||
      recentAbandonment ||
      currentModuleDifficulty > 8 ||
      timeSinceLastProgress > 20 ||
      stressLevel > 7
    ) {
      dropOffRisk = 'high';
      confidence = 0.8;
    } else if (
      sessionLength > 45 ||
      currentModuleDifficulty > 6 ||
      timeSinceLastProgress > 10 ||
      stressLevel > 5
    ) {
      dropOffRisk = 'medium';
      confidence = 0.65;
    }

    // Generate interventions
    const interventions = {
      encouragement: dropOffRisk === 'high'
        ? 'You\'re doing great! Take a moment to appreciate your progress.'
        : dropOffRisk === 'medium'
        ? 'Keep going! You\'re making good progress.'
        : 'You\'re on track!',
      simplify_next_content: dropOffRisk === 'high' && currentModuleDifficulty > 7,
      suggest_alternative: dropOffRisk === 'high' ? 'Consider trying an easier module first' : '',
      celebrate_progress: dropOffRisk !== 'low',
    };

    return {
      drop_off_risk: dropOffRisk,
      confidence: confidence,
      indicators: {
        session_length: sessionLength,
        recent_abandonment: recentAbandonment,
        current_module_difficulty: currentModuleDifficulty,
        time_since_last_progress: timeSinceLastProgress,
        stress_level: stressLevel,
      },
      interventions: interventions,
    };
  }

  /**
   * Model success probability for completing a module
   */
  static async modelSuccess(
    userId: string,
    moduleId: string
  ): Promise<SuccessProbability> {
    const module = await prisma.module.findUnique({
      where: { id: moduleId },
    });

    if (!module) {
      throw new Error('Module not found');
    }

    // Check prerequisite mastery
    let prerequisiteMastery = 100; // Default if no prerequisites
    if (module.prerequisites.length > 0) {
      // Simplified - would check actual concept mastery
      const prerequisiteProgress = await prisma.userProgress.findMany({
        where: {
          user_id: userId,
          module_id: { in: module.prerequisites },
          status: 'completed',
        },
      });
      prerequisiteMastery = module.prerequisites.length > 0
        ? (prerequisiteProgress.length / module.prerequisites.length) * 100
        : 100;
    }

    // Get current mood and stress
    const recentMood = await prisma.moodEntry.findFirst({
      where: { user_id: userId },
      orderBy: { created_at: 'desc' },
    });
    const currentMood = recentMood?.overall_mood || 3;
    const stressLevel = recentMood?.financial_stress || 5;

    // Estimate time available (simplified - would track user patterns)
    const timeAvailable = 45; // Default estimate

    // Check historical completion rate for similar modules
    const similarModules = await prisma.userProgress.findMany({
      where: {
        user_id: userId,
        module: {
          phase_number: module.phase_number,
        },
      },
    });
    const historicalSimilarModules = similarModules.length > 0
      ? similarModules.filter(p => p.status === 'completed').length / similarModules.length
      : 0.7; // Default 70% completion rate

    // Calculate completion probability (rule-based)
    let completionProbability = 0.5; // Base probability

    // Factor adjustments
    if (prerequisiteMastery >= 85) completionProbability += 0.2;
    if (currentMood >= 4 && stressLevel <= 5) completionProbability += 0.15;
    if (timeAvailable >= 30) completionProbability += 0.1;
    if (historicalSimilarModules >= 0.8) completionProbability += 0.15;

    completionProbability = Math.min(1, Math.max(0, completionProbability));

    // Generate recommendations
    const recommendations = {
      proceed: completionProbability >= 0.5,
      preparation_steps: [] as string[],
      optimal_conditions: [] as string[],
    };

    if (prerequisiteMastery < 85) {
      recommendations.preparation_steps.push('Review prerequisite modules');
    }
    if (currentMood < 4) {
      recommendations.preparation_steps.push('Wait for better mood');
      recommendations.optimal_conditions.push('Better mood');
    }
    if (stressLevel > 5) {
      recommendations.preparation_steps.push('Reduce stress first');
      recommendations.optimal_conditions.push('Lower stress level');
    }
    if (timeAvailable < 30) {
      recommendations.preparation_steps.push('Ensure adequate time available');
      recommendations.optimal_conditions.push('More time available');
    }

    return {
      module_id: moduleId,
      completion_probability: completionProbability,
      factors: {
        prerequisite_mastery: prerequisiteMastery,
        current_mood: currentMood,
        time_available: timeAvailable,
        historical_similar_modules: historicalSimilarModules,
        stress_level: stressLevel,
      },
      recommendations: recommendations,
    };
  }
}


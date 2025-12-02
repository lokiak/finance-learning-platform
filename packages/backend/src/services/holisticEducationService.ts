import { prisma } from '../index';
import {
  EmotionalLearningState,
  BehavioralPatterns,
  PracticalApplication,
  ModuleConnections,
} from '@finance-platform/shared';

export class HolisticEducationService {
  /**
   * Integrate emotional state with learning context
   */
  static async integrateEmotionalState(
    userId: string,
    _moduleId?: string
  ): Promise<EmotionalLearningState> {
    // Get current mood entry
    const recentMood = await prisma.moodEntry.findFirst({
      where: { user_id: userId },
      orderBy: { created_at: 'desc' },
    });

    const currentMood = recentMood?.overall_mood || 3;
    const stressLevel = recentMood?.financial_stress || 5;
    const energyLevel = recentMood?.energy_level || 3;

    // Determine learning readiness
    let learningReadiness: 'optimal' | 'moderate' | 'low' | 'overwhelmed' = 'moderate';

    if (currentMood >= 4 && stressLevel <= 4 && energyLevel >= 3) {
      learningReadiness = 'optimal';
    } else if (currentMood < 2 && stressLevel > 8) {
      learningReadiness = 'overwhelmed';
    } else if (currentMood < 3 || stressLevel > 6 || energyLevel < 2) {
      learningReadiness = 'low';
    }

    // Generate adaptations based on emotional state
    const adaptations = {
      content_pacing: stressLevel > 7 ? 'gentle' as const :
                      learningReadiness === 'optimal' ? 'challenging' as const : 'normal' as const,
      support_level: stressLevel > 7 || learningReadiness === 'overwhelmed' ? 'high' as const :
                     learningReadiness === 'low' ? 'medium' as const : 'low' as const,
      break_suggestions: stressLevel > 6 || learningReadiness === 'overwhelmed',
      encouragement_frequency: stressLevel > 7 ? 3 : stressLevel > 5 ? 2 : 1,
    };

    return {
      current_mood: currentMood,
      stress_level: stressLevel,
      energy_level: energyLevel,
      learning_readiness: learningReadiness,
      adaptations: adaptations,
    };
  }

  /**
   * Analyze behavioral patterns
   */
  static async analyzeBehavioralPatterns(userId: string): Promise<BehavioralPatterns> {
    // Get learning performance history
    const performances = await (prisma as any).learningPerformance.findMany({
      where: { user_id: userId },
      orderBy: { created_at: 'desc' },
      take: 50,
    });

    // Analyze preferred time of day (simplified)
    const preferredTimeOfDay = performances.length > 0
      ? new Date(performances[0].created_at).getHours() >= 12 ? 'afternoon' : 'morning'
      : 'morning';

    // Calculate average session length
    const sessionLength = performances.length > 0
      ? performances.reduce((sum: number, p: any) => sum + p.time_spent_seconds, 0) / performances.length / 60
      : 30;

    // Analyze break frequency (simplified)
    const breakFrequency = performances.length > 5 ? 2 : 1;

    // Determine review behavior
    const reviewBehavior: 'immediate' | 'delayed' | 'spaced' =
      performances.some((p: any) => p.content_reviewed > 1) ? 'immediate' :
      performances.some((p: any) => p.content_reviewed === 1) ? 'delayed' : 'spaced';

    // Get module completion rate
    const userProgress = await prisma.userProgress.findMany({
      where: { user_id: userId },
    });
    const moduleCompletionRate = userProgress.length > 0
      ? userProgress.filter((p: any) => p.status === 'completed').length / userProgress.length
      : 0;

    // Get calculator usage
    const calculatorUsage = await prisma.calculatorData.count({
      where: { user_id: userId },
    });

    // Get journaling frequency
    const journalingFrequency = await prisma.journalEntry.count({
      where: { user_id: userId },
    });

    // Get goal update frequency
    const goalUpdateFrequency = await prisma.userGoal.count({
      where: { user_id: userId },
    });

    // Identify struggle indicators
    const abandonedModules = userProgress
      .filter((p: any) => p.status === 'in_progress' && p.progress_percentage < 50)
      .map((p: any) => p.module_id);

    const repeatedSections = performances
      .filter((p: any) => p.content_reviewed > 2)
      .map((p: any) => p.section_id)
      .filter((id: any): id is string => !!id);

    const lowScores = performances
      .filter((p: any) => p.assessment_score !== null && Number(p.assessment_score) < 60)
      .map((p: any) => p.id);

    return {
      learning_habits: {
        preferred_time_of_day: preferredTimeOfDay,
        session_length: Math.round(sessionLength),
        break_frequency: breakFrequency,
        review_behavior: reviewBehavior,
      },
      engagement_patterns: {
        module_completion_rate: moduleCompletionRate,
        calculator_usage: calculatorUsage,
        journaling_frequency: journalingFrequency,
        goal_update_frequency: goalUpdateFrequency,
      },
      struggle_indicators: {
        module_abandonment: abandonedModules,
        long_pauses: performances.filter((p: any) => p.time_spent_seconds > 600).length,
        repeated_section_visits: repeatedSections,
        low_assessment_scores: lowScores,
      },
    };
  }

  /**
   * Link module to real-world application
   */
  static async linkRealWorldApplication(
    userId: string,
    moduleId: string
  ): Promise<PracticalApplication> {
    const module = await prisma.module.findUnique({
      where: { id: moduleId },
    });

    if (!module) {
      throw new Error('Module not found');
    }

    // Get user profile
    const userProfile = await prisma.userProfile.findUnique({
      where: { user_id: userId },
    });

    // Get user goals
    const userGoals = await prisma.userGoal.findMany({
      where: {
        user_id: userId,
        status: 'active',
      },
    });

    // Generate real-world connections based on module
    const realWorldConnections = {
      personal_finance: [] as string[],
      current_goals: userGoals.map(g => g.title),
      life_stage: [] as string[],
    };

    // Module-specific connections (simplified - would be more sophisticated)
    if (module.title.toLowerCase().includes('budget')) {
      if (userProfile?.current_income) {
        realWorldConnections.personal_finance.push(`Your current income: $${userProfile.current_income}`);
      }
    }

    // Generate action items
    const actionItems = {
      immediate: [
        'Review the key concepts from this module',
        'Identify one way to apply this to your situation',
      ],
      this_week: [
        'Try applying one concept from this module',
        'Reflect on how this connects to your goals',
      ],
      this_month: [
        'Implement what you learned',
        'Track your progress',
      ],
    };

    // Get relevant calculators
    const relevantCalculators: string[] = [];
    if (module.title.toLowerCase().includes('budget')) {
      relevantCalculators.push('budget_tracker');
    }
    if (module.title.toLowerCase().includes('debt')) {
      relevantCalculators.push('debt_payoff');
    }
    if (module.title.toLowerCase().includes('retirement')) {
      relevantCalculators.push('retirement_calculator');
    }

    return {
      module_id: moduleId,
      real_world_connections: realWorldConnections,
      action_items: actionItems,
      calculator_integration: {
        relevant_calculators: relevantCalculators,
        suggested_scenarios: [],
      },
    };
  }

  /**
   * Find connections between modules
   */
  static async findConnections(
    _userId: string,
    moduleId: string
  ): Promise<ModuleConnections> {
    const module = await prisma.module.findUnique({
      where: { id: moduleId },
    });

    if (!module) {
      throw new Error('Module not found');
    }

    // Get all modules
    const allModules = await prisma.module.findMany({
      orderBy: [
        { phase_number: 'asc' },
        { order_index: 'asc' },
      ],
    });

    // Find prerequisites
    const prerequisites = module.prerequisites.map(prereqId => {
      const prereqModule = allModules.find(m => m.id === prereqId);
      return prereqModule ? prereqModule.id : prereqId;
    }).filter(Boolean);

    // Find modules that build on this one
    const buildsOn = allModules
      .filter(m => m.prerequisites.includes(moduleId))
      .map(m => m.id);

    // Find modules this prepares for (same phase or next phase)
    const preparesFor = allModules
      .filter(m => m.phase_number === module.phase_number + 1 ||
                   (m.phase_number === module.phase_number && m.order_index > module.order_index))
      .slice(0, 3)
      .map(m => m.id);

    // Find reinforcing modules (similar topics)
    const reinforces = allModules
      .filter(m => m.id !== moduleId &&
                   (m.title.toLowerCase().includes(module.title.toLowerCase().split(' ')[0]) ||
                    module.title.toLowerCase().includes(m.title.toLowerCase().split(' ')[0])))
      .slice(0, 2)
      .map(m => m.id);

    // Build connection points
    const connectionPoints = [
      ...prerequisites.map(id => ({
        concept: 'prerequisites',
        related_module: id,
        relationship: 'prerequisite' as const,
      })),
      ...buildsOn.map(id => ({
        concept: 'builds_on',
        related_module: id,
        relationship: 'builds_on' as const,
      })),
      ...preparesFor.map(id => ({
        concept: 'prepares_for',
        related_module: id,
        relationship: 'prepares_for' as const,
      })),
      ...reinforces.map(id => ({
        concept: 'reinforces',
        related_module: id,
        relationship: 'reinforces' as const,
      })),
    ];

    return {
      current_module: moduleId,
      related_concepts: {
        prerequisite: prerequisites,
        builds_on: buildsOn,
        prepares_for: preparesFor,
        reinforces: reinforces,
      },
      connection_points: connectionPoints,
    };
  }
}


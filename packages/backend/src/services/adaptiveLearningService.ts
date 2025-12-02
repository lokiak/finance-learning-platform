import { prisma } from '../index';
import {
  LearningPerformance,
  LearningStyle,
  ConceptMastery,
  AdaptedContent,
  LearningPath,
  RemediationPath,
} from '@finance-platform/shared';

export class AdaptiveLearningService {
  /**
   * Track learning performance metrics
   */
  static async trackPerformance(
    userId: string,
    moduleId: string,
    metrics: {
      section_id?: string;
      concept_id?: string;
      time_spent_seconds: number;
      assessment_score?: number;
      error_count?: number;
      error_patterns?: string[];
      completion_status: 'completed' | 'abandoned' | 'in_progress';
      notes_taken?: boolean;
      content_reviewed?: number;
      interactive_engaged?: boolean;
    }
  ): Promise<LearningPerformance> {
    const performance = await prisma.learningPerformance.create({
      data: {
        user_id: userId,
        module_id: moduleId,
        section_id: metrics.section_id,
        concept_id: metrics.concept_id,
        time_spent_seconds: metrics.time_spent_seconds,
        attempts: 1,
        assessment_score: metrics.assessment_score,
        error_count: metrics.error_count || 0,
        error_patterns: metrics.error_patterns || [],
        completion_status: metrics.completion_status,
        notes_taken: metrics.notes_taken || false,
        content_reviewed: metrics.content_reviewed || 0,
        interactive_engaged: metrics.interactive_engaged || false,
      },
    });

    // Update user progress with performance data
    await this.updateUserProgressMetrics(userId, moduleId);

    return performance as any;
  }

  /**
   * Detect learning style based on behavioral patterns
   */
  static async detectLearningStyle(userId: string): Promise<LearningStyle> {
    // Get recent performance data
    const recentPerformances = await prisma.learningPerformance.findMany({
      where: { user_id: userId },
      orderBy: { created_at: 'desc' },
      take: 20,
    });

    // Calculate preferences based on behavior
    let visualScore = 50;
    let textualScore = 50;
    let interactiveScore = 50;
    let pacePreference: 'fast' | 'moderate' | 'thorough' = 'moderate';
    let reviewFrequency: 'high' | 'medium' | 'low' = 'medium';
    let preferredTimeOfDay: string | undefined;

    if (recentPerformances.length > 0) {
      // Analyze visual preference (time spent on visual content, skipping long text)
      const avgTimePerSection = recentPerformances.reduce((sum, p) => sum + p.time_spent_seconds, 0) / recentPerformances.length;
      const fastReaders = recentPerformances.filter(p => p.time_spent_seconds < avgTimePerSection * 0.7).length;
      visualScore = Math.min(100, 50 + (fastReaders / recentPerformances.length) * 50);

      // Analyze textual preference (notes taken, content reviewed)
      const notesTakenCount = recentPerformances.filter(p => p.notes_taken).length;
      const contentReviewedAvg = recentPerformances.reduce((sum, p) => sum + p.content_reviewed, 0) / recentPerformances.length;
      textualScore = Math.min(100, 50 + (notesTakenCount / recentPerformances.length) * 30 + Math.min(20, contentReviewedAvg * 5));

      // Analyze interactive preference (interactive engagement)
      const interactiveCount = recentPerformances.filter(p => p.interactive_engaged).length;
      interactiveScore = Math.min(100, 50 + (interactiveCount / recentPerformances.length) * 50);

      // Analyze pace preference
      const avgTime = avgTimePerSection;
      if (avgTime < 180) {
        pacePreference = 'fast';
      } else if (avgTime > 600) {
        pacePreference = 'thorough';
      }

      // Analyze review frequency
      const reviewAvg = contentReviewedAvg;
      if (reviewAvg > 2) {
        reviewFrequency = 'high';
      } else if (reviewAvg < 0.5) {
        reviewFrequency = 'low';
      }
    }

    // Get or create learning style
    const existingStyle = await prisma.learningStyle.findUnique({
      where: { user_id: userId },
    });

    const styleData = {
      visual_preference: visualScore,
      textual_preference: textualScore,
      interactive_preference: interactiveScore,
      pace_preference: pacePreference,
      review_frequency: reviewFrequency,
      preferred_time_of_day: preferredTimeOfDay,
      detection_method: 'behavioral' as const,
      confidence: recentPerformances.length > 10 ? 0.8 : 0.5,
    };

    const learningStyle = existingStyle
      ? await prisma.learningStyle.update({
          where: { user_id: userId },
          data: styleData,
        })
      : await prisma.learningStyle.create({
          data: {
            user_id: userId,
            ...styleData,
          },
        });

    return learningStyle as any;
  }

  /**
   * Adapt content based on user's learning style and performance
   */
  static async adaptContent(
    userId: string,
    moduleId: string,
    sectionId: string
  ): Promise<AdaptedContent> {
    const learningStyle = await this.detectLearningStyle(userId);

    // Get recent performance for this module
    const recentPerformance = await prisma.learningPerformance.findFirst({
      where: {
        user_id: userId,
        module_id: moduleId,
        section_id: sectionId,
      },
      orderBy: { created_at: 'desc' },
    });

    // Determine difficulty level
    let difficultyLevel: 'introductory' | 'standard' | 'advanced' | 'remedial' = 'standard';
    if (recentPerformance) {
      if (recentPerformance.assessment_score !== null) {
        if (recentPerformance.assessment_score < 60) {
          difficultyLevel = 'remedial';
        } else if (recentPerformance.assessment_score > 90) {
          difficultyLevel = 'advanced';
        }
      }
      if (recentPerformance.error_count > 3) {
        difficultyLevel = 'remedial';
      }
    }

    // Determine format preference
    let format: 'textual' | 'visual' | 'interactive' = 'textual';
    if (learningStyle.interactive_preference > 70) {
      format = 'interactive';
    } else if (learningStyle.visual_preference > 70) {
      format = 'visual';
    }

    // Get module content
    const moduleContent = await prisma.moduleContent.findUnique({
      where: { id: sectionId },
    });

    const adaptationReason = `Based on your learning style: ${format} preference (${learningStyle.interactive_preference}% interactive, ${learningStyle.visual_preference}% visual)`;

    return {
      difficulty_level: difficultyLevel,
      format: format,
      content: moduleContent?.content_data || {},
      adaptation_reason: adaptationReason,
      alternative_formats: format === 'interactive' ? ['visual', 'textual'] : format === 'visual' ? ['interactive', 'textual'] : ['interactive', 'visual'],
    };
  }

  /**
   * Calculate mastery level for a concept
   */
  static async calculateMastery(userId: string, conceptId: string): Promise<ConceptMastery> {
    // Get all performance data for this concept
    const performances = await prisma.learningPerformance.findMany({
      where: {
        user_id: userId,
        concept_id: conceptId,
      },
      orderBy: { created_at: 'asc' },
    });

    // Calculate mastery based on assessment scores
    const assessmentScores = performances
      .filter(p => p.assessment_score !== null)
      .map(p => ({
        score: Number(p.assessment_score),
        timestamp: p.created_at,
        attempts: p.attempts,
      }));

    let masteryLevel = 0;
    let status: 'not_started' | 'learning' | 'mastered' | 'needs_review' = 'not_started';

    if (assessmentScores.length > 0) {
      // Weight recent scores more heavily
      const recentScores = assessmentScores.slice(-3);
      const avgScore = recentScores.reduce((sum, s) => sum + s.score, 0) / recentScores.length;
      masteryLevel = Math.min(100, avgScore);

      if (masteryLevel >= 85) {
        status = 'mastered';
      } else if (masteryLevel >= 70) {
        status = 'learning';
      } else if (masteryLevel > 0) {
        status = 'needs_review';
      }
    }

    // Calculate spaced repetition interval
    let spacedIntervalDays = 1;
    if (status === 'mastered') {
      spacedIntervalDays = 14;
    } else if (status === 'learning') {
      spacedIntervalDays = 7;
    }

    const nextReviewDate = new Date();
    nextReviewDate.setDate(nextReviewDate.getDate() + spacedIntervalDays);

    // Get or create concept mastery
    const existingMastery = await prisma.conceptMastery.findUnique({
      where: {
        user_id_concept_id: {
          user_id: userId,
          concept_id: conceptId,
        },
      },
    });

    const masteryData = {
      mastery_level: masteryLevel,
      assessment_history: assessmentScores,
      last_assessed: assessmentScores.length > 0 ? assessmentScores[assessmentScores.length - 1].timestamp : null,
      next_review_date: nextReviewDate,
      spaced_interval_days: spacedIntervalDays,
      review_count: existingMastery ? existingMastery.review_count + 1 : 0,
      status: status,
    };

    const conceptMastery = existingMastery
      ? await prisma.conceptMastery.update({
          where: {
            user_id_concept_id: {
              user_id: userId,
              concept_id: conceptId,
            },
          },
          data: masteryData,
        })
      : await prisma.conceptMastery.create({
          data: {
            user_id: userId,
            concept_id: conceptId,
            ...masteryData,
          },
        });

    return conceptMastery as any;
  }

  /**
   * Recommend learning path based on user's progress and preferences
   */
  static async recommendPath(userId: string, currentModuleId: string): Promise<LearningPath> {
    const learningStyle = await this.detectLearningStyle(userId);
    const currentModule = await prisma.module.findUnique({
      where: { id: currentModuleId },
    });

    if (!currentModule) {
      throw new Error('Module not found');
    }

    // Get all modules ordered by phase and order_index
    const allModules = await prisma.module.findMany({
      orderBy: [
        { phase_number: 'asc' },
        { order_index: 'asc' },
      ],
    });

    const currentIndex = allModules.findIndex(m => m.id === currentModuleId);
    const recommendedNext = allModules
      .slice(currentIndex + 1, currentIndex + 3)
      .map(m => m.id);

    // Determine alternative paths based on pace preference
    const fastTrack = recommendedNext.slice(0, 1);
    const thoroughPath = recommendedNext;
    const remedialPath: string[] = []; // Would need to identify remedial modules

    // Get user's current stress level (would integrate with mood data)
    const recentMood = await prisma.moodEntry.findFirst({
      where: { user_id: userId },
      orderBy: { created_at: 'desc' },
    });

    const currentStressLevel = recentMood?.financial_stress || 5;

    return {
      current_module: currentModuleId,
      recommended_next: recommendedNext,
      prerequisites: currentModule.prerequisites,
      alternative_paths: {
        fast_track: fastTrack,
        thorough_path: thoroughPath,
        remedial_path: remedialPath,
      },
      personalization_factors: {
        learning_pace: learningStyle.pace_preference,
        preferred_format: learningStyle.interactive_preference > 70 ? 'interactive' : learningStyle.visual_preference > 70 ? 'visual' : 'text',
        current_stress_level: currentStressLevel,
        time_available: 30, // Default, would be calculated based on user patterns
      },
    };
  }

  /**
   * Get remediation path for struggling concepts
   */
  static async getRemediationPath(
    userId: string,
    conceptId: string
  ): Promise<RemediationPath> {
    const mastery = await this.calculateMastery(userId, conceptId);

    if (mastery.mastery_level >= 70) {
      throw new Error('Concept does not require remediation');
    }

    return {
      original_concept: conceptId,
      difficulty: mastery.mastery_level < 50 ? 'high' : 'medium',
      remediation_steps: [
        {
          step: 1,
          content_type: 'simplified_explanation',
          content: {},
          assessment: 'Quick understanding check',
        },
        {
          step: 2,
          content_type: 'visual_aid',
          content: {},
          assessment: 'Visual comprehension check',
        },
        {
          step: 3,
          content_type: 'interactive_exercise',
          content: {},
          assessment: 'Application assessment',
        },
      ],
      success_criteria: {
        assessment_score: 75,
        time_limit: 1800, // 30 minutes
      },
    };
  }

  /**
   * Update user progress metrics based on performance data
   */
  private static async updateUserProgressMetrics(userId: string, moduleId: string): Promise<void> {
    const performances = await prisma.learningPerformance.findMany({
      where: {
        user_id: userId,
        module_id: moduleId,
      },
    });

    if (performances.length === 0) return;

    const avgTimePerSection = performances.reduce((sum, p) => sum + p.time_spent_seconds, 0) / performances.length;
    const totalErrors = performances.reduce((sum, p) => sum + p.error_count, 0);
    const errorRate = performances.length > 0 ? (totalErrors / performances.length) * 100 : 0;
    const engagementScore = performances.filter(p => p.interactive_engaged || p.notes_taken).length / performances.length * 100;

    await prisma.userProgress.updateMany({
      where: {
        user_id: userId,
        module_id: moduleId,
      },
      data: {
        average_time_per_section: Math.round(avgTimePerSection / 60), // Convert to minutes
        error_rate: errorRate,
        engagement_score: engagementScore,
      },
    });
  }
}


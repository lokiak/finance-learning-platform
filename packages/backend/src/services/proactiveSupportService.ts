import { prisma } from '../index';
import {
  ContextualHint,
  Encouragement,
  BreakSuggestion,
  ProgressCelebration,
} from '@finance-platform/shared';

export class ProactiveSupportService {
  /**
   * Generate contextual hint based on learning context
   */
  static async generateHint(
    userId: string,
    context: {
      module_id: string;
      section_id?: string;
      condition: 'first_visit' | 'time_spent' | 'error_pattern' | 'hesitation';
      time_spent?: number;
      error_count?: number;
    }
  ): Promise<ContextualHint> {
    // Get user's learning performance for this section (unused for now, kept for future use)
    // const performance = await (prisma as any).learningPerformance.findFirst({
    //   where: {
    //     user_id: userId,
    //     module_id: context.module_id,
    //     section_id: context.section_id || undefined,
    //   },
    //   orderBy: { created_at: 'desc' },
    // });

    let hintType: 'explanation' | 'tip' | 'example' | 'common_mistake' = 'tip';
    let content = '';
    let timing: 'immediate' | 'after_attempt' | 'on_hover' | 'on_hesitation' = 'immediate';

    // Generate hint based on condition
    switch (context.condition) {
      case 'first_visit':
        content = 'Welcome! Take your time reading through this section. Feel free to take notes or revisit concepts as needed.';
        hintType = 'explanation';
        timing = 'immediate';
        break;

      case 'time_spent':
        if (context.time_spent && context.time_spent > 5) {
          content = 'This section might be challenging. Consider breaking it into smaller parts or reviewing the key concepts.';
          hintType = 'tip';
          timing = 'after_attempt';
        }
        break;

      case 'error_pattern':
        if (context.error_count && context.error_count >= 2) {
          content = 'Common mistake: Make sure to double-check your calculations and review the concept before proceeding.';
          hintType = 'common_mistake';
          timing = 'after_attempt';
        }
        break;

      case 'hesitation':
        content = 'Try interacting with the elements on the page. Click buttons or explore the content to continue.';
        hintType = 'tip';
        timing = 'on_hesitation';
        break;
    }

    // Create intervention record
    await (prisma as any).learningIntervention.create({
      data: {
        user_id: userId,
        intervention_type: 'hint',
        module_id: context.module_id,
        section_id: context.section_id,
        trigger_reason: context.condition,
        trigger_conditions: context,
        content: {
          type: hintType,
          content: content,
          visual_aid: false,
          interactive: false,
        },
      },
    });

    return {
      trigger: {
        location: context.section_id || context.module_id,
        condition: context.condition,
        threshold: context.time_spent || context.error_count || 0,
      },
      hint: {
        type: hintType,
        content: content,
        visual_aid: false,
        interactive: false,
      },
      timing: timing,
    };
  }

  /**
   * Trigger encouragement at critical moments
   */
  static async triggerEncouragement(
    userId: string,
    moment: {
      moment_type: 'struggling' | 'progressing' | 'stuck' | 'breakthrough' | 'milestone';
      module_id?: string;
      progress_percentage?: number;
      recent_achievements?: string[];
    }
  ): Promise<Encouragement> {
    // Get user info for personalization (unused for now, kept for future use)
    // const user = await prisma.user.findUnique({
    //   where: { id: userId },
    // });

    let messageType: 'acknowledgment' | 'motivation' | 'perspective' | 'celebration' = 'motivation';
    let messageContent = '';

    // Generate encouragement based on moment
    switch (moment.moment_type) {
      case 'struggling':
        messageContent = 'This is challenging, and that\'s okay. You\'re building important skills that will serve you well.';
        messageType = 'perspective';
        break;

      case 'progressing':
        messageContent = `You're making great progress${moment.progress_percentage ? ` - ${moment.progress_percentage}% complete` : ''}! Keep going.`;
        messageType = 'motivation';
        break;

      case 'stuck':
        messageContent = 'Take a breath. Sometimes stepping away helps clarity. You\'ve got this.';
        messageType = 'perspective';
        break;

      case 'breakthrough':
        messageContent = 'Excellent! You\'ve got this concept now. Well done!';
        messageType = 'celebration';
        break;

      case 'milestone':
        messageContent = `Amazing work${moment.module_id ? ' completing this module' : ''}! You're building real financial knowledge.`;
        messageType = 'celebration';
        break;
    }

    // Create intervention record
    await (prisma as any).learningIntervention.create({
      data: {
        user_id: userId,
        intervention_type: 'encouragement',
        module_id: moment.module_id,
        trigger_reason: moment.moment_type,
        trigger_conditions: moment,
        content: {
          type: messageType,
          content: messageContent,
          personalization: {
            use_name: true,
            reference_progress: !!moment.progress_percentage,
            reference_goals: false,
          },
        },
      },
    });

    return {
      trigger: {
        moment: moment.moment_type,
        conditions: moment,
      },
      message: {
        type: messageType,
        content: messageContent,
        personalization: {
          use_name: true,
          reference_progress: !!moment.progress_percentage,
          reference_goals: false,
        },
      },
      action: {
        suggest_break: moment.moment_type === 'stuck' || moment.moment_type === 'struggling',
        offer_help: moment.moment_type === 'stuck',
        celebrate: moment.moment_type === 'breakthrough' || moment.moment_type === 'milestone',
      },
    };
  }

  /**
   * Suggest break based on learning patterns
   */
  static async suggestBreak(userId: string): Promise<BreakSuggestion> {
    // Get recent learning performance
    const recentPerformance = await (prisma as any).learningPerformance.findMany({
      where: { user_id: userId },
      orderBy: { created_at: 'desc' },
      take: 10,
    });

    // Estimate learning time (simplified)
    const learningTime = recentPerformance.length > 0
      ? Math.floor((Date.now() - recentPerformance[recentPerformance.length - 1].created_at.getTime()) / 1000 / 60)
      : 0;

    // Get current stress level
    const recentMood = await prisma.moodEntry.findFirst({
      where: { user_id: userId },
      orderBy: { created_at: 'desc' },
    });
    const stressLevel = recentMood?.financial_stress || 5;

    // Determine break type and duration
    let breakType: 'short' | 'medium' | 'long' = 'short';
    let duration = 5;
    const activities: string[] = [];

    if (learningTime >= 90 || stressLevel >= 8) {
      breakType = 'long';
      duration = 30;
      activities.push('Take a longer break', 'Go for a walk', 'Do some journaling', 'Practice breathing exercises');
    } else if (learningTime >= 60 || stressLevel >= 6) {
      breakType = 'medium';
      duration = 15;
      activities.push('Take a short walk', 'Do some stretching', 'Quick mood check-in', 'Get some water');
    } else if (learningTime >= 25) {
      breakType = 'short';
      duration = 5;
      activities.push('Take a few deep breaths', 'Stretch your legs', 'Quick mood check-in');
    }

    // Create intervention record
    await (prisma as any).learningIntervention.create({
      data: {
        user_id: userId,
        intervention_type: 'break',
        trigger_reason: `Learning time: ${learningTime} minutes, Stress: ${stressLevel}`,
        trigger_conditions: {
          learning_time: learningTime,
          stress_level: stressLevel,
        },
        content: {
          break_type: breakType,
          duration: duration,
          activities: activities,
        },
      },
    });

    return {
      trigger: {
        learning_time: learningTime,
        stress_level: stressLevel,
        consecutive_modules: recentPerformance.filter((p: any) => p.completion_status === 'completed').length,
        time_of_day: new Date().toLocaleTimeString(),
      },
      suggestion: {
        break_type: breakType,
        duration: duration,
        activities: activities,
        return_reminder: true,
      },
    };
  }

  /**
   * Celebrate user progress and achievements
   */
  static async celebrateProgress(
    userId: string,
    achievement: {
      achievement_type: 'section_complete' | 'module_complete' | 'phase_complete' | 'streak' | 'mastery';
      module_id?: string;
      module_title?: string;
      significance?: 'micro' | 'minor' | 'major' | 'milestone';
    }
  ): Promise<ProgressCelebration> {
    const significance = achievement.significance ||
      (achievement.achievement_type === 'module_complete' ? 'minor' :
       achievement.achievement_type === 'phase_complete' ? 'major' :
       achievement.achievement_type === 'streak' ? 'milestone' : 'micro');

    let celebrationType: 'acknowledgment' | 'animation' | 'badge' | 'summary' = 'acknowledgment';
    let message = '';
    let visual: 'subtle' | 'moderate' | 'enthusiastic' = 'subtle';

    switch (achievement.achievement_type) {
      case 'section_complete':
        message = 'Section complete! Great work.';
        visual = 'subtle';
        break;
      case 'module_complete':
        message = `Congratulations! You've completed ${achievement.module_title || 'this module'}.`;
        celebrationType = 'summary';
        visual = 'moderate';
        break;
      case 'phase_complete':
        message = 'Amazing! You\'ve completed an entire phase. This is a major milestone!';
        celebrationType = 'badge';
        visual = 'enthusiastic';
        break;
      case 'streak':
        message = 'Incredible! You\'re building a strong learning habit.';
        celebrationType = 'badge';
        visual = 'enthusiastic';
        break;
      case 'mastery':
        message = 'Mastery achieved! You\'ve truly mastered this concept.';
        celebrationType = 'summary';
        visual = 'moderate';
        break;
    }

    // Create intervention record
    await (prisma as any).learningIntervention.create({
      data: {
        user_id: userId,
        intervention_type: 'celebration',
        module_id: achievement.module_id,
        trigger_reason: achievement.achievement_type,
        trigger_conditions: achievement,
        content: {
          type: celebrationType,
          message: message,
          visual: visual,
          shareable: significance === 'major' || significance === 'milestone',
        },
      },
    });

    return {
      trigger: {
        achievement: achievement.achievement_type,
        significance: significance,
      },
      celebration: {
        type: celebrationType,
        message: message,
        visual: visual,
        shareable: significance === 'major' || significance === 'milestone',
      },
    };
  }
}

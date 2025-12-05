import { prisma } from '../index';

export interface AdminAnalytics {
  overview: {
    totalUsers: number;
    activeUsers: number;
    totalModules: number;
    completedModules: number;
    averageCompletionRate: number;
  };
  predictions: {
    stressPredictionAccuracy: {
      totalPredictions: number;
      predictionsWithOutcomes: number;
      averageAccuracy: number;
      accuracyByLevel: Array<{ level: number; accuracy: number; count: number }>;
    };
    engagementPredictions: {
      totalPredictions: number;
      averageConfidence: number;
    };
  };
  adaptations: {
    learningStyleDetection: {
      totalDetections: number;
      detectionConfidence: {
        average: number;
        distribution: Array<{ range: string; count: number }>;
      };
    };
    masteryImprovements: {
      totalConcepts: number;
      averageMasteryGain: number;
      masteryDistribution: Array<{ range: string; count: number }>;
    };
    adaptivePathUsage: {
      fast: number;
      standard: number;
      thorough: number;
      remedial: number;
    };
  };
  support: {
    hints: {
      totalGenerated: number;
      displayed: number;
      acknowledged: number;
      helpful: number;
      notHelpful: number;
      effectivenessRate: number;
    };
    encouragements: {
      totalGenerated: number;
      displayed: number;
      acknowledged: number;
    };
    breaks: {
      totalSuggested: number;
      taken: number;
      takenRate: number;
    };
    celebrations: {
      totalGenerated: number;
      displayed: number;
    };
  };
  engagement: {
    averageSessionLength: number;
    averageTimePerModule: number;
    dropOffPoints: Array<{ moduleId: string; moduleTitle: string; dropOffRate: number }>;
    completionRates: Array<{ moduleId: string; moduleTitle: string; completionRate: number }>;
  };
  reflection: {
    totalProcesses: number;
    completedProcesses: number;
    completionRate: number;
    averageStepsCompleted: number;
    processesByStep: Array<{ step: number; count: number }>;
  };
  performance: {
    averageAssessmentScore: number;
    averageTimeSpent: number;
    errorRate: number;
    engagementScore: number;
  };
}

export class AdminAnalyticsService {
  static async getAnalytics(): Promise<AdminAnalytics> {
    const [
      overview,
      predictions,
      adaptations,
      support,
      engagement,
      reflection,
      performance,
    ] = await Promise.all([
      this.getOverview(),
      this.getPredictions(),
      this.getAdaptations(),
      this.getSupport(),
      this.getEngagement(),
      this.getReflection(),
      this.getPerformance(),
    ]);

    return {
      overview,
      predictions,
      adaptations,
      support,
      engagement,
      reflection,
      performance,
    };
  }

  private static async getOverview() {
    // Optimize: Use single query with select count for better performance
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const [totalUsers, activeUsers, totalModules, progressData] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({
        where: {
          last_login: {
            gte: thirtyDaysAgo,
          },
        },
      }),
      prisma.module.count(),
      prisma.userProgress.groupBy({
        by: ['status'],
        _count: true,
      }),
    ]);

    const completedModules = progressData.find((p) => p.status === 'completed')?._count || 0;
    const totalProgress = progressData.reduce((sum, p) => sum + p._count, 0);
    const averageCompletionRate =
      totalProgress > 0 ? (completedModules / totalProgress) * 100 : 0;

    return {
      totalUsers,
      activeUsers,
      totalModules,
      completedModules,
      averageCompletionRate: Math.round(averageCompletionRate * 100) / 100,
    };
  }

  private static async getPredictions() {
    const stressPredictions = await (prisma as any).stressPrediction.findMany({
      where: {
        actual_stress_level: { not: null },
      },
    });

    const totalPredictions = await (prisma as any).stressPrediction.count();
    const predictionsWithOutcomes = stressPredictions.length;

    let totalAccuracy = 0;
    const accuracyByLevel: Record<number, { accuracy: number; count: number }> = {};

    stressPredictions.forEach((pred: any) => {
      if (pred.actual_stress_level && pred.prediction_accuracy) {
        totalAccuracy += Number(pred.prediction_accuracy);
        const level = pred.predicted_stress_level;
        if (!accuracyByLevel[level]) {
          accuracyByLevel[level] = { accuracy: 0, count: 0 };
        }
        accuracyByLevel[level].accuracy += Number(pred.prediction_accuracy);
        accuracyByLevel[level].count += 1;
      }
    });

    // Calculate averages
    const averageAccuracy =
      predictionsWithOutcomes > 0 ? (totalAccuracy / predictionsWithOutcomes) * 100 : 0;

    const accuracyByLevelArray = Object.entries(accuracyByLevel).map(([level, data]) => ({
      level: parseInt(level),
      accuracy: Math.round((data.accuracy / data.count) * 100 * 100) / 100,
      count: data.count,
    }));

    return {
      stressPredictionAccuracy: {
        totalPredictions,
        predictionsWithOutcomes,
        averageAccuracy: Math.round(averageAccuracy * 100) / 100,
        accuracyByLevel: accuracyByLevelArray,
      },
      engagementPredictions: {
        totalPredictions: 0, // Not tracked yet
        averageConfidence: 0,
      },
    };
  }

  private static async getAdaptations() {
    const learningStyles = await (prisma as any).learningStyle.findMany();
    const totalDetections = learningStyles.length;

    let totalConfidence = 0;
    const confidenceDistribution: Record<string, number> = {
      '0-0.5': 0,
      '0.5-0.7': 0,
      '0.7-0.9': 0,
      '0.9-1.0': 0,
    };

    learningStyles.forEach((ls: any) => {
      const confidence = Number(ls.confidence);
      totalConfidence += confidence;
      if (confidence < 0.5) confidenceDistribution['0-0.5']++;
      else if (confidence < 0.7) confidenceDistribution['0.5-0.7']++;
      else if (confidence < 0.9) confidenceDistribution['0.7-0.9']++;
      else confidenceDistribution['0.9-1.0']++;
    });

    const averageConfidence = totalDetections > 0 ? totalConfidence / totalDetections : 0;

    const conceptMasteries = await (prisma as any).conceptMastery.findMany();
    const totalConcepts = conceptMasteries.length;

    let totalMastery = 0;
    const masteryDistribution: Record<string, number> = {
      '0-25': 0,
      '25-50': 0,
      '50-75': 0,
      '75-100': 0,
    };

    conceptMasteries.forEach((cm: any) => {
      const mastery = Number(cm.mastery_level);
      totalMastery += mastery;
      if (mastery < 25) masteryDistribution['0-25']++;
      else if (mastery < 50) masteryDistribution['25-50']++;
      else if (mastery < 75) masteryDistribution['50-75']++;
      else masteryDistribution['75-100']++;
    });

    const averageMastery = totalConcepts > 0 ? totalMastery / totalConcepts : 0;

    // Type assertion needed because Prisma Client types may be stale
    // The field exists in the database schema but Prisma Client types may not reflect it yet
    const progressData = (await (prisma.userProgress.findMany({
      where: {
        adaptive_path_taken: { not: null },
      } as any,
    }) as any)) as Array<{ adaptive_path_taken: string | null }>;

    const adaptivePathUsage = {
      fast: progressData.filter((p) => p.adaptive_path_taken === 'fast').length,
      standard: progressData.filter((p) => p.adaptive_path_taken === 'standard').length,
      thorough: progressData.filter((p) => p.adaptive_path_taken === 'thorough').length,
      remedial: progressData.filter((p) => p.adaptive_path_taken === 'remedial').length,
    };

    return {
      learningStyleDetection: {
        totalDetections,
        detectionConfidence: {
          average: Math.round(averageConfidence * 100 * 100) / 100,
          distribution: Object.entries(confidenceDistribution).map(([range, count]) => ({
            range,
            count,
          })),
        },
      },
      masteryImprovements: {
        totalConcepts,
        averageMasteryGain: Math.round(averageMastery * 100) / 100,
        masteryDistribution: Object.entries(masteryDistribution).map(([range, count]) => ({
          range,
          count,
        })),
      },
      adaptivePathUsage,
    };
  }

  private static async getSupport() {
    const interventions = await (prisma as any).learningIntervention.findMany();

    const hints = interventions.filter((i: any) => i.intervention_type === 'hint');
    const encouragements = interventions.filter((i: any) => i.intervention_type === 'encouragement');
    const breaks = interventions.filter((i: any) => i.intervention_type === 'break');
    const celebrations = interventions.filter((i: any) => i.intervention_type === 'celebration');

    const hintsDisplayed = hints.filter((h: any) => h.displayed).length;
    const hintsAcknowledged = hints.filter((h: any) => h.acknowledged).length;
    const hintsHelpful = hints.filter((h: any) => h.user_response === 'helpful').length;
    const hintsNotHelpful = hints.filter((h: any) => h.user_response === 'not_helpful').length;
    const hintsTotalResponses = hintsHelpful + hintsNotHelpful;
    const hintsEffectivenessRate =
      hintsTotalResponses > 0 ? (hintsHelpful / hintsTotalResponses) * 100 : 0;

    const breaksSuggested = breaks.length;
    const breaksTaken = breaks.filter((b: any) => b.acknowledged).length;
    const breaksTakenRate = breaksSuggested > 0 ? (breaksTaken / breaksSuggested) * 100 : 0;

    return {
      hints: {
        totalGenerated: hints.length,
        displayed: hintsDisplayed,
        acknowledged: hintsAcknowledged,
        helpful: hintsHelpful,
        notHelpful: hintsNotHelpful,
        effectivenessRate: Math.round(hintsEffectivenessRate * 100) / 100,
      },
      encouragements: {
        totalGenerated: encouragements.length,
        displayed: encouragements.filter((e: any) => e.displayed).length,
        acknowledged: encouragements.filter((e: any) => e.acknowledged).length,
      },
      breaks: {
        totalSuggested: breaksSuggested,
        taken: breaksTaken,
        takenRate: Math.round(breaksTakenRate * 100) / 100,
      },
      celebrations: {
        totalGenerated: celebrations.length,
        displayed: celebrations.filter((c: any) => c.displayed).length,
      },
    };
  }

  private static async getEngagement() {
    const progressData = await prisma.userProgress.findMany({
      include: {
        module: true,
      },
    });

    const totalTimeSpent = progressData.reduce(
      (sum, p) => sum + (p.time_spent_minutes || 0),
      0
    );
    const averageTimePerModule =
      progressData.length > 0 ? totalTimeSpent / progressData.length : 0;

    // Calculate drop-off and completion rates by module
    const moduleStats: Record<
      string,
      { title: string; started: number; completed: number; dropped: number }
    > = {};

    progressData.forEach((p) => {
      if (!moduleStats[p.module_id]) {
        moduleStats[p.module_id] = {
          title: p.module.title,
          started: 0,
          completed: 0,
          dropped: 0,
        };
      }

      if (p.status === 'in_progress' || p.status === 'completed') {
        moduleStats[p.module_id].started++;
      }
      if (p.status === 'completed') {
        moduleStats[p.module_id].completed++;
      }
      if (p.status === 'in_progress' && p.last_accessed) {
        const daysSinceAccess =
          (Date.now() - p.last_accessed.getTime()) / (1000 * 60 * 60 * 24);
        if (daysSinceAccess > 7) {
          moduleStats[p.module_id].dropped++;
        }
      }
    });

    const dropOffPoints = Object.entries(moduleStats)
      .map(([moduleId, stats]) => ({
        moduleId,
        moduleTitle: stats.title,
        dropOffRate:
          stats.started > 0 ? Math.round((stats.dropped / stats.started) * 100 * 100) / 100 : 0,
      }))
      .sort((a, b) => b.dropOffRate - a.dropOffRate)
      .slice(0, 10);

    const completionRates = Object.entries(moduleStats)
      .map(([moduleId, stats]) => ({
        moduleId,
        moduleTitle: stats.title,
        completionRate:
          stats.started > 0
            ? Math.round((stats.completed / stats.started) * 100 * 100) / 100
            : 0,
      }))
      .sort((a, b) => b.completionRate - a.completionRate);

    return {
      averageSessionLength: 0, // Not tracked yet
      averageTimePerModule: Math.round(averageTimePerModule * 100) / 100,
      dropOffPoints,
      completionRates,
    };
  }

  private static async getReflection() {
    const processes = await (prisma as any).reflectiveThinkingProcess.findMany();
    const totalProcesses = processes.length;
    const completedProcesses = processes.filter((p: any) => p.completed).length;
    const completionRate =
      totalProcesses > 0 ? (completedProcesses / totalProcesses) * 100 : 0;

    let totalSteps = 0;
    const stepsByNumber: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

    processes.forEach((p: any) => {
      totalSteps += p.current_step;
      stepsByNumber[p.current_step] = (stepsByNumber[p.current_step] || 0) + 1;
    });

    const averageStepsCompleted = totalProcesses > 0 ? totalSteps / totalProcesses : 0;

    return {
      totalProcesses,
      completedProcesses,
      completionRate: Math.round(completionRate * 100) / 100,
      averageStepsCompleted: Math.round(averageStepsCompleted * 100) / 100,
      processesByStep: Object.entries(stepsByNumber).map(([step, count]) => ({
        step: parseInt(step),
        count,
      })),
    };
  }

  private static async getPerformance() {
    const performances = await (prisma as any).learningPerformance.findMany();

    let totalScore = 0;
    let totalTime = 0;
    let totalErrors = 0;
    let totalAttempts = 0;
    let totalEngagementScore = 0;
    let countWithScore = 0;
    let countWithEngagement = 0;

    performances.forEach((p: any) => {
      if (p.assessment_score) {
        totalScore += Number(p.assessment_score);
        countWithScore++;
      }
      totalTime += p.time_spent_seconds || 0;
      totalErrors += p.error_count || 0;
      totalAttempts += p.attempts || 0;
      if (p.engagement_score) {
        totalEngagementScore += Number(p.engagement_score);
        countWithEngagement++;
      }
    });

    const averageAssessmentScore =
      countWithScore > 0 ? totalScore / countWithScore : 0;
    const averageTimeSpent = performances.length > 0 ? totalTime / performances.length : 0;
    const errorRate = totalAttempts > 0 ? (totalErrors / totalAttempts) * 100 : 0;
    const engagementScore = countWithEngagement > 0 ? totalEngagementScore / countWithEngagement : 0;

    return {
      averageAssessmentScore: Math.round(averageAssessmentScore * 100) / 100,
      averageTimeSpent: Math.round(averageTimeSpent * 100) / 100,
      errorRate: Math.round(errorRate * 100) / 100,
      engagementScore: Math.round(engagementScore * 100) / 100,
    };
  }
}


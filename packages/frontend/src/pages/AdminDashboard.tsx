import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';
import Card from '@/components/shared/Card';
import Badge from '@/components/shared/Badge';
import { useToastStore } from '@/stores/toastStore';
import { useEffect } from 'react';

export default function AdminDashboard() {
  const { error: showError } = useToastStore();
  const { data: analytics, isLoading, error, refetch } = useQuery({
    queryKey: ['admin', 'analytics'],
    queryFn: () => api.getAdminAnalytics(),
    retry: 2,
    retryDelay: 1000,
  });

  useEffect(() => {
    if (error) {
      showError('Failed to load analytics. Please try again.', 7000);
    }
  }, [error, showError]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="breathing-circle mx-auto mb-4"></div>
          <p className="text-earth-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <Card>
          <div className="text-center space-y-4">
            <p className="text-red-600 font-medium">Failed to load analytics</p>
            <p className="text-earth-600 text-sm">
              {error instanceof Error ? error.message : 'An unexpected error occurred'}
            </p>
            <button
              onClick={() => refetch()}
              className="mt-4 px-4 py-2 bg-earth-600 text-white rounded-lg hover:bg-earth-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </Card>
      </div>
    );
  }

  const data = analytics?.analytics;

  if (!data) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-earth-900 mb-2">Admin Dashboard</h1>
        <p className="text-earth-600">Analytics and insights for the Educational Enhancement System</p>
      </div>

      {/* Overview Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <div className="p-4">
            <h3 className="text-sm font-medium text-earth-600 mb-1">Total Users</h3>
            <p className="text-3xl font-bold text-earth-900">{data.overview.totalUsers}</p>
            <p className="text-xs text-earth-500 mt-1">
              {data.overview.activeUsers} active (last 30 days)
            </p>
          </div>
        </Card>

        <Card>
          <div className="p-4">
            <h3 className="text-sm font-medium text-earth-600 mb-1">Modules</h3>
            <p className="text-3xl font-bold text-earth-900">{data.overview.totalModules}</p>
            <p className="text-xs text-earth-500 mt-1">
              {data.overview.completedModules} completed
            </p>
          </div>
        </Card>

        <Card>
          <div className="p-4">
            <h3 className="text-sm font-medium text-earth-600 mb-1">Completion Rate</h3>
            <p className="text-3xl font-bold text-earth-900">
              {data.overview.averageCompletionRate.toFixed(1)}%
            </p>
            <p className="text-xs text-earth-500 mt-1">Average across all modules</p>
          </div>
        </Card>

        <Card>
          <div className="p-4">
            <h3 className="text-sm font-medium text-earth-600 mb-1">Reflection Processes</h3>
            <p className="text-3xl font-bold text-earth-900">{data.reflection.totalProcesses}</p>
            <p className="text-xs text-earth-500 mt-1">
              {data.reflection.completedProcesses} completed (
              {data.reflection.completionRate.toFixed(1)}%)
            </p>
          </div>
        </Card>
      </div>

      {/* Prediction Accuracy */}
      <Card>
        <h2 className="text-xl font-bold text-earth-900 mb-4">Prediction Accuracy</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium text-earth-600 mb-2">Stress Predictions</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-earth-700">Total Predictions</span>
                <span className="font-semibold">{data.predictions.stressPredictionAccuracy.totalPredictions}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-earth-700">With Outcomes</span>
                <span className="font-semibold">
                  {data.predictions.stressPredictionAccuracy.predictionsWithOutcomes}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-earth-700">Average Accuracy</span>
                <Badge
variant={
                         data.predictions.stressPredictionAccuracy.averageAccuracy >= 75
                           ? 'success'
                           : data.predictions.stressPredictionAccuracy.averageAccuracy >= 50
                           ? 'warning'
                           : 'danger'
                       }
                >
                  {data.predictions.stressPredictionAccuracy.averageAccuracy.toFixed(1)}%
                </Badge>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium text-earth-600 mb-2">Accuracy by Stress Level</h3>
            <div className="space-y-2">
              {data.predictions.stressPredictionAccuracy.accuracyByLevel.map((level: any) => (
                <div key={level.level} className="flex justify-between items-center">
                  <span className="text-sm text-earth-700">Level {level.level}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-earth-500">({level.count})</span>
                    <span className="font-semibold">{level.accuracy.toFixed(1)}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Adaptations */}
      <Card>
        <h2 className="text-xl font-bold text-earth-900 mb-4">Adaptation Effectiveness</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h3 className="text-sm font-medium text-earth-600 mb-2">Learning Style Detection</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-earth-700">Total Detections</span>
                <span className="font-semibold">{data.adaptations.learningStyleDetection.totalDetections}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-earth-700">Avg Confidence</span>
                <Badge
                  variant={
                    data.adaptations.learningStyleDetection.detectionConfidence.average >= 0.7
                      ? 'success'
                      : data.adaptations.learningStyleDetection.detectionConfidence.average >= 0.5
                      ? 'warning'
                      : 'danger'
                  }
                >
                  {(data.adaptations.learningStyleDetection.detectionConfidence.average * 100).toFixed(1)}%
                </Badge>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium text-earth-600 mb-2">Mastery Tracking</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-earth-700">Total Concepts</span>
                <span className="font-semibold">{data.adaptations.masteryImprovements.totalConcepts}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-earth-700">Avg Mastery</span>
                <span className="font-semibold">
                  {data.adaptations.masteryImprovements.averageMasteryGain.toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium text-earth-600 mb-2">Adaptive Path Usage</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-earth-700">Fast</span>
                <span className="font-semibold">{data.adaptations.adaptivePathUsage.fast}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-earth-700">Standard</span>
                <span className="font-semibold">{data.adaptations.adaptivePathUsage.standard}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-earth-700">Thorough</span>
                <span className="font-semibold">{data.adaptations.adaptivePathUsage.thorough}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-earth-700">Remedial</span>
                <span className="font-semibold">{data.adaptations.adaptivePathUsage.remedial}</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Support Utilization */}
      <Card>
        <h2 className="text-xl font-bold text-earth-900 mb-4">Support Utilization</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <h3 className="text-sm font-medium text-earth-600 mb-2">Hints</h3>
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-earth-700">Generated</span>
                <span className="font-semibold">{data.support.hints.totalGenerated}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-earth-700">Displayed</span>
                <span className="font-semibold">{data.support.hints.displayed}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-earth-700">Helpful</span>
                <Badge variant={data.support.hints.effectivenessRate >= 60 ? 'success' : 'warning'}>
                  {data.support.hints.effectivenessRate.toFixed(1)}%
                </Badge>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium text-earth-600 mb-2">Encouragements</h3>
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-earth-700">Generated</span>
                <span className="font-semibold">{data.support.encouragements.totalGenerated}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-earth-700">Displayed</span>
                <span className="font-semibold">{data.support.encouragements.displayed}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-earth-700">Acknowledged</span>
                <span className="font-semibold">{data.support.encouragements.acknowledged}</span>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium text-earth-600 mb-2">Break Suggestions</h3>
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-earth-700">Suggested</span>
                <span className="font-semibold">{data.support.breaks.totalSuggested}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-earth-700">Taken</span>
                <span className="font-semibold">{data.support.breaks.taken}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-earth-700">Take Rate</span>
                <Badge variant={data.support.breaks.takenRate >= 50 ? 'success' : 'warning'}>
                  {data.support.breaks.takenRate.toFixed(1)}%
                </Badge>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium text-earth-600 mb-2">Celebrations</h3>
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-earth-700">Generated</span>
                <span className="font-semibold">{data.support.celebrations.totalGenerated}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-earth-700">Displayed</span>
                <span className="font-semibold">{data.support.celebrations.displayed}</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Engagement Metrics */}
      <Card>
        <h2 className="text-xl font-bold text-earth-900 mb-4">Engagement Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium text-earth-600 mb-2">Time Metrics</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-earth-700">Avg Time per Module</span>
                <span className="font-semibold">
                  {data.engagement.averageTimePerModule.toFixed(1)} min
                </span>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium text-earth-600 mb-2">Top Drop-Off Points</h3>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {data.engagement.dropOffPoints.slice(0, 5).map((point: any) => (
                <div key={point.moduleId} className="flex justify-between items-center">
                  <span className="text-sm text-earth-700 truncate flex-1">{point.moduleTitle}</span>
                  <Badge variant={point.dropOffRate >= 30 ? 'danger' : 'warning'}>
                    {point.dropOffRate.toFixed(1)}%
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Reflection Process */}
      <Card>
        <h2 className="text-xl font-bold text-earth-900 mb-4">Reflection Process</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium text-earth-600 mb-2">Completion Stats</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-earth-700">Total Processes</span>
                <span className="font-semibold">{data.reflection.totalProcesses}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-earth-700">Completed</span>
                <span className="font-semibold">{data.reflection.completedProcesses}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-earth-700">Completion Rate</span>
                <Badge
                  variant={
                    data.reflection.completionRate >= 70
                      ? 'success'
                      : data.reflection.completionRate >= 50
                      ? 'warning'
                      : 'danger'
                  }
                >
                  {data.reflection.completionRate.toFixed(1)}%
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-earth-700">Avg Steps Completed</span>
                <span className="font-semibold">
                  {data.reflection.averageStepsCompleted.toFixed(1)} / 5
                </span>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium text-earth-600 mb-2">Processes by Step</h3>
            <div className="space-y-2">
              {data.reflection.processesByStep.map((step: any) => (
                <div key={step.step} className="flex justify-between items-center">
                  <span className="text-sm text-earth-700">Step {step.step}</span>
                  <span className="font-semibold">{step.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Performance Metrics */}
      <Card>
        <h2 className="text-xl font-bold text-earth-900 mb-4">Performance Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <h3 className="text-sm font-medium text-earth-600 mb-2">Assessment Score</h3>
            <p className="text-2xl font-bold text-earth-900">
              {data.performance.averageAssessmentScore.toFixed(1)}%
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-earth-600 mb-2">Avg Time Spent</h3>
            <p className="text-2xl font-bold text-earth-900">
              {data.performance.averageTimeSpent.toFixed(0)}s
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-earth-600 mb-2">Error Rate</h3>
            <Badge
              variant={
                data.performance.errorRate <= 10
                  ? 'success'
                  : data.performance.errorRate <= 25
                  ? 'warning'
                  : 'danger'
              }
            >
              {data.performance.errorRate.toFixed(1)}%
            </Badge>
          </div>
          <div>
            <h3 className="text-sm font-medium text-earth-600 mb-2">Engagement Score</h3>
            <p className="text-2xl font-bold text-earth-900">
              {data.performance.engagementScore.toFixed(1)}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}


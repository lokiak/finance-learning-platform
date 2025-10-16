import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { api } from '@/services/api';
import Card from '@/components/shared/Card';
import Badge from '@/components/shared/Badge';
import ProgressBar from '@/components/shared/ProgressBar';
import { ModuleWithProgress } from '@finance-platform/shared';

export default function Modules() {
  const { data, isLoading } = useQuery({
    queryKey: ['modules'],
    queryFn: () => api.getModules(),
  });

  const modules = data?.modules || [];

  // Group modules by phase
  const modulesByPhase = modules.reduce((acc, module) => {
    if (!acc[module.phase_number]) {
      acc[module.phase_number] = [];
    }
    acc[module.phase_number].push(module);
    return acc;
  }, {} as Record<number, ModuleWithProgress[]>);

  const phaseInfo = {
    1: { title: 'Foundations', description: 'Build your financial foundation', color: 'primary' },
    2: { title: 'Building Wealth', description: 'Learn investment strategies', color: 'success' },
    3: { title: 'Building Assets & Major Goals', description: 'Plan for major milestones', color: 'warning' },
    4: { title: 'Long-Term Mastery', description: 'Master retirement planning', color: 'danger' },
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="success" size="sm">Completed</Badge>;
      case 'in_progress':
        return <Badge variant="info" size="sm">In Progress</Badge>;
      default:
        return <Badge variant="default" size="sm">Not Started</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <svg
            className="animate-spin h-12 w-12 text-primary-600 mx-auto mb-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <p className="text-secondary-600">Loading modules...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-secondary-900 mb-2">Learning Modules</h1>
        <p className="text-secondary-600">
          Progress through 17 comprehensive modules across 4 phases to master personal finance
        </p>
      </div>

      {/* Phases */}
      {[1, 2, 3, 4].map((phaseNumber) => {
        const phaseModules = modulesByPhase[phaseNumber] || [];
        const info = phaseInfo[phaseNumber as keyof typeof phaseInfo];
        const completedCount = phaseModules.filter(m => m.progress?.status === 'completed').length;
        const totalCount = phaseModules.length;
        const progressPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

        return (
          <div key={phaseNumber} className="space-y-4">
            {/* Phase Header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-secondary-900">
                  Phase {phaseNumber}: {info.title}
                </h2>
                <p className="text-secondary-600">{info.description}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-secondary-600 mb-1">
                  {completedCount} of {totalCount} completed
                </p>
                <div className="w-48">
                  <ProgressBar value={progressPercentage} size="sm" />
                </div>
              </div>
            </div>

            {/* Modules Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {phaseModules.map((module) => (
                <Link key={module.id} to={`/modules/${module.id}`}>
                  <Card hover className="h-full">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-xs font-medium text-secondary-500">
                            Module {module.module_number}
                          </span>
                          {module.is_locked && (
                            <svg className="w-4 h-4 text-secondary-400" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                        <h3 className="text-lg font-semibold text-secondary-900 mb-2">
                          {module.title}
                        </h3>
                      </div>
                      {module.progress && getStatusBadge(module.progress.status)}
                    </div>

                    <p className="text-sm text-secondary-600 mb-4 line-clamp-2">
                      {module.description}
                    </p>

                    <div className="space-y-3">
                      {module.progress && module.progress.status !== 'not_started' && (
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-secondary-600">Progress</span>
                            <span className="text-xs font-medium text-secondary-900">
                              {module.progress.progress_percentage}%
                            </span>
                          </div>
                          <ProgressBar
                            value={module.progress.progress_percentage}
                            size="sm"
                            color={module.progress.status === 'completed' ? 'success' : 'primary'}
                          />
                        </div>
                      )}

                      <div className="flex items-center justify-between text-xs text-secondary-500">
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {module.estimated_duration} min
                        </div>
                        {module.progress && module.progress.time_spent_minutes > 0 && (
                          <div className="flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            {module.progress.time_spent_minutes} min spent
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-secondary-200">
                      <div className="flex items-center text-sm font-medium text-primary-600">
                        {module.progress?.status === 'completed' ? (
                          <>
                            Review module
                            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </>
                        ) : module.progress?.status === 'in_progress' ? (
                          <>
                            Continue learning
                            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                          </>
                        ) : (
                          <>
                            Start module
                            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </>
                        )}
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

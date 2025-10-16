import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';
import { useAuthStore } from '@/stores/authStore';
import Card from '@/components/shared/Card';
import ProgressBar from '@/components/shared/ProgressBar';
import Badge from '@/components/shared/Badge';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

export default function Dashboard() {
  const { user } = useAuthStore();

  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: () => api.getDashboard(),
  });

  const { data: progressData } = useQuery({
    queryKey: ['progress-summary'],
    queryFn: () => api.getProgressSummary(),
  });

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
          <p className="text-secondary-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const overview = dashboardData?.overview;
  const achievements = dashboardData?.achievements || [];
  const recentActivity = dashboardData?.recent_activity || [];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold text-secondary-900 mb-2">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-secondary-600">
          Continue your journey to financial mastery
        </p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-secondary-600 mb-1">Overall Progress</p>
              <p className="text-3xl font-bold text-secondary-900">{overview?.total_progress || 0}%</p>
            </div>
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
          </div>
          <div className="mt-4">
            <ProgressBar value={overview?.total_progress || 0} size="sm" />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-secondary-600 mb-1">Modules Completed</p>
              <p className="text-3xl font-bold text-secondary-900">
                {overview?.modules_completed || 0}/{overview?.total_modules || 17}
              </p>
            </div>
            <div className="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-secondary-600 mb-1">Time Invested</p>
              <p className="text-3xl font-bold text-secondary-900">
                {Math.floor((overview?.time_invested || 0) / 60)}h {(overview?.time_invested || 0) % 60}m
              </p>
            </div>
            <div className="w-12 h-12 bg-warning-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-warning-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-secondary-600 mb-1">Current Phase</p>
              <p className="text-3xl font-bold text-secondary-900">Phase {overview?.current_phase || 1}</p>
            </div>
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Phase Progress */}
        <Card>
          <h2 className="text-xl font-bold text-secondary-900 mb-4">Progress by Phase</h2>
          <div className="space-y-4">
            {progressData?.phases.map((phase) => (
              <div key={phase.phase_number}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-secondary-900">
                      Phase {phase.phase_number}
                    </span>
                    <Badge
                      variant={
                        phase.progress_percentage === 100
                          ? 'success'
                          : phase.progress_percentage > 0
                          ? 'info'
                          : 'default'
                      }
                      size="sm"
                    >
                      {phase.modules_completed}/{phase.total_modules}
                    </Badge>
                  </div>
                  <span className="text-sm text-secondary-600">{phase.progress_percentage}%</span>
                </div>
                <ProgressBar
                  value={phase.progress_percentage}
                  color={phase.progress_percentage === 100 ? 'success' : 'primary'}
                  size="md"
                />
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-secondary-200">
            <Link
              to="/modules"
              className="text-sm font-medium text-primary-600 hover:text-primary-700 flex items-center"
            >
              View all modules
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </Card>

        {/* Recent Activity */}
        <Card>
          <h2 className="text-xl font-bold text-secondary-900 mb-4">Recent Activity</h2>
          <div className="space-y-3">
            {recentActivity.length > 0 ? (
              recentActivity.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-3 p-3 bg-secondary-50 rounded-lg"
                >
                  <div className="flex-shrink-0 mt-0.5">
                    {activity.type === 'module_completed' ? (
                      <div className="w-8 h-8 bg-success-100 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-success-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    ) : (
                      <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-secondary-900">{activity.title}</p>
                    <p className="text-xs text-secondary-500">
                      {format(new Date(activity.timestamp), 'MMM d, yyyy • h:mm a')}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <svg className="w-12 h-12 text-secondary-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <p className="text-sm text-secondary-500">No recent activity yet</p>
                <Link
                  to="/modules"
                  className="text-sm font-medium text-primary-600 hover:text-primary-700 mt-2 inline-block"
                >
                  Start learning
                </Link>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Achievements */}
      {achievements.length > 0 && (
        <Card>
          <h2 className="text-xl font-bold text-secondary-900 mb-4">Recent Achievements</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements.map((achievement) => (
              <div
                key={achievement.id}
                className="flex items-start space-x-3 p-3 bg-warning-50 border border-warning-200 rounded-lg"
              >
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-warning-100 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-warning-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-secondary-900">{achievement.title}</p>
                  <p className="text-xs text-secondary-600 mt-1">{achievement.description}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Quick Actions */}
      <Card>
        <h2 className="text-xl font-bold text-secondary-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/modules"
            className="flex items-center justify-between p-4 bg-primary-50 border border-primary-200 rounded-lg hover:bg-primary-100 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <span className="font-medium text-secondary-900">Continue Learning</span>
            </div>
            <svg className="w-5 h-5 text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>

          <Link
            to="/calculators"
            className="flex items-center justify-between p-4 bg-success-50 border border-success-200 rounded-lg hover:bg-success-100 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-success-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <span className="font-medium text-secondary-900">Use Calculators</span>
            </div>
            <svg className="w-5 h-5 text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>

          <Link
            to="/goals"
            className="flex items-center justify-between p-4 bg-warning-50 border border-warning-200 rounded-lg hover:bg-warning-100 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-warning-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <span className="font-medium text-secondary-900">Manage Goals</span>
            </div>
            <svg className="w-5 h-5 text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </Card>
    </div>
  );
}

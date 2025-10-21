import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';
import { useAuthStore } from '@/stores/authStore';
import Card from '@/components/shared/Card';
import ProgressBar from '@/components/shared/ProgressBar';
import Badge from '@/components/shared/Badge';
import { MoodSelector } from '@/components/mood';
import { SoundscapePlayer } from '@/components/soundscape';
import TodaysPrompt from '@/components/dashboard/TodaysPrompt';
import TodaysFocus from '@/components/dashboard/TodaysFocus';
import { Link } from 'react-router-dom';
import { format, subDays } from 'date-fns';
import { motion } from 'framer-motion';

export default function Dashboard() {
  const { user } = useAuthStore();
  const [showBreathingExercise, setShowBreathingExercise] = useState(false);
  const [todayMood, setTodayMood] = useState<number | null>(null);

  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: () => api.getDashboard(),
  });

  const { data: progressData } = useQuery({
    queryKey: ['progress-summary'],
    queryFn: () => api.getProgressSummary(),
  });

  const { data: journalStats } = useQuery({
    queryKey: ['journal', 'stats'],
    queryFn: () => api.getJournalStats(),
  });

  const { data: journalEntries } = useQuery({
    queryKey: ['journal', 'recent'],
    queryFn: () => api.getJournalEntries({ limit: 100 }),
  });

  const handleMoodSubmit = async (mood: number) => {
    setTodayMood(mood);
    // TODO: Implement mood submission when API method is available
    // try {
    //   await api.createMoodEntry({
    //     overall_mood: mood,
    //     financial_stress: 5, // Default, could be enhanced
    //     journaled_today: false,
    //     completed_module: false,
    //   });
    // } catch (error) {
    //   console.error('Failed to save mood:', error);
    // }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="breathing-circle mx-auto mb-4"></div>
          <p className="text-earth-600">Loading your sanctuary...</p>
        </div>
      </div>
    );
  }

  const overview = dashboardData?.overview;
  const achievements = dashboardData?.achievements || [];
  const currentDate = format(new Date(), 'EEEE, MMMM d, yyyy');

  // Calculate weekly stats
  const oneWeekAgo = subDays(new Date(), 7);
  const recentJournalEntries = journalEntries?.entries || [];
  const weeklyJournalCount = recentJournalEntries.filter(
    (entry: any) => new Date(entry.created_at) >= oneWeekAgo
  ).length;

  const weeklyStats = {
    modules_completed: (progressData as any)?.completed_count || 0,
    journal_entries: weeklyJournalCount,
    learning_streak: journalStats?.current_streak || 0,
  };

  // Find current module (first in-progress module)
  const currentModule = (progressData as any)?.progress?.find(
    (p: any) => p.status === 'in_progress'
  );

  // Determine suggested action
  let suggestedAction;
  const daysSinceLastJournal = journalStats?.current_streak === 0 ? 7 : 0;
  if (daysSinceLastJournal >= 3) {
    suggestedAction = {
      type: 'journal' as const,
      message: "You haven't journaled in a few days. Taking a moment to reflect can help clarify your thoughts and reduce stress.",
      link: '/journal/new',
    };
  } else if (!currentModule && (progressData as any)?.progress?.length === 0) {
    suggestedAction = {
      type: 'module' as const,
      message: 'Start your financial learning journey with your first module.',
      link: '/modules',
    };
  } else if (todayMood && todayMood <= 2) {
    suggestedAction = {
      type: 'breathing' as const,
      message: "You're feeling stressed. Try a 5-minute breathing exercise to calm your mind.",
      link: '#breathing',
    };
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Welcome Header with gradient */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-sage-100 via-cream-50 to-sky-100 rounded-gentle p-8 shadow-soft"
      >
        <div className="max-w-4xl">
          <p className="text-sm text-earth-600 mb-2">{currentDate}</p>
          <h1 className="text-4xl font-bold text-earth-900 mb-3">
            Welcome back, {user?.name} 🌿
          </h1>
          <p className="text-lg text-earth-700">
            Take a deep breath and focus on today's journey to financial wellness
          </p>
        </div>
      </motion.div>

      {/* Today's Focus */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
      >
        <TodaysFocus
          currentModule={currentModule}
          weeklyStats={weeklyStats}
          suggestedAction={suggestedAction}
        />
      </motion.div>

      {/* Today's Journal Prompt */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.15 }}
      >
        <TodaysPrompt />
      </motion.div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mood Check-in */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="h-full">
            <h3 className="text-xl font-semibold text-earth-900 mb-4 flex items-center gap-2">
              <span className="text-2xl">💚</span>
              How are you feeling today?
            </h3>
            <MoodSelector
              value={todayMood}
              onChange={handleMoodSubmit}
              label=""
            />
            {todayMood && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-4 p-3 bg-sage-50 rounded-soft text-sm text-earth-700"
              >
                Thank you for checking in! Your emotional wellness is just as important as your financial wellness.
              </motion.div>
            )}
          </Card>
        </motion.div>

        {/* Mindfulness Tools */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="h-full">
            <h3 className="text-xl font-semibold text-earth-900 mb-4">Mindfulness Tools</h3>
            <div className="space-y-3">
              <button
                type="button"
                onClick={() => setShowBreathingExercise(!showBreathingExercise)}
                className="w-full flex items-center justify-between p-4 bg-sky-50 border-2 border-sky-200 rounded-soft hover:bg-sky-100 transition-all duration-200"
              >
                <div className="flex items-center gap-3">
                  <span className="text-3xl">🧘</span>
                  <div className="text-left">
                    <div className="font-semibold text-earth-900">Breathing Exercise</div>
                    <div className="text-sm text-earth-600">5-minute mindful breathing</div>
                  </div>
                </div>
                <svg className="w-5 h-5 text-earth-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              <Link
                to="/journal"
                className="w-full flex items-center justify-between p-4 bg-moss-50 border-2 border-moss-200 rounded-soft hover:bg-moss-100 transition-all duration-200"
              >
                <div className="flex items-center gap-3">
                  <span className="text-3xl">📔</span>
                  <div className="text-left">
                    <div className="font-semibold text-earth-900">Journal</div>
                    <div className="text-sm text-earth-600">
                      {/* TODO: Add journal streak when API is available */}
                      0 day streak
                    </div>
                  </div>
                </div>
                <svg className="w-5 h-5 text-earth-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Progress Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-sage-50 to-white">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-sm font-medium text-earth-600 mb-1">Overall Progress</p>
                <p className="text-3xl font-bold text-sage-700">{overview?.total_progress || 0}%</p>
              </div>
              <div className="w-12 h-12 bg-sage-100 rounded-gentle flex items-center justify-center">
                <svg className="w-6 h-6 text-sage-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
            </div>
            <ProgressBar value={overview?.total_progress || 0} size="sm" color="primary" />
          </Card>

          <Card className="bg-gradient-to-br from-moss-50 to-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-earth-600 mb-1">Modules Completed</p>
                <p className="text-3xl font-bold text-moss-700">
                  {overview?.modules_completed || 0}/{overview?.total_modules || 17}
                </p>
              </div>
              <div className="w-12 h-12 bg-moss-100 rounded-gentle flex items-center justify-center">
                <svg className="w-6 h-6 text-moss-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-sky-50 to-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-earth-600 mb-1">Journal Entries</p>
                <p className="text-3xl font-bold text-sky-700">0</p>
              </div>
              <div className="w-12 h-12 bg-sky-100 rounded-gentle flex items-center justify-center">
                <svg className="w-6 h-6 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-cream-100 to-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-earth-600 mb-1">Current Streak</p>
                <p className="text-3xl font-bold text-cream-900">
                  0 days
                </p>
              </div>
              <div className="w-12 h-12 bg-cream-200 rounded-gentle flex items-center justify-center">
                <svg className="w-6 h-6 text-cream-900" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z" />
                  <path d="M13 7h-2v5.414l3.293 3.293 1.414-1.414L13 11.586z" />
                </svg>
              </div>
            </div>
          </Card>
        </div>
      </motion.div>

      {/* Soundscape Player */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card>
          <SoundscapePlayer />
        </Card>
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Journal Entries */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-earth-900">Recent Reflections</h2>
            <Link
              to="/journal"
              className="text-sm font-medium text-sage-600 hover:text-sage-700 flex items-center gap-1"
            >
              View all
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          <div className="space-y-3">

            {/* TODO: Add recent journal entries when API is available */}
            <div className="text-center py-8">
              <div className="text-5xl mb-3">📝</div>
              <p className="text-sm text-earth-600 mb-3">No journal entries yet</p>
              <Link to="/journal/new" className="btn-primary text-sm">
                Start journaling
              </Link>
            </div>
          </div>
        </Card>

        {/* Progress by Phase */}
        <Card>
          <h2 className="text-xl font-bold text-earth-900 mb-4">Learning Progress</h2>
          <div className="space-y-4">
            {progressData?.phases.map((phase: any) => (
              <div key={phase.phase_number}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-earth-900">
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
                  <span className="text-sm text-earth-600">{phase.progress_percentage}%</span>
                </div>
                <ProgressBar
                  value={phase.progress_percentage}
                  color={phase.progress_percentage === 100 ? 'success' : 'primary'}
                  size="md"
                />
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-sage-200">
            <Link
              to="/modules"
              className="text-sm font-medium text-sage-600 hover:text-sage-700 flex items-center gap-1"
            >
              Continue learning
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </Card>
      </div>

      {/* Achievements */}
      {achievements.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card>
            <h2 className="text-xl font-bold text-earth-900 mb-4 flex items-center gap-2">
              <span className="text-2xl">🏆</span>
              Recent Achievements
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {achievements.map((achievement: any) => (
                <div
                  key={achievement.id}
                  className="flex items-start space-x-3 p-4 bg-gradient-to-br from-cream-100 to-cream-50 border border-cream-300 rounded-gentle"
                >
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-cream-300 rounded-full flex items-center justify-center">
                      <span className="text-xl">⭐</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-earth-900">{achievement.title}</p>
                    <p className="text-xs text-earth-600 mt-1">{achievement.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  );
}

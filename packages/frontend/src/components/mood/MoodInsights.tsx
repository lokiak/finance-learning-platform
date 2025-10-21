import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { parseISO, getDay } from 'date-fns';
import { Link } from 'react-router-dom';

interface MoodEntry {
  created_at: string;
  overall_mood: number;
  financial_stress?: number;
  energy_level?: number;
  journaled_today?: boolean;
  completed_module?: boolean;
  worked_on_goal?: boolean;
}

interface JournalEntry {
  created_at: string;
  mood?: number | null;
}

interface MoodInsightsProps {
  moodEntries: MoodEntry[];
  journalEntries?: JournalEntry[];
  className?: string;
}

interface Insight {
  type: 'positive' | 'neutral' | 'tip';
  icon: string;
  title: string;
  description: string;
  action?: {
    text: string;
    link: string;
  };
}

const MoodInsights: React.FC<MoodInsightsProps> = ({
  moodEntries,
  journalEntries = [],
  className = '',
}) => {
  const insights = useMemo(() => {
    const calculatedInsights: Insight[] = [];

    if (moodEntries.length < 7) {
      return [
        {
          type: 'neutral' as const,
          icon: '📊',
          title: 'Building your mood history',
          description: 'Track your mood for at least 7 days to unlock personalized insights and patterns.',
          action: {
            text: 'Log Today\'s Mood',
            link: '/dashboard',
          },
        },
      ];
    }

    // 1. Day of week analysis
    const moodByDay: Record<number, number[]> = {};
    moodEntries.forEach((entry) => {
      const day = getDay(parseISO(entry.created_at));
      if (!moodByDay[day]) moodByDay[day] = [];
      moodByDay[day].push(entry.overall_mood);
    });

    const avgMoodByDay = Object.entries(moodByDay).map(([day, moods]) => ({
      day: parseInt(day),
      avg: moods.reduce((a, b) => a + b, 0) / moods.length,
    }));

    if (avgMoodByDay.length >= 3) {
      const bestDay = avgMoodByDay.reduce((a, b) => (a.avg > b.avg ? a : b));
      const worstDay = avgMoodByDay.reduce((a, b) => (a.avg < b.avg ? a : b));
      const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

      if (bestDay.avg - worstDay.avg >= 0.8) {
        calculatedInsights.push({
          type: 'positive',
          icon: '📅',
          title: `You feel best on ${dayNames[bestDay.day]}s`,
          description: `Your mood is ${((bestDay.avg / worstDay.avg - 1) * 100).toFixed(0)}% higher on ${dayNames[bestDay.day]}s compared to ${dayNames[worstDay.day]}s. Consider scheduling important tasks on your better days.`,
        });
      }
    }

    // 2. Journaling correlation
    const daysWithJournal = moodEntries.filter((e) => e.journaled_today);
    const daysWithoutJournal = moodEntries.filter((e) => !e.journaled_today);

    if (daysWithJournal.length >= 3 && daysWithoutJournal.length >= 3) {
      const avgWithJournal = daysWithJournal.reduce((sum, e) => sum + e.overall_mood, 0) / daysWithJournal.length;
      const avgWithoutJournal = daysWithoutJournal.reduce((sum, e) => sum + e.overall_mood, 0) / daysWithoutJournal.length;

      if (avgWithJournal > avgWithoutJournal) {
        const diff = ((avgWithJournal - avgWithoutJournal) / avgWithoutJournal) * 100;
        if (diff >= 10) {
          calculatedInsights.push({
            type: 'positive',
            icon: '📝',
            title: 'Journaling boosts your mood',
            description: `On days you journal, your mood is ${diff.toFixed(0)}% higher on average. Keep up the great reflection habit!`,
            action: {
              text: 'Start Journaling',
              link: '/journal/new',
            },
          });
        }
      }
    }

    // 3. Module completion correlation
    const daysWithModuleWork = moodEntries.filter((e) => e.completed_module);
    const recentModuleWork = daysWithModuleWork.slice(-5);

    if (recentModuleWork.length >= 3) {
      const avgAfterModule = recentModuleWork.reduce((sum, e) => sum + e.overall_mood, 0) / recentModuleWork.length;
      const overallAvg = moodEntries.reduce((sum, e) => sum + e.overall_mood, 0) / moodEntries.length;

      if (avgAfterModule > overallAvg) {
        calculatedInsights.push({
          type: 'positive',
          icon: '🎓',
          title: 'Learning empowers you',
          description: `Your mood improves by ${((avgAfterModule - overallAvg) / overallAvg * 100).toFixed(0)}% after completing modules. Education is your confidence builder!`,
          action: {
            text: 'Continue Learning',
            link: '/modules',
          },
        });
      }
    }

    // 4. Stress trend analysis
    const recentEntries = moodEntries.slice(-14); // Last 2 weeks
    if (recentEntries.length >= 10) {
      const firstWeek = recentEntries.slice(0, 7);
      const secondWeek = recentEntries.slice(-7);

      const firstWeekStress = firstWeek
        .filter((e) => e.financial_stress)
        .reduce((sum, e) => sum + (e.financial_stress || 0), 0) / firstWeek.filter((e) => e.financial_stress).length;

      const secondWeekStress = secondWeek
        .filter((e) => e.financial_stress)
        .reduce((sum, e) => sum + (e.financial_stress || 0), 0) / secondWeek.filter((e) => e.financial_stress).length;

      if (firstWeekStress > secondWeekStress) {
        const improvement = ((firstWeekStress - secondWeekStress) / firstWeekStress) * 100;
        if (improvement >= 15) {
          calculatedInsights.push({
            type: 'positive',
            icon: '🌱',
            title: 'Your financial stress is decreasing',
            description: `Great progress! Your financial stress has dropped ${improvement.toFixed(0)}% over the past two weeks. You're building confidence and control.`,
          });
        }
      } else if (secondWeekStress > firstWeekStress) {
        const increase = ((secondWeekStress - firstWeekStress) / firstWeekStress) * 100;
        if (increase >= 20) {
          calculatedInsights.push({
            type: 'tip',
            icon: '💙',
            title: 'Stress levels rising - let\'s pause',
            description: `We noticed your stress increased ${increase.toFixed(0)}% this week. Remember, it's okay to take breaks. Small steps still count as progress.`,
            action: {
              text: 'Try Breathing Exercise',
              link: '/dashboard', // Assuming breathing exercise is on dashboard
            },
          });
        }
      }
    }

    // 5. Consistency insight
    if (moodEntries.length >= 21) {
      calculatedInsights.push({
        type: 'positive',
        icon: '⭐',
        title: 'Building a healthy tracking habit',
        description: `You've logged ${moodEntries.length} mood check-ins! Regular self-reflection is a key part of emotional wellness and financial confidence.`,
      });
    }

    // 6. Energy-mood correlation
    const entriesWithEnergy = moodEntries.filter((e) => e.energy_level !== undefined && e.energy_level !== null);
    if (entriesWithEnergy.length >= 10) {
      const highEnergyDays = entriesWithEnergy.filter((e) => (e.energy_level || 0) >= 4);
      const lowEnergyDays = entriesWithEnergy.filter((e) => (e.energy_level || 0) <= 2);

      if (highEnergyDays.length >= 3 && lowEnergyDays.length >= 3) {
        const avgMoodHighEnergy = highEnergyDays.reduce((sum, e) => sum + e.overall_mood, 0) / highEnergyDays.length;
        const avgMoodLowEnergy = lowEnergyDays.reduce((sum, e) => sum + e.overall_mood, 0) / lowEnergyDays.length;

        if (avgMoodHighEnergy > avgMoodLowEnergy + 0.5) {
          calculatedInsights.push({
            type: 'tip',
            icon: '⚡',
            title: 'Energy impacts your mood',
            description: 'Your mood is significantly better on high-energy days. Prioritize sleep, nutrition, and movement to maintain your energy levels.',
          });
        }
      }
    }

    // Default if no insights
    if (calculatedInsights.length === 0) {
      return [
        {
          type: 'neutral' as const,
          icon: '🌿',
          title: 'Your journey is unique',
          description: 'Keep tracking your mood and we\'ll discover patterns that help you thrive. Every data point helps us understand you better.',
        },
      ];
    }

    return calculatedInsights;
  }, [moodEntries, journalEntries]);

  return (
    <div className={`card-peaceful p-6 ${className}`}>
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-earth-900 mb-1">Your Insights</h3>
        <p className="text-sm text-earth-600">Patterns and discoveries from your mood data</p>
      </div>

      <div className="space-y-4">
        {insights.map((insight, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`
              p-4 rounded-soft border-l-4
              ${insight.type === 'positive' ? 'bg-green-50 border-green-400' : ''}
              ${insight.type === 'neutral' ? 'bg-sky-50 border-sky-400' : ''}
              ${insight.type === 'tip' ? 'bg-amber-50 border-amber-400' : ''}
            `}
          >
            <div className="flex items-start gap-3">
              <span className="text-3xl">{insight.icon}</span>
              <div className="flex-1">
                <h4 className="font-semibold text-earth-900 mb-1">{insight.title}</h4>
                <p className="text-sm text-earth-700 mb-3">{insight.description}</p>
                {insight.action && (
                  <Link
                    to={insight.action.link}
                    className="inline-flex items-center text-sm font-medium text-sage-700 hover:text-sage-800"
                  >
                    {insight.action.text}
                    <svg
                      className="w-4 h-4 ml-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default MoodInsights;

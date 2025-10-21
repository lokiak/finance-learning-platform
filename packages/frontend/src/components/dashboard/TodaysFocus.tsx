import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

interface Module {
  id: string;
  title: string;
  phase_number: number;
  module_number: number;
}

interface UserProgress {
  module_id: string;
  status: string;
  completion_percentage: number;
  current_section?: number;
  total_sections?: number;
  module?: Module;
}

interface TodaysFocusProps {
  currentModule?: UserProgress;
  weeklyStats?: {
    modules_completed: number;
    journal_entries: number;
    learning_streak: number;
  };
  suggestedAction?: {
    type: 'journal' | 'module' | 'goal' | 'breathing';
    message: string;
    link: string;
  };
  className?: string;
}

const TodaysFocus: React.FC<TodaysFocusProps> = ({
  currentModule,
  weeklyStats,
  suggestedAction,
  className = '',
}) => {
  const estimatedTime = currentModule ? Math.ceil((currentModule.total_sections || 5) * 3) : 15;

  return (
    <div className={`card-peaceful p-6 ${className}`}>
      <h2 className="text-2xl font-bold text-earth-900 mb-6">Today's Focus</h2>

      {/* Primary Action - Continue Module */}
      {currentModule && currentModule.module ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-br from-sage-100 via-moss-50 to-sky-100 rounded-gentle p-6 mb-6 shadow-soft"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <p className="text-sm text-sage-700 font-medium mb-1">Continue Learning</p>
              <h3 className="text-2xl font-bold text-earth-900 mb-2">
                {currentModule.module.title}
              </h3>
              <p className="text-sm text-earth-700 mb-4">
                Phase {currentModule.module.phase_number} • Module {currentModule.module.module_number}
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex items-center justify-between text-sm text-earth-600 mb-2">
              <span>
                {currentModule.current_section || 0} of {currentModule.total_sections || 5} sections
              </span>
              <span>{currentModule.completion_percentage}% complete</span>
            </div>
            <div className="w-full bg-sage-200 rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${currentModule.completion_percentage}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="bg-sage-600 h-2 rounded-full"
              />
            </div>
          </div>

          {/* Estimated Time */}
          <div className="flex items-center gap-2 text-sm text-earth-600 mb-4">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>About {estimatedTime} minutes remaining</span>
          </div>

          {/* CTA Button */}
          <Link
            to={`/modules/${currentModule.module_id}`}
            className="btn-primary w-full justify-center text-lg py-3"
          >
            Continue Learning
            <svg
              className="w-5 h-5 ml-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </Link>
        </motion.div>
      ) : (
        /* No Active Module - Suggest Starting */
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-br from-sky-100 to-purple-100 rounded-gentle p-6 mb-6 text-center"
        >
          <span className="text-6xl mb-4 block">🎓</span>
          <h3 className="text-xl font-bold text-earth-900 mb-2">Ready to start learning?</h3>
          <p className="text-earth-700 mb-4">
            Begin your financial wellness journey with your first module
          </p>
          <Link to="/modules" className="btn-primary inline-flex items-center">
            Browse Modules
            <svg
              className="w-5 h-5 ml-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </Link>
        </motion.div>
      )}

      {/* Weekly Progress Summary */}
      {weeklyStats && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-cream-50 rounded-gentle p-4 mb-4"
        >
          <h4 className="text-sm font-semibold text-earth-900 mb-3">This Week's Progress</h4>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-sage-700">{weeklyStats.modules_completed}</p>
              <p className="text-xs text-earth-600">Modules</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-sky-700">{weeklyStats.journal_entries}</p>
              <p className="text-xs text-earth-600">Journal Entries</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-amber-700">
                {weeklyStats.learning_streak}
                {weeklyStats.learning_streak > 0 && ' 🔥'}
              </p>
              <p className="text-xs text-earth-600">Day Streak</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Suggested Action */}
      {suggestedAction && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="border-l-4 border-sage-400 bg-sage-50 rounded-soft p-4"
        >
          <div className="flex items-start gap-3">
            <span className="text-2xl">
              {suggestedAction.type === 'journal' && '📝'}
              {suggestedAction.type === 'module' && '📚'}
              {suggestedAction.type === 'goal' && '🎯'}
              {suggestedAction.type === 'breathing' && '🧘'}
            </span>
            <div className="flex-1">
              <p className="text-sm text-earth-900 font-medium mb-1">Suggested for you</p>
              <p className="text-sm text-earth-700 mb-3">{suggestedAction.message}</p>
              <Link
                to={suggestedAction.link}
                className="text-sm font-medium text-sage-700 hover:text-sage-800 inline-flex items-center"
              >
                Take action
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
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default TodaysFocus;

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTodaysPrompt, useRandomPrompt, getCategoryIcon, getCategoryName, getCategoryColor } from '@/hooks/usePrompts';
import { useNavigate } from 'react-router-dom';

// Temporary local definitions
type PromptCategory = 'money_mindset' | 'goal_setting' | 'challenges' | 'gratitude' | 'future_vision' | 'reflection' | 'celebration';

interface JournalPrompt {
  id: string;
  prompt_text: string;
  category: PromptCategory;
  subcategory?: string | null;
  personalized_text?: string;
  trigger_reason?: string;
}

interface TodaysPromptProps {
  className?: string;
}

const TodaysPrompt: React.FC<TodaysPromptProps> = ({ className = '' }) => {
  const navigate = useNavigate();
  const { data: todaysPrompt, isLoading } = useTodaysPrompt();
  const randomPromptMutation = useRandomPrompt();

  const [currentPrompt, setCurrentPrompt] = useState<JournalPrompt | null>(null);
  const [usedPromptIds, setUsedPromptIds] = useState<string[]>([]);

  // Use today's prompt as default
  React.useEffect(() => {
    if (todaysPrompt && !currentPrompt) {
      setCurrentPrompt(todaysPrompt);
      setUsedPromptIds([todaysPrompt.id]);
    }
  }, [todaysPrompt, currentPrompt]);

  const handleSurpriseMe = async () => {
    try {
      const newPrompt = await randomPromptMutation.mutateAsync({
        exclude: usedPromptIds,
      });
      if (newPrompt) {
        setCurrentPrompt(newPrompt);
        setUsedPromptIds([...usedPromptIds, newPrompt.id]);
      }
    } catch (error) {
      console.error('Failed to fetch random prompt:', error);
    }
  };

  const handleStartWriting = () => {
    if (currentPrompt) {
      navigate('/journal/new', {
        state: {
          promptId: currentPrompt.id,
          promptText: currentPrompt.personalized_text || currentPrompt.prompt_text,
        },
      });
    }
  };

  const handleViewAllPrompts = () => {
    navigate('/journal/prompts');
  };

  if (isLoading) {
    return (
      <div className={`card-peaceful p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-4 bg-sage-200 rounded w-1/3 mb-4"></div>
          <div className="h-6 bg-sage-200 rounded w-full mb-2"></div>
          <div className="h-6 bg-sage-200 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  if (!currentPrompt) {
    return (
      <div className={`card-peaceful p-6 ${className}`}>
        <div className="text-center">
          <span className="text-4xl mb-3 block">✍️</span>
          <p className="text-earth-600 mb-4">No prompt available right now</p>
          <button
            type="button"
            onClick={handleViewAllPrompts}
            className="btn-ghost"
          >
            Browse Prompts
          </button>
        </div>
      </div>
    );
  }

  const categoryIcon = getCategoryIcon(currentPrompt.category);
  const categoryName = getCategoryName(currentPrompt.category);
  const categoryColor = getCategoryColor(currentPrompt.category);
  const displayText = currentPrompt.personalized_text || currentPrompt.prompt_text;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`card-peaceful p-6 ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold text-earth-900">
            Today's Journal Prompt
          </h3>
        </div>
        <button
          type="button"
          onClick={handleSurpriseMe}
          disabled={randomPromptMutation.isPending}
          className="btn-ghost px-3 py-1 text-sm"
          title="Get a random prompt"
        >
          {randomPromptMutation.isPending ? (
            <span className="flex items-center gap-1">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Loading...
            </span>
          ) : (
            <span className="flex items-center gap-1">
              🎲 Surprise Me
            </span>
          )}
        </button>
      </div>

      {/* Prompt Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPrompt.id}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 10 }}
          transition={{ duration: 0.3 }}
        >
          {/* Category Badge */}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl">{categoryIcon}</span>
            <span
              className={`text-xs font-medium px-2 py-1 rounded-full bg-${categoryColor}-100 text-${categoryColor}-700`}
            >
              {categoryName}
            </span>
          </div>

          {/* Prompt Text */}
          <p className="text-earth-900 text-base leading-relaxed mb-4 font-medium">
            {displayText}
          </p>

          {/* Trigger Reason */}
          {currentPrompt.trigger_reason && (
            <div className="mb-4 p-3 bg-sage-50 rounded-soft border border-sage-200">
              <p className="text-sm text-sage-700">
                <span className="font-medium">Why this prompt:</span> {currentPrompt.trigger_reason}
              </p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Actions */}
      <div className="flex items-center gap-3 mt-4">
        <motion.button
          type="button"
          onClick={handleStartWriting}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="btn-primary flex-1"
        >
          <span className="flex items-center justify-center gap-2">
            <svg
              className="w-4 h-4"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Start Writing
          </span>
        </motion.button>

        <button
          type="button"
          onClick={handleViewAllPrompts}
          className="btn-ghost px-4"
        >
          Browse All
        </button>
      </div>

      {/* Footer Helper Text */}
      <p className="text-xs text-earth-500 mt-4 text-center">
        Take 5-10 minutes to reflect on this prompt
      </p>
    </motion.div>
  );
};

export default TodaysPrompt;

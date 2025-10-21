import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { getCategoryColor, getCategoryIcon, getCategoryName } from '@/hooks/usePrompts';

// Temporary local definitions until shared package import is fixed
type PromptCategory = 'money_mindset' | 'goal_setting' | 'challenges' | 'gratitude' | 'future_vision' | 'reflection' | 'celebration';

interface JournalPrompt {
  id: string;
  prompt_text: string;
  category: PromptCategory;
  subcategory?: string | null;
  personalized_text?: string;
  trigger_reason?: string;
}

interface PromptCardProps {
  prompt: JournalPrompt;
  onUse?: (prompt: JournalPrompt) => void;
  showCategory?: boolean;
  compact?: boolean;
  className?: string;
}

const PromptCard: React.FC<PromptCardProps> = ({
  prompt,
  onUse,
  showCategory = true,
  compact = false,
  className = '',
}) => {
  const navigate = useNavigate();
  const categoryColor = getCategoryColor(prompt.category);
  const categoryIcon = getCategoryIcon(prompt.category);
  const categoryName = getCategoryName(prompt.category);

  const handleUsePrompt = () => {
    if (onUse) {
      onUse(prompt);
    } else {
      // Default: navigate to journal editor with prompt
      navigate('/journal/new', {
        state: {
          promptId: prompt.id,
          promptText: prompt.personalized_text || prompt.prompt_text
        }
      });
    }
  };

  const displayText = prompt.personalized_text || prompt.prompt_text;

  if (compact) {
    return (
      <motion.button
        type="button"
        onClick={handleUsePrompt}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        className={`
          w-full text-left p-4 bg-white rounded-gentle border-2 border-sage-200
          hover:border-sage-400 hover:shadow-soft transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-sage-300
          ${className}
        `}
      >
        <div className="flex items-start gap-3">
          <span className="text-2xl flex-shrink-0">{categoryIcon}</span>
          <div className="flex-1 min-w-0">
            <p className="text-earth-900 font-medium line-clamp-2">
              {displayText}
            </p>
            {showCategory && (
              <p className="text-xs text-earth-500 mt-1">
                {categoryName}
              </p>
            )}
          </div>
          <svg
            className="w-5 h-5 text-sage-600 flex-shrink-0"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </motion.button>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`card-peaceful p-6 ${className}`}
    >
      {/* Category Badge */}
      {showCategory && (
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl">{categoryIcon}</span>
          <span
            className={`
              text-xs font-medium px-3 py-1 rounded-full
              bg-${categoryColor}-100 text-${categoryColor}-700
            `}
          >
            {categoryName}
          </span>
        </div>
      )}

      {/* Prompt Text */}
      <div className="mb-6">
        <p className="text-lg text-earth-900 leading-relaxed font-medium">
          {displayText}
        </p>
        {prompt.subcategory && (
          <p className="text-sm text-earth-600 mt-2">
            {prompt.subcategory}
          </p>
        )}
      </div>

      {/* Trigger Reason (if applicable) */}
      {prompt.trigger_reason && (
        <div className="mb-4 p-3 bg-sage-50 rounded-soft border border-sage-200">
          <p className="text-sm text-sage-700">
            <span className="font-medium">Why this prompt:</span> {prompt.trigger_reason}
          </p>
        </div>
      )}

      {/* Action Button */}
      <motion.button
        type="button"
        onClick={handleUsePrompt}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="btn-primary w-full"
      >
        <span className="flex items-center justify-center gap-2">
          <svg
            className="w-5 h-5"
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
    </motion.div>
  );
};

export default PromptCard;

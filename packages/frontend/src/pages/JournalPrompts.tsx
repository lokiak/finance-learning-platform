import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { usePrompts, getCategoryName } from '@/hooks/usePrompts';
import PromptCard from '@/components/journal/PromptCard';

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

const CATEGORIES: Array<{ value: PromptCategory | 'all'; label: string }> = [
  { value: 'all', label: 'All Prompts' },
  { value: 'money_mindset', label: 'Money Mindset' },
  { value: 'goal_setting', label: 'Goal Setting' },
  { value: 'challenges', label: 'Challenges' },
  { value: 'gratitude', label: 'Gratitude' },
  { value: 'future_vision', label: 'Future Vision' },
  { value: 'reflection', label: 'Reflection' },
  { value: 'celebration', label: 'Celebration' },
];

export default function JournalPrompts() {
  const [selectedCategory, setSelectedCategory] = useState<PromptCategory | 'all'>('all');
  const { data, isLoading, error } = usePrompts({
    category: selectedCategory,
    limit: 50,
  });

  const prompts = data?.prompts || [];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-sage-100 via-moss-50 to-sky-100 rounded-gentle p-8 shadow-soft"
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <Link
              to="/journal"
              className="inline-flex items-center gap-2 text-sage-700 hover:text-sage-800 mb-4 text-sm font-medium"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M15 19l-7-7 7-7" />
              </svg>
              Back to Journal
            </Link>
            <div className="flex items-center gap-3 mb-3">
              <span className="text-4xl">💭</span>
              <h1 className="text-4xl font-bold text-earth-900">Writing Prompts</h1>
            </div>
            <p className="text-lg text-earth-700 max-w-2xl">
              Explore thoughtful prompts to inspire your journaling practice
            </p>
          </div>
        </div>
      </motion.div>

      {/* Category Filter */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card-peaceful p-4"
      >
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-medium text-earth-700 mr-2">Filter by category:</span>
          {CATEGORIES.map((category) => (
            <button
              key={category.value}
              type="button"
              onClick={() => setSelectedCategory(category.value)}
              className={`
                px-4 py-2 rounded-soft text-sm font-medium transition-all duration-200
                ${
                  selectedCategory === category.value
                    ? 'bg-sage-600 text-white shadow-soft'
                    : 'bg-white text-earth-700 border-2 border-sage-200 hover:border-sage-400 hover:bg-sage-50'
                }
              `}
            >
              {category.label}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="breathing-circle mx-auto mb-4"></div>
            <p className="text-earth-600">Loading prompts...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="card-peaceful p-6 bg-red-50 border-red-200"
        >
          <div className="flex items-start gap-3">
            <svg
              className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h3 className="text-red-900 font-semibold mb-1">Error loading prompts</h3>
              <p className="text-red-700 text-sm">
                {error instanceof Error ? error.message : 'An unknown error occurred'}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Prompts Grid */}
      {!isLoading && !error && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {prompts.length === 0 ? (
            <div className="card-peaceful p-12 text-center">
              <span className="text-6xl mb-4 block">🔍</span>
              <h3 className="text-xl font-semibold text-earth-900 mb-2">
                No prompts found
              </h3>
              <p className="text-earth-600 mb-4">
                Try selecting a different category
              </p>
              <button
                type="button"
                onClick={() => setSelectedCategory('all')}
                className="btn-ghost"
              >
                Show All Prompts
              </button>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-earth-600">
                  Showing {prompts.length} prompt{prompts.length !== 1 ? 's' : ''}
                  {selectedCategory !== 'all' && ` in ${getCategoryName(selectedCategory)}`}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {prompts.map((prompt: JournalPrompt, index: number) => (
                  <motion.div
                    key={prompt.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <PromptCard
                      prompt={prompt}
                      compact
                      showCategory={selectedCategory === 'all'}
                    />
                  </motion.div>
                ))}
              </div>
            </>
          )}
        </motion.div>
      )}
    </div>
  );
}

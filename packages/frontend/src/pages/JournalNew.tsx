import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import JournalEntryForm from '@/components/journal/JournalEntryForm';

export default function JournalNew() {
  const navigate = useNavigate();
  const location = useLocation();
  const [initialPrompt, setInitialPrompt] = useState<{
    promptId?: string;
    promptText?: string;
  } | null>(null);

  // Get prompt from navigation state (passed from prompt cards)
  useEffect(() => {
    if (location.state) {
      const { promptId, promptText } = location.state as {
        promptId?: string;
        promptText?: string;
      };
      if (promptId || promptText) {
        setInitialPrompt({ promptId, promptText });
      }
    }
  }, [location.state]);

  const handleSaveSuccess = () => {
    // Navigate back to journal list after successful save
    navigate('/journal', {
      state: { message: 'Entry saved successfully!' }
    });
  };

  const handleCancel = () => {
    navigate('/journal');
  };

  return (
    <div className="space-y-6 pb-12 max-w-5xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <Link
            to="/journal"
            className="btn-ghost px-3 py-2"
            aria-label="Back to journal"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-earth-900">New Journal Entry</h1>
            <p className="text-sm text-earth-600 mt-1">
              Take your time and let your thoughts flow
            </p>
          </div>
        </div>
      </motion.div>

      {/* Prompt Display (if from prompt) */}
      {initialPrompt?.promptText && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="card-peaceful p-4 bg-sage-50 border-sage-200"
        >
          <div className="flex items-start gap-3">
            <span className="text-2xl">💭</span>
            <div className="flex-1">
              <p className="text-sm font-medium text-sage-700 mb-1">Writing Prompt:</p>
              <p className="text-earth-900 font-medium">{initialPrompt.promptText}</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Journal Entry Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <JournalEntryForm
          onSaveSuccess={handleSaveSuccess}
          onCancel={handleCancel}
          initialPromptId={initialPrompt?.promptId}
        />
      </motion.div>
    </div>
  );
}

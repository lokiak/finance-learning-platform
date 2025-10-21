import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';
import JournalEditor from './JournalEditor';
import { MoodSelector, StressSlider } from '@/components/mood';
import { RichTextContent } from '@finance-platform/shared';

interface JournalEntryFormProps {
  onSaveSuccess?: () => void;
  onCancel?: () => void;
  initialPromptId?: string;
  initialContent?: RichTextContent;
  initialTitle?: string;
  entryId?: string; // For editing existing entries
}

const JournalEntryForm: React.FC<JournalEntryFormProps> = ({
  onSaveSuccess,
  onCancel,
  initialPromptId,
  initialContent = null,
  initialTitle = '',
  entryId,
}) => {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState<RichTextContent | null>(initialContent);
  const [wordCount, setWordCount] = useState(0);
  const [mood, setMood] = useState<number | null>(null);
  const [stressLevel, setStressLevel] = useState<number | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      return await api.createJournalEntry(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['journal'] });
      queryClient.invalidateQueries({ queryKey: ['journal', 'stats'] });
      if (onSaveSuccess) {
        onSaveSuccess();
      }
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: any) => {
      if (!entryId) throw new Error('Entry ID required for update');
      return await api.updateJournalEntry(entryId, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['journal'] });
      queryClient.invalidateQueries({ queryKey: ['journal', entryId] });
      if (onSaveSuccess) {
        onSaveSuccess();
      }
    },
  });

  const handleContentChange = (newContent: RichTextContent, words: number) => {
    setContent(newContent);
    setWordCount(words);
  };

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim()) && tags.length < 10) {
        setTags([...tags, tagInput.trim()]);
        setTagInput('');
      }
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSave = async () => {
    if (!content) return;

    const entryData = {
      entry_type: initialPromptId ? 'prompted' : 'free_form',
      title: title || undefined,
      content,
      mood: mood || undefined,
      stress_level: stressLevel || undefined,
      word_count: wordCount,
      tags: tags.length > 0 ? tags : undefined,
      prompt_id: initialPromptId || undefined,
    };

    if (entryId) {
      await updateMutation.mutateAsync(entryData);
    } else {
      await createMutation.mutateAsync(entryData);
    }
  };

  const isSaving = createMutation.isPending || updateMutation.isPending;
  const error = createMutation.error || updateMutation.error;

  return (
    <div className="space-y-6">
      {/* Title Input */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-earth-700 mb-2">
          Title (optional)
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Give your entry a title..."
          className="w-full px-4 py-3 text-xl font-semibold bg-white border-2 border-sage-200 rounded-gentle
                     focus:border-sage-400 focus:ring-2 focus:ring-sage-100 outline-none transition-all"
        />
      </div>

      {/* Rich Text Editor */}
      <div className="card-peaceful">
        <JournalEditor
          content={content}
          onChange={handleContentChange}
          placeholder="Start writing your thoughts..."
          minHeight="400px"
        />
      </div>

      {/* Mood & Stress */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card-peaceful p-6">
          <MoodSelector
            value={mood}
            onChange={setMood}
            label="How are you feeling?"
          />
        </div>

        <div className="card-peaceful p-6">
          <StressSlider
            value={stressLevel}
            onChange={setStressLevel}
            label="Financial stress level"
          />
        </div>
      </div>

      {/* Tags */}
      <div className="card-peaceful p-6">
        <label className="block text-sm font-medium text-earth-700 mb-3">
          Tags (press Enter to add)
        </label>
        <input
          type="text"
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={handleAddTag}
          placeholder="Add tags like 'debt', 'savings', 'goals'..."
          disabled={tags.length >= 10}
          className="w-full px-4 py-2 bg-white border-2 border-sage-200 rounded-soft
                     focus:border-sage-400 focus:ring-2 focus:ring-sage-100 outline-none transition-all
                     disabled:opacity-50 disabled:cursor-not-allowed"
        />
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {tags.map((tag) => (
              <motion.span
                key={tag}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="inline-flex items-center gap-2 px-3 py-1 bg-sage-100 text-sage-700 rounded-full text-sm font-medium"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="hover:text-sage-900 transition-colors"
                  aria-label={`Remove ${tag} tag`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </motion.span>
            ))}
          </div>
        )}
        <p className="text-xs text-earth-500 mt-2">
          {tags.length}/10 tags added
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="card-peaceful p-4 bg-red-50 border-red-200"
        >
          <div className="flex items-start gap-2">
            <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm text-red-700">
              {error instanceof Error ? error.message : 'Failed to save entry'}
            </p>
          </div>
        </motion.div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-sage-200">
        <div className="text-sm text-earth-600">
          {wordCount} word{wordCount !== 1 ? 's' : ''}
        </div>

        <div className="flex items-center gap-3">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={isSaving}
              className="btn-ghost"
            >
              Cancel
            </button>
          )}
          <motion.button
            type="button"
            onClick={handleSave}
            disabled={isSaving || !content || wordCount === 0}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Saving...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {entryId ? 'Update Entry' : 'Save Entry'}
              </span>
            )}
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default JournalEntryForm;

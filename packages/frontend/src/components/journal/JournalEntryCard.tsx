import React from 'react';
import { JournalEntry, MOOD_ICONS, MoodLevel, EntryType } from '@finance-platform/shared';
import { motion } from 'framer-motion';

interface JournalEntryCardProps {
  entry: JournalEntry;
  onClick?: (entry: JournalEntry) => void;
  onToggleFavorite?: (entryId: string) => void;
  onDelete?: (entryId: string) => void;
  className?: string;
}

const JournalEntryCard: React.FC<JournalEntryCardProps> = ({
  entry,
  onClick,
  onToggleFavorite,
  onDelete,
  className = '',
}) => {
  const getEntryTypeLabel = (type: EntryType): string => {
    const labels: Record<EntryType, string> = {
      free_form: 'Free Form',
      module_reflection: 'Module Reflection',
      goal: 'Goal',
      daily_checkin: 'Daily Check-in',
      prompted: 'Prompted',
    };
    return labels[type];
  };

  const getEntryTypeColor = (type: EntryType): string => {
    const colors: Record<EntryType, string> = {
      free_form: 'bg-sage-100 text-sage-700',
      module_reflection: 'bg-sky-100 text-sky-700',
      goal: 'bg-moss-100 text-moss-700',
      daily_checkin: 'bg-earth-100 text-earth-700',
      prompted: 'bg-cream-100 text-cream-900',
    };
    return colors[type];
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }
  };

  const extractTextPreview = (content: any): string => {
    if (!content || !content.content) {
      return '';
    }

    let text = '';
    const traverse = (node: any) => {
      if (node.type === 'text') {
        text += node.text + ' ';
      }
      if (node.content && Array.isArray(node.content)) {
        node.content.forEach(traverse);
      }
    };

    content.content.forEach(traverse);
    const trimmed = text.trim();
    return trimmed.length > 200 ? trimmed.substring(0, 200) + '...' : trimmed;
  };

  const handleCardClick = () => {
    if (onClick) {
      onClick(entry);
    }
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggleFavorite) {
      onToggleFavorite(entry.id);
    }
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete && window.confirm('Are you sure you want to delete this entry?')) {
      onDelete(entry.id);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.2 }}
      className={`
        card-peaceful p-5 cursor-pointer
        hover:shadow-gentle hover:border-sage-200
        transition-all duration-200
        ${className}
      `}
      onClick={handleCardClick}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          {entry.title && (
            <h3 className="text-lg font-semibold text-earth-900 mb-1 line-clamp-2">
              {entry.title}
            </h3>
          )}
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`badge-peaceful ${getEntryTypeColor(entry.entry_type)} text-xs`}>
              {getEntryTypeLabel(entry.entry_type)}
            </span>
            <span className="text-xs text-earth-500">
              {formatDate(entry.created_at)}
            </span>
            {entry.word_count > 0 && (
              <span className="text-xs text-earth-500">
                {entry.word_count} words
              </span>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={handleFavoriteClick}
          className="ml-2 p-2 rounded-soft hover:bg-sage-50 transition-colors"
          aria-label={entry.is_favorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <svg
            className={`w-5 h-5 transition-colors ${
              entry.is_favorite ? 'fill-amber-500 text-amber-500' : 'text-sage-300 hover:text-amber-400'
            }`}
            fill={entry.is_favorite ? 'currentColor' : 'none'}
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
            />
          </svg>
        </button>
      </div>

      {/* Content Preview */}
      <p className="text-earth-700 text-sm mb-3 line-clamp-3">
        {extractTextPreview(entry.content)}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-sage-100">
        <div className="flex items-center gap-3">
          {entry.mood !== null && (
            <div className="flex items-center gap-1">
              <span className="text-sm">
                {MOOD_ICONS[entry.mood as MoodLevel].emoji}
              </span>
              <span className="text-xs text-earth-600">
                {MOOD_ICONS[entry.mood as MoodLevel].label}
              </span>
            </div>
          )}

          {entry.stress_level !== null && (
            <div className="flex items-center gap-1">
              <span className="text-xs text-earth-600">
                Stress: {entry.stress_level}/10
              </span>
            </div>
          )}
        </div>

        {/* Tags */}
        {entry.tags && entry.tags.length > 0 && (
          <div className="flex items-center gap-1 flex-wrap">
            {entry.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-sage-50 text-sage-700"
              >
                #{tag}
              </span>
            ))}
            {entry.tags.length > 3 && (
              <span className="text-xs text-earth-500">
                +{entry.tags.length - 3}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Actions */}
      {onDelete && (
        <div className="mt-3 pt-3 border-t border-sage-100 flex justify-end">
          <button
            type="button"
            onClick={handleDeleteClick}
            className="text-xs text-earth-500 hover:text-red-600 transition-colors"
          >
            Delete
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default JournalEntryCard;

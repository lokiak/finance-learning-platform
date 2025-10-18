import React, { useState, useMemo } from 'react';
import { JournalEntry, EntryType } from '@finance-platform/shared';
import JournalEntryCard from './JournalEntryCard';
import { motion, AnimatePresence } from 'framer-motion';

interface JournalListProps {
  entries: JournalEntry[];
  onEntryClick?: (entry: JournalEntry) => void;
  onToggleFavorite?: (entryId: string) => void;
  onDelete?: (entryId: string) => void;
  isLoading?: boolean;
  className?: string;
}

type SortOption = 'date-desc' | 'date-asc' | 'word-count' | 'mood';
type FilterType = EntryType | 'all';

const JournalList: React.FC<JournalListProps> = ({
  entries,
  onEntryClick,
  onToggleFavorite,
  onDelete,
  isLoading = false,
  className = '',
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [sortBy, setSortBy] = useState<SortOption>('date-desc');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  const filteredAndSortedEntries = useMemo(() => {
    let filtered = [...entries];

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((entry) => {
        const titleMatch = entry.title?.toLowerCase().includes(query);
        const tagsMatch = entry.tags?.some(tag => tag.toLowerCase().includes(query));
        return titleMatch || tagsMatch;
      });
    }

    // Filter by entry type
    if (filterType !== 'all') {
      filtered = filtered.filter((entry) => entry.entry_type === filterType);
    }

    // Filter by favorites
    if (showFavoritesOnly) {
      filtered = filtered.filter((entry) => entry.is_favorite);
    }

    // Sort entries
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date-desc':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'date-asc':
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case 'word-count':
          return b.word_count - a.word_count;
        case 'mood':
          const moodA = a.mood ?? 0;
          const moodB = b.mood ?? 0;
          return moodB - moodA;
        default:
          return 0;
      }
    });

    return filtered;
  }, [entries, searchQuery, filterType, sortBy, showFavoritesOnly]);

  const entryTypeOptions: { value: FilterType; label: string }[] = [
    { value: 'all', label: 'All Entries' },
    { value: EntryType.FREE_FORM, label: 'Free Form' },
    { value: EntryType.MODULE_REFLECTION, label: 'Module Reflection' },
    { value: EntryType.GOAL, label: 'Goal' },
    { value: EntryType.DAILY_CHECKIN, label: 'Daily Check-in' },
    { value: EntryType.PROMPTED, label: 'Prompted' },
  ];

  const sortOptions: { value: SortOption; label: string }[] = [
    { value: 'date-desc', label: 'Newest First' },
    { value: 'date-asc', label: 'Oldest First' },
    { value: 'word-count', label: 'Most Words' },
    { value: 'mood', label: 'Best Mood' },
  ];

  if (isLoading) {
    return (
      <div className={`space-y-4 ${className}`}>
        {[1, 2, 3].map((i) => (
          <div key={i} className="card-peaceful p-5 animate-pulse">
            <div className="h-4 bg-sage-200 rounded w-3/4 mb-3"></div>
            <div className="h-3 bg-sage-100 rounded w-full mb-2"></div>
            <div className="h-3 bg-sage-100 rounded w-5/6"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Search and Filters */}
      <div className="card-peaceful p-4 space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search by title or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-peaceful pl-10"
          />
          <svg
            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-earth-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        {/* Filters and Sort */}
        <div className="flex flex-wrap gap-3 items-center">
          {/* Entry Type Filter */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as FilterType)}
            className="input-peaceful py-2 text-sm"
          >
            {entryTypeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="input-peaceful py-2 text-sm"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          {/* Favorites Toggle */}
          <button
            type="button"
            onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
            className={`
              flex items-center gap-2 px-3 py-2 rounded-soft text-sm font-medium
              transition-all duration-200
              ${
                showFavoritesOnly
                  ? 'bg-amber-100 text-amber-700 border-2 border-amber-300'
                  : 'bg-white text-earth-700 border-2 border-sage-200 hover:border-sage-300'
              }
            `}
          >
            <svg
              className={`w-4 h-4 ${showFavoritesOnly ? 'fill-amber-500' : 'fill-none'}`}
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
            Favorites
          </button>

          {/* Results Count */}
          <div className="ml-auto text-sm text-earth-600">
            {filteredAndSortedEntries.length} {filteredAndSortedEntries.length === 1 ? 'entry' : 'entries'}
          </div>
        </div>
      </div>

      {/* Entry List */}
      {filteredAndSortedEntries.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="card-peaceful p-12 text-center"
        >
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-sage-100 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-sage-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-earth-900 mb-2">
            No entries found
          </h3>
          <p className="text-sm text-earth-600 mb-4">
            {searchQuery || filterType !== 'all' || showFavoritesOnly
              ? 'Try adjusting your filters or search query'
              : 'Start your journaling journey by creating your first entry'}
          </p>
          {(searchQuery || filterType !== 'all' || showFavoritesOnly) && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setFilterType('all');
                setShowFavoritesOnly(false);
              }}
              className="btn-secondary text-sm"
            >
              Clear filters
            </button>
          )}
        </motion.div>
      ) : (
        <AnimatePresence mode="popLayout">
          <div className="space-y-4">
            {filteredAndSortedEntries.map((entry) => (
              <JournalEntryCard
                key={entry.id}
                entry={entry}
                onClick={onEntryClick}
                onToggleFavorite={onToggleFavorite}
                onDelete={onDelete}
              />
            ))}
          </div>
        </AnimatePresence>
      )}
    </div>
  );
};

export default JournalList;

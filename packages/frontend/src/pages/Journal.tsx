import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';
import { JournalList } from '@/components/journal';
import JournalCalendar from '@/components/journal/JournalCalendar';
import JournalEntryCard from '@/components/journal/JournalEntryCard';
import { JournalEntry } from '@finance-platform/shared';
import { format, subDays } from 'date-fns';

type ViewMode = 'list' | 'calendar';

export default function Journal() {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedDateEntries, setSelectedDateEntries] = useState<JournalEntry[]>([]);

  const { data, isLoading, error } = useQuery({
    queryKey: ['journal', 'entries'],
    queryFn: () => api.getJournalEntries({ limit: 100 }),
  });

  const { data: statsData } = useQuery({
    queryKey: ['journal', 'stats'],
    queryFn: () => api.getJournalStats(),
  });

  const entries = data?.entries || [];
  const currentStreak = statsData?.current_streak || 0;

  // Calculate streak days for calendar highlighting
  const streakDays = useMemo(() => {
    if (currentStreak === 0) return [];
    const days: Date[] = [];
    for (let i = 0; i < currentStreak; i++) {
      days.push(subDays(new Date(), i));
    }
    return days;
  }, [currentStreak]);

  const handleDateClick = (date: Date, dayEntries: JournalEntry[]) => {
    setSelectedDate(date);
    setSelectedDateEntries(dayEntries);
  };

  const closeModal = () => {
    setSelectedDate(null);
    setSelectedDateEntries([]);
  };

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
            <div className="flex items-center gap-3 mb-3">
              <span className="text-4xl">📔</span>
              <h1 className="text-4xl font-bold text-earth-900">Your Journal</h1>
            </div>
            <p className="text-lg text-earth-700 max-w-2xl">
              Reflect on your financial journey, track your progress, and explore your thoughts
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/journal/prompts"
              className="btn-ghost"
            >
              Browse Prompts
            </Link>
            <Link
              to="/journal/new"
              className="btn-primary"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M12 4v16m8-8H4" />
              </svg>
              New Entry
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Streak Display */}
      {currentStreak > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.05 }}
          className="card-peaceful p-4 bg-gradient-to-r from-amber-50 to-orange-50"
        >
          <div className="flex items-center gap-3">
            <span className="text-3xl">🔥</span>
            <div>
              <p className="text-sm text-earth-600">Current Streak</p>
              <p className="text-2xl font-bold text-earth-900">{currentStreak} {currentStreak === 1 ? 'day' : 'days'}</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* View Toggle */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex items-center gap-2 justify-end"
      >
        <button
          type="button"
          onClick={() => setViewMode('list')}
          className={`
            px-4 py-2 rounded-soft text-sm font-medium transition-all duration-200
            ${viewMode === 'list'
              ? 'bg-sage-600 text-white shadow-soft'
              : 'bg-white text-earth-700 border-2 border-sage-200 hover:border-sage-400'}
          `}
        >
          <svg
            className="w-4 h-4 inline mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
          List
        </button>
        <button
          type="button"
          onClick={() => setViewMode('calendar')}
          className={`
            px-4 py-2 rounded-soft text-sm font-medium transition-all duration-200
            ${viewMode === 'calendar'
              ? 'bg-sage-600 text-white shadow-soft'
              : 'bg-white text-earth-700 border-2 border-sage-200 hover:border-sage-400'}
          `}
        >
          <svg
            className="w-4 h-4 inline mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          Calendar
        </button>
      </motion.div>

      {/* Error State */}
      {error && (
        <div className="card-peaceful p-6 bg-red-50 border-red-200">
          <p className="text-red-700">Failed to load journal entries</p>
        </div>
      )}

      {/* Content Views */}
      <AnimatePresence mode="wait">
        {viewMode === 'list' ? (
          <motion.div
            key="list"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            <JournalList entries={entries} isLoading={isLoading} />
          </motion.div>
        ) : (
          <motion.div
            key="calendar"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            <JournalCalendar
              entries={entries}
              onDateClick={handleDateClick}
              streakDays={streakDays}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Date Entries Modal */}
      <AnimatePresence>
        {selectedDate && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
              className="fixed inset-0 bg-black bg-opacity-50 z-40"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-x-4 top-20 bottom-20 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-3xl bg-white rounded-gentle shadow-dramatic overflow-hidden z-50"
            >
              <div className="h-full flex flex-col">
                {/* Modal Header */}
                <div className="p-6 border-b border-sage-100 bg-gradient-to-r from-sage-50 to-moss-50">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-earth-900">
                      {format(selectedDate, 'MMMM d, yyyy')}
                    </h2>
                    <button
                      type="button"
                      onClick={closeModal}
                      className="p-2 hover:bg-sage-100 rounded-soft transition-colors"
                      aria-label="Close"
                    >
                      <svg
                        className="w-6 h-6 text-earth-700"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                  <p className="text-sm text-earth-600 mt-1">
                    {selectedDateEntries.length} {selectedDateEntries.length === 1 ? 'entry' : 'entries'}
                  </p>
                </div>

                {/* Modal Content */}
                <div className="flex-1 overflow-y-auto p-6">
                  {selectedDateEntries.length === 0 ? (
                    <div className="text-center py-12">
                      <span className="text-6xl mb-4 block">📝</span>
                      <p className="text-earth-600 mb-4">No entries for this day</p>
                      <Link
                        to="/journal/new"
                        onClick={closeModal}
                        className="btn-primary inline-flex items-center"
                      >
                        Create Entry
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {selectedDateEntries.map((entry) => (
                        <JournalEntryCard
                          key={entry.id}
                          entry={entry}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
  isSameMonth,
  isSameDay,
  isToday,
  parseISO,
} from 'date-fns';
import { JournalEntry } from '@finance-platform/shared';

interface JournalCalendarProps {
  entries: JournalEntry[];
  onDateClick?: (date: Date, entries: JournalEntry[]) => void;
  streakDays?: Date[];
  className?: string;
}

const MOOD_COLORS = {
  1: 'bg-red-400',      // Stressed
  2: 'bg-orange-400',   // Anxious
  3: 'bg-gray-400',     // Neutral
  4: 'bg-blue-400',     // Calm
  5: 'bg-green-400',    // Peaceful
};

const JournalCalendar: React.FC<JournalCalendarProps> = ({
  entries,
  onDateClick,
  streakDays = [],
  className = '',
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Group entries by date
  const entriesByDate = useMemo(() => {
    const grouped: Record<string, JournalEntry[]> = {};
    entries.forEach((entry) => {
      const dateKey = format(parseISO(entry.created_at), 'yyyy-MM-dd');
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(entry);
    });
    return grouped;
  }, [entries]);

  // Calculate calendar days
  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const days = [];
    let day = startDate;

    while (day <= endDate) {
      days.push(day);
      day = addDays(day, 1);
    }

    return days;
  }, [currentMonth]);

  const previousMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const goToToday = () => {
    setCurrentMonth(new Date());
  };

  const getAverageMood = (dayEntries: JournalEntry[]): number | null => {
    const moodsWithValues = dayEntries.filter((e) => e.mood !== null);
    if (moodsWithValues.length === 0) return null;
    const sum = moodsWithValues.reduce((acc, e) => acc + (e.mood || 0), 0);
    return Math.round(sum / moodsWithValues.length);
  };

  const isStreakDay = (date: Date): boolean => {
    return streakDays.some((streakDate) => isSameDay(date, streakDate));
  };

  const handleDayClick = (date: Date) => {
    const dateKey = format(date, 'yyyy-MM-dd');
    const dayEntries = entriesByDate[dateKey] || [];
    if (onDateClick) {
      onDateClick(date, dayEntries);
    }
  };

  return (
    <div className={`card-peaceful p-6 ${className}`}>
      {/* Header with Month Navigation */}
      <div className="flex items-center justify-between mb-6">
        <button
          type="button"
          onClick={previousMonth}
          className="p-2 rounded-soft hover:bg-sage-100 transition-colors"
          aria-label="Previous month"
        >
          <svg
            className="w-5 h-5 text-earth-700"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        <div className="text-center">
          <h3 className="text-xl font-semibold text-earth-900">
            {format(currentMonth, 'MMMM yyyy')}
          </h3>
          <button
            type="button"
            onClick={goToToday}
            className="text-sm text-sage-700 hover:text-sage-800 mt-1"
          >
            Today
          </button>
        </div>

        <button
          type="button"
          onClick={nextMonth}
          className="p-2 rounded-soft hover:bg-sage-100 transition-colors"
          aria-label="Next month"
        >
          <svg
            className="w-5 h-5 text-earth-700"
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
        </button>
      </div>

      {/* Weekday Headers */}
      <div className="grid grid-cols-7 gap-2 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div
            key={day}
            className="text-center text-sm font-medium text-earth-600 py-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Days */}
      <div className="grid grid-cols-7 gap-2">
        {calendarDays.map((day, index) => {
          const dateKey = format(day, 'yyyy-MM-dd');
          const dayEntries = entriesByDate[dateKey] || [];
          const hasEntries = dayEntries.length > 0;
          const avgMood = getAverageMood(dayEntries);
          const isCurrentMonth = isSameMonth(day, currentMonth);
          const isTodayDate = isToday(day);
          const isStreak = isStreakDay(day);

          return (
            <motion.button
              key={dateKey}
              type="button"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.01 }}
              onClick={() => handleDayClick(day)}
              className={`
                relative aspect-square p-2 rounded-soft
                transition-all duration-200
                ${isCurrentMonth ? 'text-earth-900' : 'text-earth-400'}
                ${isTodayDate ? 'bg-sky-100 ring-2 ring-sky-400' : ''}
                ${isStreak && !isTodayDate ? 'bg-sage-50 shadow-gentle' : ''}
                ${hasEntries ? 'hover:bg-sage-100 cursor-pointer' : 'hover:bg-gray-50'}
                ${!isCurrentMonth ? 'opacity-40' : ''}
              `}
            >
              <span className="text-sm font-medium">
                {format(day, 'd')}
              </span>

              {/* Mood Indicator Dot */}
              {hasEntries && avgMood !== null && (
                <div
                  className={`
                    absolute bottom-1 left-1/2 transform -translate-x-1/2
                    w-2 h-2 rounded-full
                    ${MOOD_COLORS[avgMood as keyof typeof MOOD_COLORS]}
                  `}
                  title={`Average mood: ${avgMood}/5`}
                />
              )}

              {/* Entry Count Badge */}
              {dayEntries.length > 1 && (
                <div
                  className="
                    absolute top-1 right-1
                    w-4 h-4 rounded-full
                    bg-sage-600 text-white
                    text-xs flex items-center justify-center
                  "
                  title={`${dayEntries.length} entries`}
                >
                  {dayEntries.length}
                </div>
              )}

              {/* Streak Glow Effect */}
              {isStreak && (
                <div className="absolute inset-0 rounded-soft bg-sage-200 opacity-20 pointer-events-none" />
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-6 pt-4 border-t border-sage-100">
        <p className="text-xs text-earth-600 font-medium mb-2">Mood Legend:</p>
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-red-400" />
            <span className="text-xs text-earth-600">Stressed</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-orange-400" />
            <span className="text-xs text-earth-600">Anxious</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-gray-400" />
            <span className="text-xs text-earth-600">Neutral</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-blue-400" />
            <span className="text-xs text-earth-600">Calm</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-green-400" />
            <span className="text-xs text-earth-600">Peaceful</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JournalCalendar;

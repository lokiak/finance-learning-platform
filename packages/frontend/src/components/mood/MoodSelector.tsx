import React from 'react';

// Temporary local definition until shared package import is fixed
const MOOD_ICONS = {
  5: { emoji: '😌', label: 'Peaceful', color: 'green' },
  4: { emoji: '🙂', label: 'Calm', color: 'blue' },
  3: { emoji: '😐', label: 'Neutral', color: 'gray' },
  2: { emoji: '😟', label: 'Anxious', color: 'orange' },
  1: { emoji: '😰', label: 'Stressed', color: 'red' },
} as const;

type MoodLevel = keyof typeof MOOD_ICONS;

interface MoodSelectorProps {
  value: number | null;
  onChange: (mood: number) => void;
  label?: string;
  className?: string;
}

const MoodSelector: React.FC<MoodSelectorProps> = ({
  value,
  onChange,
  label = 'How are you feeling?',
  className = '',
}) => {
  const moodLevels: MoodLevel[] = [5, 4, 3, 2, 1];

  return (
    <div className={`space-y-3 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-earth-700">
          {label}
        </label>
      )}

      <div className="flex items-center justify-between gap-2">
        {moodLevels.map((level) => {
          const mood = MOOD_ICONS[level];
          const isSelected = value === level;

          return (
            <button
              key={level}
              type="button"
              onClick={() => onChange(level)}
              className={`
                group relative flex flex-col items-center gap-2 p-3 rounded-gentle
                transition-all duration-200
                ${
                  isSelected
                    ? 'bg-gradient-to-br from-sage-100 to-sage-50 shadow-soft scale-110'
                    : 'bg-white hover:bg-sage-50 hover:scale-105'
                }
                border-2 ${isSelected ? 'border-sage-400' : 'border-sage-100 hover:border-sage-200'}
                focus:outline-none focus:ring-2 focus:ring-sage-300 focus:ring-offset-2
              `}
              aria-label={`Select ${mood.label} mood`}
              aria-pressed={isSelected}
            >
              <span
                className={`text-4xl transition-transform duration-200 ${
                  isSelected ? 'scale-110' : 'group-hover:scale-110'
                }`}
              >
                {mood.emoji}
              </span>
              <span
                className={`text-xs font-medium transition-colors ${
                  isSelected ? 'text-sage-700' : 'text-earth-600 group-hover:text-sage-600'
                }`}
              >
                {mood.label}
              </span>

              {isSelected && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-sage-500 rounded-full flex items-center justify-center">
                  <svg
                    className="w-3 h-3 text-white"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="3"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {value !== null && (
        <p className="text-sm text-earth-600 text-center animate-fade-in">
          You selected: <span className="font-medium text-sage-700">{MOOD_ICONS[value as MoodLevel].label}</span>
        </p>
      )}
    </div>
  );
};

export default MoodSelector;

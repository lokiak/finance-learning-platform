import React, { useState } from 'react';

interface StressSliderProps {
  value: number | null;
  onChange: (stress: number) => void;
  label?: string;
  className?: string;
}

const StressSlider: React.FC<StressSliderProps> = ({
  value,
  onChange,
  label = 'Financial stress level',
  className = '',
}) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(parseInt(e.target.value));
  };

  const getStressColor = (level: number): string => {
    if (level <= 3) return 'from-peaceful-dark to-peaceful';
    if (level <= 5) return 'from-calm-dark to-calm';
    if (level <= 7) return 'from-anxious-dark to-anxious';
    return 'from-stressed-dark to-stressed';
  };

  const getStressLabel = (level: number): string => {
    if (level <= 2) return 'Very calm';
    if (level <= 4) return 'Slightly stressed';
    if (level <= 6) return 'Moderately stressed';
    if (level <= 8) return 'Quite stressed';
    return 'Very stressed';
  };

  const currentValue = value ?? 5;

  return (
    <div className={`space-y-4 ${className}`}>
      {label && (
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium text-earth-700">
            {label}
          </label>
          {value !== null && (
            <span className="text-sm font-semibold text-sage-700">
              {currentValue}/10
            </span>
          )}
        </div>
      )}

      <div className="relative pt-2 pb-4">
        {/* Slider track background */}
        <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-r from-peaceful-light via-neutral-light to-stressed-light rounded-full" />

        {/* Slider input */}
        <input
          type="range"
          min="1"
          max="10"
          value={currentValue}
          onChange={handleChange}
          onMouseDown={() => setIsDragging(true)}
          onMouseUp={() => setIsDragging(false)}
          onTouchStart={() => setIsDragging(true)}
          onTouchEnd={() => setIsDragging(false)}
          className="relative w-full h-3 appearance-none bg-transparent cursor-pointer slider-thumb"
          style={{
            WebkitAppearance: 'none',
          }}
          aria-label={label}
          aria-valuemin={1}
          aria-valuemax={10}
          aria-valuenow={currentValue}
          aria-valuetext={getStressLabel(currentValue)}
        />

        {/* Tick marks */}
        <div className="absolute top-3 left-0 right-0 flex justify-between px-1 pointer-events-none">
          {Array.from({ length: 10 }, (_, i) => i + 1).map((tick) => (
            <div
              key={tick}
              className={`w-0.5 h-2 rounded-full transition-colors ${
                tick <= currentValue ? 'bg-sage-400' : 'bg-sage-200'
              }`}
            />
          ))}
        </div>

        {/* Value indicator */}
        {value !== null && (
          <div
            className={`
              absolute -top-12 transition-all duration-200
              ${isDragging ? 'scale-110' : 'scale-100'}
            `}
            style={{
              left: `calc(${((currentValue - 1) / 9) * 100}% - 1.5rem)`,
            }}
          >
            <div
              className={`
                px-3 py-1.5 rounded-soft shadow-gentle
                bg-gradient-to-r ${getStressColor(currentValue)}
                text-white text-xs font-semibold
                animate-fade-in
              `}
            >
              {currentValue}
            </div>
            <div
              className={`
                absolute -bottom-1 left-1/2 transform -translate-x-1/2
                w-2 h-2 rotate-45
                bg-gradient-to-br ${getStressColor(currentValue)}
              `}
            />
          </div>
        )}
      </div>

      {/* Stress level label */}
      {value !== null && (
        <div className="flex items-center justify-center">
          <span className="text-sm font-medium text-earth-700 animate-fade-in">
            {getStressLabel(currentValue)}
          </span>
        </div>
      )}

      {/* Scale labels */}
      <div className="flex items-center justify-between text-xs text-earth-500">
        <span>Low stress</span>
        <span>High stress</span>
      </div>

      <style>{`
        .slider-thumb::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 1.25rem;
          height: 1.25rem;
          border-radius: 50%;
          background: white;
          border: 3px solid #5a925a;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
          transition: all 0.2s ease;
        }

        .slider-thumb::-webkit-slider-thumb:hover {
          transform: scale(1.2);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }

        .slider-thumb::-webkit-slider-thumb:active {
          transform: scale(1.3);
          box-shadow: 0 4px 16px rgba(90, 146, 90, 0.3);
        }

        .slider-thumb::-moz-range-thumb {
          width: 1.25rem;
          height: 1.25rem;
          border-radius: 50%;
          background: white;
          border: 3px solid #5a925a;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
          transition: all 0.2s ease;
        }

        .slider-thumb::-moz-range-thumb:hover {
          transform: scale(1.2);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }

        .slider-thumb::-moz-range-thumb:active {
          transform: scale(1.3);
          box-shadow: 0 4px 16px rgba(90, 146, 90, 0.3);
        }

        .slider-thumb:focus-visible {
          outline: 2px solid #5a925a;
          outline-offset: 2px;
        }
      `}</style>
    </div>
  );
};

export default StressSlider;

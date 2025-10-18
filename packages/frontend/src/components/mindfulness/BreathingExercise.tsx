import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface BreathingExerciseProps {
  defaultDuration?: number; // in minutes
  className?: string;
}

type BreathingPhase = 'inhale' | 'hold-in' | 'exhale' | 'hold-out';

interface BreathingCycle {
  phase: BreathingPhase;
  duration: number; // in seconds
  instruction: string;
  scale: number;
}

const breathingCycles: BreathingCycle[] = [
  { phase: 'inhale', duration: 4, instruction: 'Breathe in slowly', scale: 1.5 },
  { phase: 'hold-in', duration: 4, instruction: 'Hold your breath', scale: 1.5 },
  { phase: 'exhale', duration: 6, instruction: 'Breathe out gently', scale: 1 },
  { phase: 'hold-out', duration: 2, instruction: 'Hold', scale: 1 },
];

const BreathingExercise: React.FC<BreathingExerciseProps> = ({
  defaultDuration = 5,
  className = '',
}) => {
  const [isActive, setIsActive] = useState(false);
  const [currentCycleIndex, setCurrentCycleIndex] = useState(0);
  const [secondsInPhase, setSecondsInPhase] = useState(0);
  const [totalSeconds, setTotalSeconds] = useState(0);
  const [completedCycles, setCompletedCycles] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const currentCycle = breathingCycles[currentCycleIndex];
  const totalCycleDuration = breathingCycles.reduce((sum, cycle) => sum + cycle.duration, 0);
  const targetDurationSeconds = defaultDuration * 60;
  const totalCycles = Math.ceil(targetDurationSeconds / totalCycleDuration);
  const progress = (totalSeconds / targetDurationSeconds) * 100;

  useEffect(() => {
    if (isActive) {
      intervalRef.current = setInterval(() => {
        setSecondsInPhase((prev) => {
          const newSeconds = prev + 1;

          if (newSeconds >= currentCycle.duration) {
            // Move to next phase
            const nextIndex = (currentCycleIndex + 1) % breathingCycles.length;
            setCurrentCycleIndex(nextIndex);

            // Track completed cycles
            if (nextIndex === 0) {
              setCompletedCycles((prev) => prev + 1);
            }

            return 0;
          }

          return newSeconds;
        });

        setTotalSeconds((prev) => {
          const newTotal = prev + 1;

          // Auto-stop when duration is reached
          if (newTotal >= targetDurationSeconds) {
            handleStop();
            return targetDurationSeconds;
          }

          return newTotal;
        });
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, currentCycleIndex, currentCycle.duration, targetDurationSeconds]);

  const handleStart = () => {
    setIsActive(true);
  };

  const handlePause = () => {
    setIsActive(false);
  };

  const handleStop = () => {
    setIsActive(false);
    setCurrentCycleIndex(0);
    setSecondsInPhase(0);
    setTotalSeconds(0);
    setCompletedCycles(0);
  };

  const getPhaseColor = (phase: BreathingPhase): string => {
    switch (phase) {
      case 'inhale':
        return 'from-sky-400 to-sky-600';
      case 'hold-in':
        return 'from-sage-400 to-sage-600';
      case 'exhale':
        return 'from-moss-400 to-moss-600';
      case 'hold-out':
        return 'from-earth-300 to-earth-500';
      default:
        return 'from-sage-400 to-sage-600';
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`flex flex-col items-center justify-center space-y-8 ${className}`}>
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-semibold text-earth-900">
          Breathing Exercise
        </h2>
        <p className="text-sm text-earth-600">
          Follow the circle and breathe mindfully
        </p>
      </div>

      {/* Breathing Circle */}
      <div className="relative flex items-center justify-center">
        {/* Outer ring for visual reference */}
        <div className="absolute w-64 h-64 rounded-full border-2 border-sage-200 opacity-30"></div>

        {/* Animated breathing circle */}
        <motion.div
          animate={{
            scale: isActive ? currentCycle.scale : 1,
          }}
          transition={{
            duration: currentCycle.duration,
            ease: 'easeInOut',
          }}
          className={`
            w-48 h-48 rounded-full
            bg-gradient-to-br ${getPhaseColor(currentCycle.phase)}
            shadow-floating
            flex items-center justify-center
          `}
        >
          <div className="text-center">
            <div className="text-white text-6xl font-light mb-2">
              {currentCycle.duration - secondsInPhase}
            </div>
            <div className="text-white text-sm font-medium opacity-90">
              seconds
            </div>
          </div>
        </motion.div>

        {/* Pulse rings */}
        {isActive && (
          <>
            <motion.div
              animate={{
                scale: [1, 1.8],
                opacity: [0.5, 0],
              }}
              transition={{
                duration: currentCycle.duration,
                repeat: Infinity,
                ease: 'easeOut',
              }}
              className={`
                absolute w-48 h-48 rounded-full
                bg-gradient-to-br ${getPhaseColor(currentCycle.phase)}
              `}
            />
            <motion.div
              animate={{
                scale: [1, 1.8],
                opacity: [0.3, 0],
              }}
              transition={{
                duration: currentCycle.duration,
                repeat: Infinity,
                ease: 'easeOut',
                delay: currentCycle.duration / 3,
              }}
              className={`
                absolute w-48 h-48 rounded-full
                bg-gradient-to-br ${getPhaseColor(currentCycle.phase)}
              `}
            />
          </>
        )}
      </div>

      {/* Instruction Text */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentCycle.phase}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="text-center"
        >
          <p className="text-2xl font-medium text-earth-900">
            {currentCycle.instruction}
          </p>
        </motion.div>
      </AnimatePresence>

      {/* Progress Bar */}
      <div className="w-full max-w-md space-y-2">
        <div className="flex items-center justify-between text-sm text-earth-600">
          <span>{formatTime(totalSeconds)}</span>
          <span>{formatTime(targetDurationSeconds)}</span>
        </div>
        <div className="progress-bar">
          <motion.div
            className="progress-fill"
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(progress, 100)}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <div className="text-center text-xs text-earth-500">
          {completedCycles} of {totalCycles} cycles completed
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4">
        {!isActive ? (
          <button
            type="button"
            onClick={handleStart}
            className="btn-primary px-8 py-3 rounded-gentle flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
            {totalSeconds === 0 ? 'Start' : 'Resume'}
          </button>
        ) : (
          <button
            type="button"
            onClick={handlePause}
            className="btn-primary px-8 py-3 rounded-gentle flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
            </svg>
            Pause
          </button>
        )}

        {totalSeconds > 0 && (
          <button
            type="button"
            onClick={handleStop}
            className="btn-secondary px-6 py-3 rounded-gentle flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 6h12v12H6z" />
            </svg>
            Reset
          </button>
        )}
      </div>

      {/* Tips */}
      <div className="card-peaceful p-4 max-w-md">
        <h4 className="font-semibold text-earth-900 mb-2 flex items-center gap-2">
          <svg className="w-5 h-5 text-sage-600" fill="currentColor" viewBox="0 0 24 24">
            <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Tips for Effective Breathing
        </h4>
        <ul className="text-sm text-earth-700 space-y-1">
          <li className="flex items-start gap-2">
            <span className="text-sage-600 mt-0.5">•</span>
            <span>Find a comfortable, quiet place to sit or lie down</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-sage-600 mt-0.5">•</span>
            <span>Breathe through your nose and out through your mouth</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-sage-600 mt-0.5">•</span>
            <span>Focus on the rise and fall of your chest and belly</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-sage-600 mt-0.5">•</span>
            <span>Let thoughts pass without judgment, gently returning focus to breath</span>
          </li>
        </ul>
      </div>

      {/* Completion Message */}
      <AnimatePresence>
        {totalSeconds >= targetDurationSeconds && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="card-peaceful p-6 max-w-md text-center bg-gradient-to-br from-sage-50 to-sky-50"
          >
            <div className="text-5xl mb-3">🎉</div>
            <h3 className="text-xl font-semibold text-earth-900 mb-2">
              Well Done!
            </h3>
            <p className="text-sm text-earth-700">
              You've completed your {defaultDuration}-minute breathing exercise.
              Take a moment to notice how you feel.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BreathingExercise;

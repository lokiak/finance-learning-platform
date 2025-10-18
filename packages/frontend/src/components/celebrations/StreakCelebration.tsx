import React from 'react';
import { motion } from 'framer-motion';

interface StreakCelebrationProps {
  streak: number;
  className?: string;
}

const StreakCelebration: React.FC<StreakCelebrationProps> = ({
  streak,
  className = '',
}) => {
  const isMilestone = streak % 7 === 0; // Celebrate every 7 days
  const isMajorMilestone = streak % 30 === 0; // Celebrate monthly

  if (!isMilestone) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, y: -20 }}
      className={`
        relative overflow-hidden
        bg-gradient-to-br from-cream-100 via-sage-50 to-sky-100
        rounded-gentle p-6 shadow-floating border-2 border-sage-300
        ${className}
      `}
    >
      {/* Animated background */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.1, 0.3],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute inset-0 bg-gradient-to-br from-sage-400 to-sky-400 blur-3xl"
      />

      <div className="relative z-10 text-center">
        {/* Fire emoji with animation */}
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            rotate: [-5, 5, -5],
          }}
          transition={{
            duration: 0.5,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
          className="text-7xl mb-4"
        >
          🔥
        </motion.div>

        {/* Streak number */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            type: 'spring',
            delay: 0.2,
            duration: 0.6,
            bounce: 0.5,
          }}
          className="mb-3"
        >
          <span className="text-6xl font-bold text-earth-900">
            {streak}
          </span>
          <span className="text-2xl text-earth-700 ml-2">days</span>
        </motion.div>

        {/* Message */}
        <motion.h3
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-2xl font-bold text-earth-900 mb-2"
        >
          {isMajorMilestone ? '🎉 Amazing Commitment!' : 'Keep the Streak Going!'}
        </motion.h3>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-earth-700 text-lg"
        >
          {isMajorMilestone
            ? "You've been journaling consistently for a whole month. This is a powerful habit!"
            : "Consistency is key to growth. You're building a lasting practice!"}
        </motion.p>

        {/* Progress rings */}
        <div className="flex items-center justify-center gap-2 mt-6">
          {Array.from({ length: 5 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                delay: 0.6 + i * 0.1,
                type: 'spring',
                bounce: 0.6,
              }}
              className={`
                w-3 h-3 rounded-full
                ${i < Math.min(5, Math.floor(streak / 7)) ? 'bg-sage-600' : 'bg-sage-200'}
              `}
            />
          ))}
        </div>

        {/* Next milestone */}
        {!isMajorMilestone && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="text-sm text-earth-600 mt-4"
          >
            {30 - (streak % 30)} more days until your next major milestone!
          </motion.p>
        )}
      </div>

      {/* Floating particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          animate={{
            y: [-20, -60, -20],
            x: [0, (i % 2 === 0 ? 10 : -10), 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 3,
            delay: i * 0.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute bottom-4 text-2xl"
          style={{
            left: `${20 + i * 12}%`,
          }}
        >
          {i % 3 === 0 ? '✨' : i % 3 === 1 ? '⭐' : '🌟'}
        </motion.div>
      ))}
    </motion.div>
  );
};

export default StreakCelebration;

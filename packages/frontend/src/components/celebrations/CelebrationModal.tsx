import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Confetti from './Confetti';

interface CelebrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  icon?: string;
  type?: 'achievement' | 'module' | 'streak' | 'goal';
}

const CelebrationModal: React.FC<CelebrationModalProps> = ({
  isOpen,
  onClose,
  title,
  message,
  icon,
  type = 'achievement',
}) => {
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShowConfetti(true);
      // Auto-close after 5 seconds
      const timer = setTimeout(() => {
        onClose();
      }, 5000);

      return () => clearTimeout(timer);
    } else {
      setShowConfetti(false);
    }
  }, [isOpen, onClose]);

  const getGradientByType = () => {
    switch (type) {
      case 'achievement':
        return 'from-cream-100 via-cream-50 to-sage-50';
      case 'module':
        return 'from-sage-100 via-moss-50 to-sky-50';
      case 'streak':
        return 'from-sky-100 via-sage-50 to-moss-50';
      case 'goal':
        return 'from-moss-100 via-sage-50 to-cream-50';
      default:
        return 'from-sage-100 to-cream-50';
    }
  };

  const getDefaultIcon = () => {
    switch (type) {
      case 'achievement':
        return '🏆';
      case 'module':
        return '🎓';
      case 'streak':
        return '🔥';
      case 'goal':
        return '🎯';
      default:
        return '🎉';
    }
  };

  return (
    <>
      <Confetti active={showConfetti} duration={4000} particleCount={60} />

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50"
              style={{ zIndex: 9998 }}
            />

            {/* Modal */}
            <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ zIndex: 9999 }}>
              <motion.div
                initial={{ scale: 0.5, opacity: 0, y: 50 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.8, opacity: 0, y: 20 }}
                transition={{
                  type: 'spring',
                  duration: 0.5,
                  bounce: 0.4,
                }}
                className={`
                  relative max-w-md w-full
                  bg-gradient-to-br ${getGradientByType()}
                  rounded-gentle shadow-floating border-2 border-sage-200
                  p-8 text-center
                `}
              >
                {/* Pulsing ring animation */}
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="relative inline-block mb-6"
                >
                  <motion.div
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.5, 0.2, 0.5],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                    className="absolute inset-0 bg-sage-400 rounded-full blur-xl"
                  />

                  <div className="relative text-8xl">
                    {icon || getDefaultIcon()}
                  </div>
                </motion.div>

                {/* Title */}
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-3xl font-bold text-earth-900 mb-3"
                >
                  {title}
                </motion.h2>

                {/* Message */}
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-lg text-earth-700 mb-6"
                >
                  {message}
                </motion.p>

                {/* Sparkle effects */}
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{
                      scale: [0, 1, 0],
                      opacity: [0, 1, 0],
                      x: Math.cos((i / 8) * Math.PI * 2) * 100,
                      y: Math.sin((i / 8) * Math.PI * 2) * 100,
                    }}
                    transition={{
                      duration: 1.5,
                      delay: 0.5 + i * 0.1,
                      repeat: Infinity,
                      repeatDelay: 2,
                    }}
                    className="absolute w-2 h-2 bg-cream-500 rounded-full"
                    style={{
                      top: '50%',
                      left: '50%',
                    }}
                  />
                ))}

                {/* Close button */}
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  onClick={onClose}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-primary px-8 py-3"
                >
                  Continue
                </motion.button>

                {/* Close X button */}
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 rounded-full hover:bg-sage-100 transition-colors"
                  aria-label="Close"
                >
                  <svg className="w-6 h-6 text-earth-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default CelebrationModal;

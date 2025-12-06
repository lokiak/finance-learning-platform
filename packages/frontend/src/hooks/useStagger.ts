import { useMemo } from 'react';
import { Variants } from 'framer-motion';
import { useReducedMotion } from './useReducedMotion';

/**
 * Hook to create staggered animation variants for children elements
 * @param delay - Delay between each child animation in milliseconds (default: 50)
 * @param initialDelay - Initial delay before first animation starts in milliseconds (default: 100)
 * @returns Variants object for use with Framer Motion
 */
export function useStagger(delay: number = 50, initialDelay: number = 100): Variants {
  const prefersReducedMotion = useReducedMotion();

  return useMemo(() => {
    if (prefersReducedMotion) {
      return {
        hidden: { opacity: 1 },
        visible: { opacity: 1 },
      };
    }

    return {
      hidden: {
        opacity: 0,
      },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: delay / 1000,
          delayChildren: initialDelay / 1000,
        },
      },
    };
  }, [delay, initialDelay, prefersReducedMotion]);
}


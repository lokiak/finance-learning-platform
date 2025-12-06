import { ReactNode } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

export type CardVariant = 'default' | 'glass' | 'elevated' | 'gradient' | 'interactive';
export type CardPadding = 'sm' | 'md' | 'lg' | 'xl';

interface CardProps {
  children: ReactNode;
  className?: string;
  variant?: CardVariant;
  padding?: CardPadding;
  hover?: boolean;
  onClick?: () => void;
  animated?: boolean;
  delay?: number;
}

const paddingMap: Record<CardPadding, string> = {
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
  xl: 'p-10',
};

const variantClasses: Record<CardVariant, string> = {
  default: 'card-peaceful',
  glass: 'card-glass',
  elevated: 'card-elevated',
  gradient: 'card-gradient',
  interactive: 'card-interactive',
};

export default function Card({
  children,
  className = '',
  variant = 'default',
  padding = 'md',
  hover = false,
  onClick,
  animated = false,
  delay = 0,
}: CardProps) {
  const baseClasses = `
    ${variantClasses[variant]}
    ${paddingMap[padding]}
    ${hover || onClick ? 'cursor-pointer' : ''}
    ${className}
  `.trim();

  if (animated) {
    const motionProps: HTMLMotionProps<'div'> = {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: {
        duration: 0.4,
        delay: delay / 1000,
        ease: [0.4, 0, 0.2, 1],
      },
      className: baseClasses,
      onClick,
    };

    return <motion.div {...motionProps}>{children}</motion.div>;
  }

  return (
    <div className={baseClasses} onClick={onClick}>
      {children}
    </div>
  );
}

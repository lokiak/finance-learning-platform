import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ConfettiProps {
  active: boolean;
  duration?: number; // in milliseconds
  particleCount?: number;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  rotation: number;
  color: string;
  size: number;
  delay: number;
}

const colors = ['#5a925a', '#7dad7d', '#0ea1e9', '#d3b895', '#5c7f5c', '#ffb74d', '#66bb6a'];

const Confetti: React.FC<ConfettiProps> = ({
  active,
  duration = 3000,
  particleCount = 50,
}) => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (active) {
      const newParticles: Particle[] = Array.from({ length: particleCount }, (_, i) => ({
        id: i,
        x: Math.random() * 100, // percentage
        y: -10,
        rotation: Math.random() * 360,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 10 + 5,
        delay: Math.random() * 0.5,
      }));
      setParticles(newParticles);

      const timeout = setTimeout(() => {
        setParticles([]);
      }, duration);

      return () => clearTimeout(timeout);
    }
  }, [active, duration, particleCount]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 9999 }}>
      <AnimatePresence>
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            initial={{
              x: `${particle.x}vw`,
              y: '-10vh',
              rotate: 0,
              opacity: 1,
            }}
            animate={{
              x: `${particle.x + (Math.random() - 0.5) * 20}vw`,
              y: '110vh',
              rotate: particle.rotation + 720,
              opacity: [1, 1, 0],
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: duration / 1000,
              delay: particle.delay,
              ease: 'easeOut',
            }}
            style={{
              position: 'absolute',
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              backgroundColor: particle.color,
              borderRadius: Math.random() > 0.5 ? '50%' : '2px',
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default Confetti;

import { useState, useEffect, FormEvent, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/stores/authStore';

export default function Welcome() {
  const [response, setResponse] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useAuthStore();
  const inputRef = useRef<HTMLInputElement>(null);

  // Check if user has already seen welcome page
  useEffect(() => {
    // Wait for auth to finish loading
    if (authLoading) {
      return;
    }

    const seen = localStorage.getItem('has_seen_welcome');
    if (seen === 'true') {
      navigate('/dashboard', { replace: true });
      return;
    }
    setIsChecking(false);
  }, [navigate, authLoading]);

  // Auto-focus input on mount
  useEffect(() => {
    if (inputRef.current && !isChecking && !isSubmitting) {
      // Small delay to ensure animation completes
      setTimeout(() => {
        inputRef.current?.focus();
      }, 1000);
    }
  }, [isChecking, isSubmitting]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!response.trim()) {
      return;
    }

    setIsSubmitting(true);

    // Store response in localStorage
    localStorage.setItem('welcome_response', response.trim());
    localStorage.setItem('has_seen_welcome', 'true');

    // Small delay for visual feedback
    await new Promise(resolve => setTimeout(resolve, 500));

    setIsSubmitting(false);

    // Fade out and navigate to dashboard
    setTimeout(() => {
      navigate('/dashboard', { replace: true });
    }, 300);
  };

  const handleSkip = () => {
    localStorage.setItem('has_seen_welcome', 'true');
    navigate('/dashboard', { replace: true });
  };

  // Get personalized prompt
  const prompt = user?.name ? `How are you doing, ${user.name}?` : 'How are you doing?';

  // Show loading state while checking
  if (isChecking || authLoading) {
    return (
      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 ocean-background">
          <div className="absolute inset-0 bg-gradient-to-br from-[#0a4d68] via-[#088395] to-[#05bfdb] animate-ocean-flow" />
          <div className="absolute inset-0 bg-gradient-to-tl from-[#00d9ff] via-[#00b8d4] to-transparent opacity-30 animate-ocean-flow-reverse" />
        </div>
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="breathing-circle mx-auto mb-4"></div>
            <p className="text-white/90">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 overflow-hidden">
      {/* Animated Ocean Background */}
      <div className="absolute inset-0 ocean-background">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a4d68] via-[#088395] to-[#05bfdb] animate-ocean-flow" />
        <div className="absolute inset-0 bg-gradient-to-tl from-[#00d9ff] via-[#00b8d4] to-transparent opacity-30 animate-ocean-flow-reverse" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md space-y-8">
          {/* Prompt Bubble */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
            className="welcome-prompt-bubble"
          >
            <p className="text-3xl md:text-4xl font-medium text-white leading-relaxed">
              {prompt}
            </p>
          </motion.div>

          {/* Input Form */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            <div className="relative">
              <input
                ref={inputRef}
                type="text"
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                placeholder="Type your response..."
                className="welcome-input"
                disabled={isSubmitting}
                aria-label="Your response"
                maxLength={500}
              />
              <button
                type="submit"
                disabled={!response.trim() || isSubmitting}
                className="welcome-send-button"
                aria-label="Send response"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </button>
            </div>

            {/* Skip Link */}
            <div className="text-center">
              <button
                type="button"
                onClick={handleSkip}
                className="welcome-skip-link"
                aria-label="Skip welcome"
              >
                Skip
              </button>
            </div>
          </motion.form>
        </div>
      </div>

      {/* Reduced Motion Override */}
      <style>{`
        @media (prefers-reduced-motion: reduce) {
          .animate-ocean-flow,
          .animate-ocean-flow-reverse {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}


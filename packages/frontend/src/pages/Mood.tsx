import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';
import MoodChart from '@/components/mood/MoodChart';
import MoodInsights from '@/components/mood/MoodInsights';

export default function Mood() {
  const { data: moodData, isLoading: moodLoading } = useQuery({
    queryKey: ['mood', 'entries'],
    queryFn: async () => {
      // For now, we'll fetch mood data from the stats endpoint
      // In a real app, you'd have a dedicated mood entries endpoint
      const apiUrl = typeof window !== 'undefined' && (window as any).VITE_API_URL
        ? (window as any).VITE_API_URL
        : 'http://localhost:3000';
      const response = await fetch(`${apiUrl}/api/mood/history`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!response.ok) return { entries: [] };
      const data = await response.json();
      return data;
    },
  });

  const { data: journalData } = useQuery({
    queryKey: ['journal', 'entries'],
    queryFn: () => api.getJournalEntries({ limit: 100 }),
  });

  const moodEntries = moodData?.entries || [];
  const journalEntries = journalData?.entries || [];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-sky-100 via-blue-50 to-purple-100 rounded-gentle p-8 shadow-soft"
      >
        <div className="flex items-center gap-3 mb-3">
          <span className="text-4xl">😊</span>
          <h1 className="text-4xl font-bold text-earth-900">Mood & Wellness</h1>
        </div>
        <p className="text-lg text-earth-700 max-w-2xl">
          Understand your emotional patterns and discover what helps you thrive
        </p>
      </motion.div>

      {/* Loading State */}
      {moodLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="breathing-circle"></div>
        </div>
      )}

      {/* Content */}
      {!moodLoading && (
        <>
          {/* Mood Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <MoodChart moodEntries={moodEntries} />
          </motion.div>

          {/* Mood Insights */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <MoodInsights
              moodEntries={moodEntries}
              journalEntries={journalEntries}
            />
          </motion.div>
        </>
      )}
    </div>
  );
}

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { format, subDays, parseISO } from 'date-fns';

interface MoodEntry {
  created_at: string;
  overall_mood: number;
  financial_stress?: number;
  energy_level?: number;
}

interface MoodChartProps {
  moodEntries: MoodEntry[];
  className?: string;
}

type TimeRange = 7 | 30 | 90;

const MoodChart: React.FC<MoodChartProps> = ({ moodEntries, className = '' }) => {
  const [timeRange, setTimeRange] = useState<TimeRange>(30);

  // Filter and format data for the selected time range
  const chartData = moodEntries
    .filter((entry) => {
      const entryDate = parseISO(entry.created_at);
      const cutoffDate = subDays(new Date(), timeRange);
      return entryDate >= cutoffDate;
    })
    .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
    .map((entry) => ({
      date: format(parseISO(entry.created_at), 'MMM d'),
      fullDate: entry.created_at,
      mood: entry.overall_mood,
      stress: entry.financial_stress ? 6 - entry.financial_stress : undefined, // Invert stress so higher = better
      energy: entry.energy_level,
    }));

  // Calculate statistics
  const avgMood =
    chartData.length > 0
      ? (chartData.reduce((sum, d) => sum + d.mood, 0) / chartData.length).toFixed(1)
      : '0.0';

  const moodChange =
    chartData.length >= 2
      ? ((chartData[chartData.length - 1].mood - chartData[0].mood) / chartData[0].mood) * 100
      : 0;

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-soft shadow-soft border border-sage-200">
          <p className="text-sm font-medium text-earth-900 mb-1">
            {format(parseISO(payload[0].payload.fullDate), 'MMMM d, yyyy')}
          </p>
          {payload.map((entry: any, index: number) => (
            <p
              key={index}
              className="text-sm"
              style={{ color: entry.color }}
            >
              {entry.name}: {entry.value.toFixed(1)}/5
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className={`card-peaceful p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-xl font-semibold text-earth-900 mb-1">Mood Trends</h3>
          <p className="text-sm text-earth-600">Track your emotional wellness over time</p>
        </div>

        {/* Time Range Selector */}
        <div className="flex items-center gap-2">
          {([7, 30, 90] as TimeRange[]).map((range) => (
            <button
              key={range}
              type="button"
              onClick={() => setTimeRange(range)}
              className={`
                px-3 py-1 rounded-soft text-sm font-medium transition-all duration-200
                ${timeRange === range
                  ? 'bg-sage-600 text-white shadow-soft'
                  : 'bg-white text-earth-700 border border-sage-200 hover:border-sage-400'}
              `}
            >
              {range}d
            </button>
          ))}
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-sage-50 rounded-soft p-4">
          <p className="text-sm text-earth-600 mb-1">Average Mood</p>
          <p className="text-3xl font-bold text-earth-900">{avgMood}</p>
          <p className="text-xs text-earth-500 mt-1">out of 5.0</p>
        </div>
        <div className="bg-sky-50 rounded-soft p-4">
          <p className="text-sm text-earth-600 mb-1">Change</p>
          <div className="flex items-baseline gap-2">
            <p className={`text-3xl font-bold ${moodChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {moodChange >= 0 ? '+' : ''}
              {moodChange.toFixed(0)}%
            </p>
            <span className="text-xl">{moodChange >= 0 ? '↗' : '↘'}</span>
          </div>
          <p className="text-xs text-earth-500 mt-1">from {timeRange} days ago</p>
        </div>
      </div>

      {/* Chart */}
      {chartData.length === 0 ? (
        <div className="text-center py-12">
          <span className="text-6xl mb-4 block">📊</span>
          <p className="text-earth-600 mb-2">No mood data available</p>
          <p className="text-sm text-earth-500">
            Start tracking your mood to see trends over time
          </p>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="date"
                stroke="#6b7280"
                style={{ fontSize: '12px' }}
              />
              <YAxis
                domain={[1, 5]}
                ticks={[1, 2, 3, 4, 5]}
                stroke="#6b7280"
                style={{ fontSize: '12px' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ fontSize: '14px' }}
                iconType="line"
              />
              <Line
                type="monotone"
                dataKey="mood"
                stroke="#10b981"
                strokeWidth={3}
                dot={{ fill: '#10b981', r: 4 }}
                activeDot={{ r: 6 }}
                name="Overall Mood"
              />
              {chartData.some((d) => d.stress !== undefined) && (
                <Line
                  type="monotone"
                  dataKey="stress"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  dot={{ fill: '#f59e0b', r: 3 }}
                  name="Financial Peace"
                  strokeDasharray="5 5"
                />
              )}
              {chartData.some((d) => d.energy !== undefined) && (
                <Line
                  type="monotone"
                  dataKey="energy"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ fill: '#3b82f6', r: 3 }}
                  name="Energy Level"
                  strokeDasharray="5 5"
                />
              )}
            </LineChart>
          </ResponsiveContainer>

          <div className="mt-4 text-xs text-earth-500 text-center">
            Higher values indicate better mood, peace, and energy
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default MoodChart;

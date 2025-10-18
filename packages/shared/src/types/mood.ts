// Mood tracking types and interfaces

export interface MoodEntry {
  id: string;
  user_id: string;

  // Mood data
  overall_mood: number; // 1-5 scale
  financial_stress: number; // 1-10 scale
  energy_level: number | null; // 1-5 scale
  note: string | null;

  // Context
  journaled_today: boolean;
  completed_module: boolean;
  worked_on_goal: boolean;

  created_at: string;
}

export interface LogMoodRequest {
  overall_mood: number;
  financial_stress: number;
  energy_level?: number;
  note?: string;
  journaled_today?: boolean;
  completed_module?: boolean;
  worked_on_goal?: boolean;
}

export interface LogMoodResponse {
  mood_entry: MoodEntry;
  streak: number;
  mood_trend: 'improving' | 'stable' | 'declining' | 'insufficient_data';
}

export interface MoodHistoryEntry {
  date: string;
  overall_mood: number;
  financial_stress: number;
  energy_level: number | null;
}

export interface MoodAnalytics {
  average_mood: number;
  average_stress: number;
  trend: 'improving' | 'stable' | 'declining' | 'insufficient_data';
  best_day: string | null;
  worst_day: string | null;
  correlations: {
    journaling_helps: boolean;
    module_completion_boosts: boolean;
    goal_work_improves: boolean;
  };
}

export interface MoodHistoryResponse {
  entries: MoodHistoryEntry[];
  analytics: MoodAnalytics;
}

export interface MoodInsight {
  type: 'correlation' | 'improvement' | 'pattern' | 'alert';
  message: string;
  confidence: number; // 0-1
  data?: Record<string, any>;
}

export interface MoodRecommendation {
  action: 'journal' | 'module' | 'breathing' | 'break' | 'goal_review';
  message: string;
  priority: number;
}

export interface MoodInsightsResponse {
  insights: MoodInsight[];
  recommendations: MoodRecommendation[];
}

// Mood icon mapping for UI
export const MOOD_ICONS = {
  5: { emoji: '😌', label: 'Peaceful', color: 'green' },
  4: { emoji: '🙂', label: 'Calm', color: 'blue' },
  3: { emoji: '😐', label: 'Neutral', color: 'gray' },
  2: { emoji: '😟', label: 'Anxious', color: 'orange' },
  1: { emoji: '😰', label: 'Stressed', color: 'red' },
} as const;

export type MoodLevel = keyof typeof MOOD_ICONS;

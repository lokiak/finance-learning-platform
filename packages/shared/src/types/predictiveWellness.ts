// Predictive Wellness Types

export interface StressPrediction {
  predicted_stress_level: number; // 1-10
  confidence: number; // 0-1
  factors: {
    module_difficulty: number;
    recent_mood_trend: 'improving' | 'stable' | 'declining';
    time_since_last_break: number;
    consecutive_learning_time: number;
    upcoming_challenging_content: boolean;
  };
  recommendations: {
    suggest_break: boolean;
    simplify_content: boolean;
    add_encouragement: boolean;
    recommend_breathing: boolean;
  };
}

export interface OptimalLearningTime {
  current_readiness: 'optimal' | 'good' | 'moderate' | 'poor';
  factors: {
    time_of_day: string;
    day_of_week: string;
    mood_level: number;
    energy_level: number;
    recent_activity: string;
  };
  recommendations: {
    start_learning: boolean;
    wait_time: number; // minutes
    suggested_activity: string;
  };
}

export interface EngagementPrediction {
  drop_off_risk: 'low' | 'medium' | 'high';
  confidence: number;
  indicators: {
    session_length: number;
    recent_abandonment: boolean;
    current_module_difficulty: number;
    time_since_last_progress: number;
    stress_level: number;
  };
  interventions: {
    encouragement: string;
    simplify_next_content: boolean;
    suggest_alternative: string;
    celebrate_progress: boolean;
  };
}

export interface SuccessProbability {
  module_id: string;
  completion_probability: number; // 0-1
  factors: {
    prerequisite_mastery: number;
    current_mood: number;
    time_available: number;
    historical_similar_modules: number; // completion rate
    stress_level: number;
  };
  recommendations: {
    proceed: boolean;
    preparation_steps: string[];
    optimal_conditions: string[];
  };
}


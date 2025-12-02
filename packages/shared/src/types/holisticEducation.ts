// Holistic Education Types

export interface EmotionalLearningState {
  current_mood: number; // 1-5
  stress_level: number; // 1-10
  energy_level: number; // 1-5
  learning_readiness: 'optimal' | 'moderate' | 'low' | 'overwhelmed';
  adaptations: {
    content_pacing: 'gentle' | 'normal' | 'challenging';
    support_level: 'high' | 'medium' | 'low';
    break_suggestions: boolean;
    encouragement_frequency: number;
  };
}

export interface BehavioralPatterns {
  learning_habits: {
    preferred_time_of_day: string;
    session_length: number;
    break_frequency: number;
    review_behavior: 'immediate' | 'delayed' | 'spaced';
  };
  engagement_patterns: {
    module_completion_rate: number;
    calculator_usage: number;
    journaling_frequency: number;
    goal_update_frequency: number;
  };
  struggle_indicators: {
    module_abandonment: string[];
    long_pauses: number;
    repeated_section_visits: string[];
    low_assessment_scores: string[];
  };
}

export interface PracticalApplication {
  module_id: string;
  real_world_connections: {
    personal_finance: string[];
    current_goals: string[];
    life_stage: string[];
  };
  action_items: {
    immediate: string[];
    this_week: string[];
    this_month: string[];
  };
  calculator_integration: {
    relevant_calculators: string[];
    suggested_scenarios: any[];
  };
}

export interface ModuleConnections {
  current_module: string;
  related_concepts: {
    prerequisite: string[];
    builds_on: string[];
    prepares_for: string[];
    reinforces: string[];
  };
  connection_points: Array<{
    concept: string;
    related_module: string;
    relationship: 'prerequisite' | 'builds_on' | 'prepares_for' | 'reinforces';
  }>;
}

export interface ModuleReadiness {
  module_id: string;
  prerequisites: Array<{
    concept: string;
    mastery: number;
    status: 'ready' | 'needs_review' | 'not_ready';
  }>;
  emotional_state: {
    mood: number;
    stress: number;
    readiness: 'optimal' | 'good' | 'moderate' | 'poor';
  };
  recommendations: {
    proceed: boolean;
    preparation_steps: string[];
    optimal_timing: string;
  };
}


// Adaptive Learning Types

export interface LearningPerformance {
  id: string;
  user_id: string;
  module_id: string;
  section_id?: string;
  concept_id?: string;
  time_spent_seconds: number;
  attempts: number;
  assessment_score?: number;
  error_count: number;
  error_patterns?: string[];
  completion_status: 'completed' | 'abandoned' | 'in_progress';
  notes_taken: boolean;
  content_reviewed: number;
  interactive_engaged: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface LearningStyle {
  id: string;
  user_id: string;
  visual_preference: number; // 0-100
  textual_preference: number;
  interactive_preference: number;
  pace_preference: 'fast' | 'moderate' | 'thorough';
  preferred_time_of_day?: string;
  average_session_length?: number;
  review_frequency: 'high' | 'medium' | 'low';
  detection_method: 'behavioral' | 'explicit';
  confidence: number; // 0-1
  updated_at: Date;
}

export interface ConceptMastery {
  id: string;
  user_id: string;
  concept_id: string;
  mastery_level: number; // 0-100
  assessment_history: Array<{
    score: number;
    timestamp: Date;
    attempts: number;
  }>;
  last_assessed?: Date;
  next_review_date?: Date;
  spaced_interval_days: number;
  review_count: number;
  status: 'not_started' | 'learning' | 'mastered' | 'needs_review';
  created_at: Date;
  updated_at: Date;
}

export interface ContentDifficulty {
  level: 'introductory' | 'standard' | 'advanced' | 'remedial';
  indicators: {
    performanceThreshold: number;
    timeSpentThreshold: number;
    errorPattern: string[];
  };
  adaptations: {
    simplifiedExplanation: boolean;
    additionalExamples: boolean;
    visualAids: boolean;
    interactivePractice: boolean;
  };
}

export interface LearningPath {
  current_module: string;
  recommended_next: string[];
  prerequisites: string[];
  alternative_paths: {
    fast_track: string[];
    thorough_path: string[];
    remedial_path: string[];
  };
  personalization_factors: {
    learning_pace: 'fast' | 'moderate' | 'thorough';
    preferred_format: 'text' | 'interactive' | 'visual';
    current_stress_level: number;
    time_available: number;
  };
}

export interface AdaptedContent {
  difficulty_level: 'introductory' | 'standard' | 'advanced' | 'remedial';
  format: 'textual' | 'visual' | 'interactive';
  content: any;
  adaptation_reason: string;
  alternative_formats: string[];
}

export interface RemediationPath {
  original_concept: string;
  difficulty: string;
  remediation_steps: Array<{
    step: number;
    content_type: 'simplified_explanation' | 'visual_aid' | 'interactive_exercise' | 'real_world_example';
    content: any;
    assessment: string;
  }>;
  success_criteria: {
    assessment_score: number;
    time_limit: number;
  };
}


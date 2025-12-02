// Proactive Support Types

export interface ContextualHint {
  trigger: {
    location: string; // module, section, concept
    condition: 'first_visit' | 'time_spent' | 'error_pattern' | 'hesitation';
    threshold: number;
  };
  hint: {
    type: 'explanation' | 'tip' | 'example' | 'common_mistake';
    content: string;
    visual_aid: boolean;
    interactive: boolean;
  };
  timing: 'immediate' | 'after_attempt' | 'on_hover' | 'on_hesitation';
}

export interface Encouragement {
  trigger: {
    moment: 'struggling' | 'progressing' | 'stuck' | 'breakthrough' | 'milestone';
    conditions: any;
  };
  message: {
    type: 'acknowledgment' | 'motivation' | 'perspective' | 'celebration';
    content: string;
    personalization: {
      use_name: boolean;
      reference_progress: boolean;
      reference_goals: boolean;
    };
  };
  action: {
    suggest_break: boolean;
    offer_help: boolean;
    celebrate: boolean;
  };
}

export interface BreakSuggestion {
  trigger: {
    learning_time: number; // minutes
    stress_level: number;
    consecutive_modules: number;
    time_of_day: string;
  };
  suggestion: {
    break_type: 'short' | 'medium' | 'long';
    duration: number; // minutes
    activities: string[];
    return_reminder: boolean;
  };
}

export interface ProgressCelebration {
  trigger: {
    achievement: 'section_complete' | 'module_complete' | 'phase_complete' | 'streak' | 'mastery';
    significance: 'micro' | 'minor' | 'major' | 'milestone';
  };
  celebration: {
    type: 'acknowledgment' | 'animation' | 'badge' | 'summary';
    message: string;
    visual: 'subtle' | 'moderate' | 'enthusiastic';
    shareable: boolean;
  };
}

export interface ConceptReinforcement {
  concept_id: string;
  last_mastered: Date;
  mastery_level: number;
  next_review: Date;
  reinforcement_type: 'spaced_repetition' | 'application' | 'connection' | 'assessment';
  content: {
    type: 'quick_review' | 'practice_exercise' | 'real_world_application' | 'knowledge_check';
    material: any;
  };
}


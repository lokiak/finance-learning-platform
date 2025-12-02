// Reflective Thinking Types (Dewey-Inspired)

export interface ProblematicSituation {
  trigger: {
    type: 'surprise' | 'confusion' | 'contradiction' | 'real_world_problem';
    context: string;
    user_relevance: 'high' | 'medium' | 'low';
  };
  problem_statement: string;
  prior_beliefs: Array<{
    assumption: string;
    challenge: string;
  }>;
  reflection_prompt: string;
}

export interface ReflectiveThinkingProcess {
  id: string;
  user_id: string;
  module_id: string;
  section_id?: string;

  // Step 1: Felt Difficulty
  problematic_situation: ProblematicSituation;
  user_reaction?: 'surprised' | 'confused' | 'contradicted' | 'curious';
  engagement_level?: number; // 1-10

  // Step 2: Problem Definition
  initial_problem?: string;
  refined_problem?: string;
  problem_definition_complete: boolean;

  // Step 3: Hypothesis Generation
  user_hypotheses: string[];
  alternative_hypotheses?: string[];
  selected_hypothesis?: string;

  // Step 4: Reasoning
  evidence_gathered?: Array<{
    source: string;
    relevance: string;
    supports_hypothesis: string;
  }>;
  consequence_analysis?: Array<{
    hypothesis: string;
    if_true: string[];
    if_false: string[];
    uncertainty: string[];
  }>;
  logical_reasoning?: string;

  // Step 5: Testing
  action_plan?: string;
  calculator_used?: string;
  real_world_applied: boolean;
  test_results?: any;
  reflection_on_results?: string;

  // Process Status
  current_step: number; // 1-5
  completed: boolean;

  created_at: Date;
  updated_at: Date;
  completed_at?: Date;
}

export interface ReflectiveHypothesis {
  id: string;
  process_id: string;
  user_id: string;
  hypothesis_text: string;
  source: 'user' | 'system' | 'combined';
  feasibility_score?: number; // 1-10
  impact_score?: number; // 1-10
  sustainability_score?: number; // 1-10
  supporting_evidence?: any[];
  opposing_evidence?: any[];
  consequences_if_true?: string[];
  consequences_if_false?: string[];
  status: 'generated' | 'evaluated' | 'selected' | 'tested' | 'rejected';
  selected_for_testing: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface HabitsOfMind {
  id: string;
  user_id: string;
  module_id?: string;
  open_mindedness_score: number; // 0-100
  considers_alternatives: boolean;
  questions_assumptions: boolean;
  explores_solutions: boolean;
  responsibility_score: number; // 0-100
  considers_consequences: boolean;
  takes_ownership: boolean;
  applies_personally: boolean;
  whole_heartedness_score: number; // 0-100
  engagement_level: number; // 0-10
  curiosity_demonstrated: boolean;
  attention_sustained: boolean;
  assessment_type: 'module' | 'section' | 'activity' | 'overall';
  activity_id?: string;
  created_at: Date;
  updated_at: Date;
}

export interface LanguageActivity {
  id: string;
  user_id: string;
  module_id: string;
  section_id?: string;
  activity_type: 'articulation' | 'hypothesis_writing' | 'reflection' | 'concept_mapping' | 'explanation';
  user_response: string;
  required_elements: {
    use_own_words: boolean;
    provide_examples: boolean;
    explain_reasoning: boolean;
    connect_to_experience: boolean;
  };
  elements_completed: {
    use_own_words: boolean;
    provide_examples: boolean;
    explain_reasoning: boolean;
    connect_to_experience: boolean;
  };
  clarity_score?: number; // 0-100
  completeness_score?: number; // 0-100
  reasoning_quality?: number; // 0-100
  overall_score?: number; // 0-100
  feedback_provided: boolean;
  feedback_content?: string;
  created_at: Date;
  updated_at: Date;
}

export interface ReflectionGuidance {
  step: number;
  guidance: string;
  prompts?: string[];
  required?: boolean;
  next_step?: number;
}


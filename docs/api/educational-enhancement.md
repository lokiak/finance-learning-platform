# Educational Enhancement API

Endpoints for adaptive learning, predictive wellness, proactive support, holistic education, and reflective thinking features.

**Base Path**: `/api/learning`, `/api/wellness`, `/api/support`, `/api/holistic`, `/api/reflection`

All endpoints require authentication.

## Adaptive Learning

### POST /api/learning/performance
Track learning performance metrics.

**Request Body:**
```json
{
  "module_id": "uuid",
  "section_id": "uuid",
  "concept_id": "uuid",
  "time_spent_seconds": 900,
  "assessment_score": 75,
  "error_count": 2,
  "error_patterns": ["calculation_error"],
  "completion_status": "completed",
  "notes_taken": true,
  "content_reviewed": 3,
  "interactive_engaged": true
}
```

**Response (200):**
```json
{
  "performance_id": "uuid",
  "adaptations": {
    "content_difficulty": "standard",
    "next_section_recommendation": "proceed",
    "remediation_needed": false
  }
}
```

### GET /api/learning/style
Get detected learning style for the current user.

**Response (200):**
```json
{
  "learning_style": {
    "id": "uuid",
    "user_id": "uuid",
    "primary_style": "visual",
    "secondary_style": "kinesthetic",
    "confidence": 0.85,
    "detected_at": "2024-01-01T00:00:00.000Z"
  }
}
```

### GET /api/learning/adapt-content
Get adapted content recommendations for a module.

**Query Parameters:**
- `module_id` (required) - Module UUID
- `section_id` (required) - Section UUID

**Response (200):**
```json
{
  "adapted_content": {
    "module_id": "uuid",
    "section_id": "uuid",
    "recommended_path": "standard",
    "difficulty_adjustment": "none",
    "additional_resources": [],
    "estimated_time": 20
  }
}
```

**Error Responses:**
- `400` - Missing module_id or section_id

### GET /api/learning/mastery
Get concept mastery level for a specific concept.

**Query Parameters:**
- `concept_id` (required) - Concept UUID

**Response (200):**
```json
{
  "concept_id": "uuid",
  "mastery_level": 0.75,
  "status": "mastered",
  "assessment_history": [],
  "next_review_date": "2024-01-15T00:00:00.000Z",
  "spaced_interval_days": 7
}
```

**Error Responses:**
- `400` - Missing concept_id

### GET /api/learning/path
Get recommended learning path.

**Query Parameters:**
- `current_module` (required) - Current module UUID

**Response (200):**
```json
{
  "recommended_modules": [],
  "reasoning": "User shows good comprehension",
  "estimated_completion_time": 25
}
```

**Error Responses:**
- `400` - Missing current_module

### GET /api/learning/remediation
Get remediation path if user is struggling with a concept.

**Query Parameters:**
- `concept_id` (required) - Concept UUID

**Response (200):**
```json
{
  "concept_id": "uuid",
  "remediation_needed": true,
  "focus_areas": ["compound_interest", "time_value"],
  "recommended_resources": [],
  "estimated_additional_time": 15
}
```

**Error Responses:**
- `400` - Missing concept_id or remediation not needed

## Predictive Wellness

### GET /api/wellness/predict-stress
Predict user stress level based on learning patterns.

**Query Parameters:**
- `module_id` (optional) - Module UUID for module-specific prediction

**Response (200):**
```json
{
  "predicted_stress_level": 6,
  "confidence": 0.72,
  "factors": [
    "recent_failed_attempts",
    "time_pressure"
  ],
  "recommendations": [
    "Take a short break",
    "Review previous concepts"
  ]
}
```

### GET /api/wellness/optimal-time
Detect optimal learning time for the user.

**Response (200):**
```json
{
  "optimal_time": {
    "time_of_day": "morning",
    "confidence": 0.68,
    "reasoning": "Higher engagement scores in morning sessions"
  }
}
```

### GET /api/wellness/predict-engagement
Predict engagement level for upcoming learning.

**Response (200):**
```json
{
  "predicted_engagement": 7.5,
  "confidence": 0.75,
  "factors": ["user_interest", "prerequisite_mastery"],
  "suggest_alternative": null
}
```

### GET /api/wellness/success-probability
Calculate probability of module completion success.

**Query Parameters:**
- `module_id` (required) - Module UUID

**Response (200):**
```json
{
  "module_id": "uuid",
  "probability": 0.82,
  "confidence": 0.70,
  "key_factors": [
    "strong_prerequisite_mastery",
    "good_time_availability"
  ]
}
```

**Error Responses:**
- `400` - Missing module_id

## Proactive Support

### POST /api/support/hint
Request a contextual hint.

**Request Body:**
```json
{
  "module_id": "uuid",
  "section_id": "uuid",
  "condition": "first_visit",
  "time_spent": 300,
  "error_count": 3
}
```

**Required Fields:**
- `module_id` - Module UUID
- `condition` - One of: `first_visit`, `time_spent`, `error_pattern`, `hesitation`

**Optional Fields:**
- `section_id` - Section UUID
- `time_spent` - Time spent in seconds
- `error_count` - Number of errors encountered

**Response (200):**
```json
{
  "hint": {
    "type": "conceptual",
    "message": "Think about how compound interest builds over time...",
    "related_concepts": ["time_value", "exponential_growth"]
  }
}
```

**Error Responses:**
- `400` - Missing module_id or condition

### POST /api/support/encouragement
Trigger encouragement message.

**Request Body:**
```json
{
  "moment_type": "milestone",
  "module_id": "uuid",
  "progress_percentage": 75,
  "recent_achievements": ["module_completion"]
}
```

**Required Fields:**
- `moment_type` - One of: `struggling`, `progressing`, `stuck`, `breakthrough`, `milestone`

**Optional Fields:**
- `module_id` - Module UUID
- `progress_percentage` - Progress percentage (0-100)
- `recent_achievements` - Array of achievement strings

**Response (200):**
```json
{
  "encouragement": {
    "message": "Great job completing this module!",
    "type": "achievement",
    "related_achievement": "module_completion"
  }
}
```

**Error Responses:**
- `400` - Missing moment_type

### GET /api/support/break-suggestion
Get break suggestion if user has been learning for extended period.

**Response (200):**
```json
{
  "break_suggestion": {
    "suggested": true,
    "reason": "45 minutes of continuous learning",
    "recommended_duration": 10,
    "activities": ["stretch", "hydrate", "brief_walk"]
  }
}
```

### POST /api/support/celebrate
Celebrate user progress milestone.

**Request Body:**
```json
{
  "achievement_type": "phase_completion",
  "module_id": "uuid",
  "module_title": "Module 1: Your Money Story",
  "significance": "high"
}
```

**Required Fields:**
- `achievement_type` - Achievement type string

**Optional Fields:**
- `module_id` - Module UUID
- `module_title` - Module title
- `significance` - Significance level

**Response (200):**
```json
{
  "celebration": {
    "message": "Congratulations on completing Phase 1!",
    "achievement_unlocked": true,
    "achievement_id": "uuid"
  }
}
```

**Error Responses:**
- `400` - Missing achievement_type

## Holistic Education

### GET /api/holistic/emotional-state
Get current emotional learning state.

**Response (200):**
```json
{
  "emotional_state": {
    "overall_mood": "positive",
    "engagement_level": "high",
    "stress_indicators": [],
    "motivation_factors": ["progress_visibility", "achievement_unlocks"]
  }
}
```

### GET /api/holistic/behavioral-patterns
Analyze user behavioral patterns.

**Response (200):**
```json
{
  "behavioral_patterns": {
    "learning_consistency": "high",
    "preferred_time": "morning",
    "engagement_trends": "increasing",
    "challenge_preference": "moderate"
  }
}
```

### GET /api/holistic/real-world-application?module_id=:moduleId
Get real-world application examples for a module.

**Query Parameters:**
- `module_id` (required) - Module UUID

**Response (200):**
```json
{
  "applications": {
    "module_id": "uuid",
    "examples": [
      {
        "scenario": "Saving for a house down payment",
        "relevance": "high",
        "concepts": ["compound_interest", "goal_setting"]
      }
    ]
  }
}
```

### GET /api/holistic/module-connections?module_id=:moduleId
Find connections between modules.

**Query Parameters:**
- `module_id` (required) - Module UUID

**Response (200):**
```json
{
  "connections": {
    "module_id": "uuid",
    "related_modules": [
      {
        "module_id": "uuid",
        "connection_type": "prerequisite",
        "strength": "strong"
      }
    ]
  }
}
```

**Note:** Module readiness endpoint is not currently implemented as a separate route. Readiness is checked through the holistic education service methods.

## Reflective Thinking

### POST /api/reflection/start
Start a new reflective thinking process.

**Request Body:**
```json
{
  "module_id": "uuid",
  "section_id": "uuid"
}
```

**Required Fields:**
- `module_id` - Module UUID

**Optional Fields:**
- `section_id` - Section UUID

**Response (200):**
```json
{
  "process_id": "uuid",
  "step_1": {
    "problematic_situation": {
      "description": "I'm confused about compound interest calculations",
      "user_reaction": "confused",
      "engagement_level": 6
    }
  },
  "current_step": 1,
  "guidance": "Step 1 guidance text..."
}
```

**Error Responses:**
- `400` - Missing module_id

### PUT /api/reflection/:processId/step/:stepNumber
Update step 2 (Problem Definition) in the reflection process.

**Path Parameters:**
- `processId` (required) - Process UUID
- `stepNumber` (required) - Must be `2`

**Request Body:**
```json
{
  "user_articulation": "I need to understand how interest compounds over multiple periods",
  "clarification_answers": {}
}
```

**Response (200):**
```json
{
  "process_id": "uuid",
  "step_completed": 2,
  "refined_problem": "Refined problem statement",
  "next_step": 3,
  "guidance": "Step 3 guidance text..."
}
```

**Error Responses:**
- `400` - Invalid step number (only step 2 is supported via this endpoint)

### POST /api/reflection/:processId/hypotheses
Generate and add hypotheses to the reflection process.

**Path Parameters:**
- `processId` (required) - Process UUID

**Request Body:**
```json
{
  "user_hypotheses": [
    "Compound interest grows exponentially",
    "Each period's interest is added to principal"
  ]
}
```

**Required Fields:**
- `user_hypotheses` - Array of hypothesis strings (non-empty)

**Response (200):**
```json
{
  "hypotheses": [
    {
      "id": "uuid",
      "statement": "Compound interest grows exponentially",
      "status": "pending"
    }
  ],
  "alternative_perspectives": [],
  "comparison_framework": {
    "criteria": ["feasibility", "impact", "sustainability"],
    "next_step": "Evaluate each hypothesis"
  },
  "guidance": "Step 4 guidance text..."
}
```

**Error Responses:**
- `400` - Missing or empty user_hypotheses array

### POST /api/reflection/:processId/hypotheses/:hypothesisId/evaluate
Evaluate a hypothesis.

**Path Parameters:**
- `processId` (required) - Process UUID
- `hypothesisId` (required) - Hypothesis UUID

**Request Body:**
```json
{
  "feasibility_score": 8,
  "impact_score": 9,
  "sustainability_score": 7,
  "supporting_evidence": ["formula_confirmation", "example_verification"],
  "opposing_evidence": [],
  "consequences_if_true": ["Better understanding", "Improved calculations"],
  "consequences_if_false": []
}
```

**Required Fields:**
- `feasibility_score` - Score 1-10
- `impact_score` - Score 1-10
- `sustainability_score` - Score 1-10
- `reflection_on_results` - Reflection text

**Optional Fields:**
- `supporting_evidence` - Array of evidence strings
- `opposing_evidence` - Array of evidence strings
- `consequences_if_true` - Array of consequence strings
- `consequences_if_false` - Array of consequence strings

**Response (200):**
```json
{
  "hypothesis_id": "uuid",
  "evaluation": {
    "feasibility": 8,
    "impact": 9,
    "sustainability": 7,
    "overall_score": 8.0
  },
  "recommendation": "Strong hypothesis. Consider testing this approach.",
  "next_steps": "Test this hypothesis or explore alternatives",
  "guidance": "Step 5 guidance text..."
}
```

### POST /api/reflection/:processId/test
Test the selected hypothesis and complete the reflection process.

**Path Parameters:**
- `processId` (required) - Process UUID

**Request Body:**
```json
{
  "selected_hypothesis_id": "uuid",
  "action_plan": "Apply compound interest formula to calculate future value",
  "calculator_used": "compound_growth",
  "calculator_results": {},
  "real_world_applied": true,
  "test_results": {
    "insights": ["Formula works correctly", "Understanding improved"]
  },
  "reflection_on_results": "The hypothesis was confirmed through testing"
}
```

**Required Fields:**
- `selected_hypothesis_id` - Hypothesis UUID to test
- `action_plan` - Plan for testing
- `reflection_on_results` - Reflection on test results

**Optional Fields:**
- `calculator_used` - Calculator type used
- `calculator_results` - Calculator output
- `real_world_applied` - Boolean (default: false)
- `test_results` - Test results object

**Response (200):**
```json
{
  "process_id": "uuid",
  "step_completed": 5,
  "process_complete": true,
  "final_reflection": {
    "problem_solved": true,
    "solution": "Apply compound interest formula to calculate future value",
    "lessons_learned": ["Formula works correctly", "Understanding improved"],
    "next_actions": ["Implement the solution", "Track results", "Adjust as needed"]
  },
  "mastery_achieved": true
}
```

**Error Responses:**
- `400` - Missing required fields

### GET /api/reflection/:processId
Get reflection process status.

**Path Parameters:**
- `processId` (required) - Process UUID

**Response (200):**
```json
{
  "process_id": "uuid",
  "module_id": "uuid",
  "current_step": 3,
  "completed": false,
  "steps": {
    "step_1": {
      "completed": true,
      "problematic_situation": {},
      "user_reaction": "confused"
    },
    "step_2": {
      "completed": true,
      "refined_problem": "Problem statement"
    },
    "step_3": {
      "completed": false,
      "in_progress": true,
      "hypotheses_generated": 3,
      "hypotheses_evaluated": 0
    },
    "step_4": {
      "completed": false,
      "in_progress": false
    },
    "step_5": {
      "completed": false,
      "in_progress": false
    }
  },
  "guidance": "Current step guidance text..."
}
```

### GET /api/reflection/habits-of-mind
Get habits of mind assessment (placeholder).

**Query Parameters:**
- `module_id` (optional) - Module UUID

**Response (200):**
```json
{
  "message": "Habits of mind assessment endpoint. Use POST to create assessment.",
  "module_id": "uuid"
}
```

### POST /api/reflection/habits-of-mind
Assess habits of mind development.

**Request Body:**
```json
{
  "module_id": "uuid",
  "considers_alternatives": true,
  "questions_assumptions": true,
  "explores_solutions": true,
  "considers_consequences": true,
  "takes_ownership": true,
  "applies_personally": true,
  "engagement_level": 8,
  "curiosity_demonstrated": true,
  "attention_sustained": true
}
```

**Required Fields:**
- `module_id` - Module UUID

**Response (200):**
```json
{
  "open_mindedness": {
    "score": 8.5,
    "indicators": {
      "considers_alternatives": true,
      "questions_assumptions": true,
      "explores_solutions": true
    }
  },
  "responsibility": {
    "score": 7.5,
    "indicators": {
      "considers_consequences": true,
      "takes_ownership": true,
      "applies_personally": true
    }
  },
  "whole_heartedness": {
    "score": 8.0,
    "indicators": {
      "engagement_level": 8,
      "curiosity_demonstrated": true,
      "attention_sustained": true
    }
  },
  "overall_score": 8.0
}
```

**Error Responses:**
- `400` - Missing module_id

### POST /api/reflection/language-activity
Submit and evaluate a language-based learning activity.

**Request Body:**
```json
{
  "module_id": "uuid",
  "section_id": "uuid",
  "activity_type": "explanation",
  "user_response": "Compound interest is when you earn interest on both your principal and previously earned interest",
  "required_elements": {
    "use_own_words": true,
    "provide_examples": true,
    "explain_reasoning": true,
    "connect_to_experience": false
  }
}
```

**Required Fields:**
- `module_id` - Module UUID
- `activity_type` - One of: `articulation`, `hypothesis_writing`, `reflection`, `concept_mapping`, `explanation`
- `user_response` - User's written response
- `required_elements` - Object with boolean flags for required elements

**Optional Fields:**
- `section_id` - Section UUID

**Response (200):**
```json
{
  "activity_id": "uuid",
  "assessment": {
    "clarity_score": 8.5,
    "completeness_score": 7.0,
    "reasoning_quality": 8.0,
    "overall_score": 7.83
  },
  "feedback": "Good explanation. Consider adding examples.",
  "elements_completed": {
    "use_own_words": true,
    "provide_examples": true,
    "explain_reasoning": true,
    "connect_to_experience": false
  }
}
```

**Error Responses:**
- `400` - Missing required fields

## Error Codes

- `LEARNING_PERFORMANCE_INVALID` - Invalid performance data
- `MODULE_NOT_FOUND` - Module doesn't exist
- `REFLECTION_PROCESS_NOT_FOUND` - Reflection process doesn't exist
- `INVALID_STEP_NUMBER` - Step number out of range
- `HYPOTHESIS_NOT_FOUND` - Hypothesis doesn't exist


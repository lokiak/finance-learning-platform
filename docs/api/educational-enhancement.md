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
  "time_spent_minutes": 15,
  "engagement_score": 8,
  "comprehension_score": 7,
  "difficulty_rating": 3
}
```

**Response (201):**
```json
{
  "performance": {
    "id": "uuid",
    "user_id": "uuid",
    "module_id": "uuid",
    "time_spent_minutes": 15,
    "engagement_score": 8,
    "comprehension_score": 7,
    "difficulty_rating": 3,
    "created_at": "2024-01-01T00:00:00.000Z"
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

### GET /api/learning/adapt-content?module_id=:moduleId
Get adapted content recommendations for a module.

**Query Parameters:**
- `module_id` (required) - Module UUID

**Response (200):**
```json
{
  "adapted_content": {
    "module_id": "uuid",
    "recommended_path": "standard",
    "difficulty_adjustment": "none",
    "additional_resources": [],
    "estimated_time": 20
  }
}
```

### GET /api/learning/mastery?module_id=:moduleId
Get concept mastery level for a module.

**Query Parameters:**
- `module_id` (required) - Module UUID

**Response (200):**
```json
{
  "mastery": {
    "module_id": "uuid",
    "overall_mastery": 0.75,
    "concepts": [
      {
        "concept": "compound_interest",
        "mastery_level": 0.85,
        "last_assessed": "2024-01-01T00:00:00.000Z"
      }
    ]
  }
}
```

### GET /api/learning/path?module_id=:moduleId
Get recommended learning path for a module.

**Query Parameters:**
- `module_id` (required) - Module UUID

**Response (200):**
```json
{
  "path": {
    "module_id": "uuid",
    "recommended_path": "standard",
    "reasoning": "User shows good comprehension",
    "estimated_completion_time": 25
  }
}
```

### GET /api/learning/remediation?module_id=:moduleId
Get remediation path if user is struggling.

**Query Parameters:**
- `module_id` (required) - Module UUID

**Response (200):**
```json
{
  "remediation": {
    "module_id": "uuid",
    "needed": true,
    "focus_areas": ["compound_interest", "time_value"],
    "recommended_resources": [],
    "estimated_additional_time": 15
  }
}
```

## Predictive Wellness

### GET /api/wellness/predict-stress
Predict user stress level based on learning patterns.

**Response (200):**
```json
{
  "prediction": {
    "stress_level": "moderate",
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

### GET /api/wellness/predict-engagement?module_id=:moduleId
Predict engagement level for a module.

**Query Parameters:**
- `module_id` (required) - Module UUID

**Response (200):**
```json
{
  "engagement_prediction": {
    "module_id": "uuid",
    "predicted_engagement": 7.5,
    "confidence": 0.75,
    "factors": ["user_interest", "prerequisite_mastery"]
  }
}
```

### GET /api/wellness/success-probability?module_id=:moduleId
Calculate probability of module completion success.

**Query Parameters:**
- `module_id` (required) - Module UUID

**Response (200):**
```json
{
  "success_probability": {
    "module_id": "uuid",
    "probability": 0.82,
    "confidence": 0.70,
    "key_factors": [
      "strong_prerequisite_mastery",
      "good_time_availability"
    ]
  }
}
```

## Proactive Support

### POST /api/support/hint
Request a contextual hint.

**Request Body:**
```json
{
  "module_id": "uuid",
  "section_id": "uuid",
  "context": "struggling_with_concept"
}
```

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

### POST /api/support/encouragement
Trigger encouragement message.

**Request Body:**
```json
{
  "context": "module_completed"
}
```

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
  "milestone_type": "phase_completion",
  "milestone_data": {
    "phase": 1
  }
}
```

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

### GET /api/holistic/modules/:moduleId/readiness
Check if user is ready for a module.

**Path Parameters:**
- `moduleId` (required) - Module UUID

**Response (200):**
```json
{
  "readiness": {
    "module_id": "uuid",
    "can_proceed": true,
    "readiness_score": 0.85,
    "prerequisites_met": true,
    "recommendations": []
  }
}
```

## Reflective Thinking

### POST /api/reflection/start
Start a new reflective thinking process.

**Request Body:**
```json
{
  "module_id": "uuid",
  "section_id": "uuid",
  "problematic_situation": {
    "description": "I'm confused about compound interest calculations",
    "user_reaction": "confused",
    "engagement_level": 6
  }
}
```

**Response (201):**
```json
{
  "process": {
    "id": "uuid",
    "user_id": "uuid",
    "module_id": "uuid",
    "current_step": 1,
    "status": "in_progress",
    "created_at": "2024-01-01T00:00:00.000Z"
  }
}
```

### PUT /api/reflection/:processId/step/:stepNumber
Update a step in the reflection process.

**Path Parameters:**
- `processId` (required) - Process UUID
- `stepNumber` (required) - Step number (1-5)

**Request Body:**
```json
{
  "step_data": {
    "problem_definition": "I need to understand how interest compounds over multiple periods"
  }
}
```

**Response (200):**
```json
{
  "process": {
    "id": "uuid",
    "current_step": 2,
    "status": "in_progress"
  }
}
```

### POST /api/reflection/:processId/hypotheses
Add hypotheses to the reflection process.

**Path Parameters:**
- `processId` (required) - Process UUID

**Request Body:**
```json
{
  "hypotheses": [
    {
      "statement": "Compound interest grows exponentially",
      "reasoning": "Each period's interest is added to principal"
    }
  ]
}
```

**Response (200):**
```json
{
  "hypotheses": [
    {
      "id": "uuid",
      "statement": "Compound interest grows exponentially",
      "status": "pending"
    }
  ]
}
```

### POST /api/reflection/:processId/hypotheses/:hypothesisId/evaluate
Evaluate a hypothesis.

**Path Parameters:**
- `processId` (required) - Process UUID
- `hypothesisId` (required) - Hypothesis UUID

**Request Body:**
```json
{
  "evaluation": {
    "valid": true,
    "evidence": ["formula_confirmation", "example_verification"],
    "reasoning": "The formula confirms exponential growth"
  }
}
```

**Response (200):**
```json
{
  "hypothesis": {
    "id": "uuid",
    "status": "validated",
    "evaluation": { ... }
  }
}
```

### POST /api/reflection/:processId/test
Test the selected hypothesis.

**Path Parameters:**
- `processId` (required) - Process UUID

**Request Body:**
```json
{
  "test_data": {
    "scenario": "Calculate 10% interest on $1000 for 3 years",
    "result": "Expected: $1331, Actual: $1331",
    "conclusion": "Hypothesis confirmed"
  }
}
```

**Response (200):**
```json
{
  "process": {
    "id": "uuid",
    "current_step": 5,
    "status": "completed",
    "conclusion": "Hypothesis confirmed through testing"
  }
}
```

### GET /api/reflection/:processId
Get reflection process status.

**Path Parameters:**
- `processId` (required) - Process UUID

**Response (200):**
```json
{
  "process": {
    "id": "uuid",
    "current_step": 3,
    "status": "in_progress",
    "problematic_situation": { ... },
    "hypotheses": [ ... ],
    "created_at": "2024-01-01T00:00:00.000Z"
  }
}
```

### POST /api/reflection/habits-of-mind
Track habits of mind development.

**Request Body:**
```json
{
  "module_id": "uuid",
  "habit_type": "persistence",
  "demonstrated": true,
  "context": "worked_through_difficult_problem"
}
```

**Response (201):**
```json
{
  "habit": {
    "id": "uuid",
    "habit_type": "persistence",
    "demonstrated": true,
    "recorded_at": "2024-01-01T00:00:00.000Z"
  }
}
```

### POST /api/reflection/language-activity
Record language-based learning activity.

**Request Body:**
```json
{
  "module_id": "uuid",
  "activity_type": "explanation",
  "content": "I explained compound interest to a friend",
  "reflection": "Helped clarify my own understanding"
}
```

**Response (201):**
```json
{
  "activity": {
    "id": "uuid",
    "activity_type": "explanation",
    "recorded_at": "2024-01-01T00:00:00.000Z"
  }
}
```

## Error Codes

- `LEARNING_PERFORMANCE_INVALID` - Invalid performance data
- `MODULE_NOT_FOUND` - Module doesn't exist
- `REFLECTION_PROCESS_NOT_FOUND` - Reflection process doesn't exist
- `INVALID_STEP_NUMBER` - Step number out of range
- `HYPOTHESIS_NOT_FOUND` - Hypothesis doesn't exist


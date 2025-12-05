# Calculators & Goals API

Endpoints for financial calculators and goal management.

**Base Path**: `/api/calculators`, `/api/goals`

All endpoints require authentication.

## Calculator Endpoints

### GET /api/calculators
Get list of available calculator types.

**Response (200):**
```json
{
  "calculators": [
    {
      "type": "compound_growth",
      "name": "Compound Growth"
    },
    {
      "type": "budget_tracker",
      "name": "Budget Tracker"
    },
    {
      "type": "debt_payoff",
      "name": "Debt Payoff"
    },
    {
      "type": "emergency_fund",
      "name": "Emergency Fund"
    },
    {
      "type": "retirement_calculator",
      "name": "Retirement Calculator"
    },
    {
      "type": "mortgage_calculator",
      "name": "Mortgage Calculator"
    }
  ]
}
```

### POST /api/calculators/:calculatorType
Save a calculator calculation.

**Path Parameters:**
- `calculatorType` (required) - Calculator type (e.g., `compound_growth`, `budget_tracker`)

**Request Body:**
```json
{
  "calculator_name": "My Retirement Plan",
  "input_data": {
    "principal": 10000,
    "monthly_contribution": 500,
    "annual_rate": 7,
    "years": 30
  },
  "module_id": "uuid"
}
```

**Response (201):**
```json
{
  "calculator_data": {
    "id": "uuid",
    "user_id": "uuid",
    "calculator_type": "compound_growth",
    "calculator_name": "My Retirement Plan",
    "input_data": {},
    "output_data": {},
    "module_id": "uuid",
    "created_at": "2024-01-01T00:00:00.000Z"
  },
  "output_data": {
    "result": "computed"
  }
}
```

**Note:** Calculator computation logic is currently placeholder. `output_data.result` will be `"computed"` or `"recomputed"`.

### GET /api/calculators/saved
Get saved calculators.

**Query Parameters:**
- `calculator_type` (optional) - Filter by calculator type

**Response (200):**
```json
{
  "saved_calculators": [
    {
      "id": "uuid",
      "calculator_type": "compound_growth",
      "calculator_name": "My Retirement Plan",
      "input_data": {},
      "output_data": {},
      "created_at": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### GET /api/calculators/:calculatorId
Get a specific saved calculator.

**Path Parameters:**
- `calculatorId` (required) - Calculator UUID

**Response (200):**
```json
{
  "calculator_data": {
    "id": "uuid",
    "calculator_type": "compound_growth",
    "calculator_name": "My Retirement Plan",
    "input_data": {},
    "output_data": {},
    "created_at": "2024-01-01T00:00:00.000Z"
  }
}
```

**Error Responses:**
- `404` - Calculator not found

### PUT /api/calculators/:calculatorId
Update a saved calculator.

**Path Parameters:**
- `calculatorId` (required) - Calculator UUID

**Request Body:**
```json
{
  "input_data": {
    "principal": 15000,
    "monthly_contribution": 600
  }
}
```

**Response (200):**
```json
{
  "calculator_data": {
    "id": "uuid",
    "input_data": {},
    "output_data": {
      "result": "recomputed"
    }
  },
  "output_data": {
    "result": "recomputed"
  }
}
```

### DELETE /api/calculators/:calculatorId
Delete a saved calculator.

**Path Parameters:**
- `calculatorId` (required) - Calculator UUID

**Response (200):**
```json
{
  "success": true
}
```

## Goal Endpoints

### GET /api/goals
Get user goals.

**Response (200):**
```json
{
  "goals": [
    {
      "id": "uuid",
      "user_id": "uuid",
      "goal_type": "emergency_fund",
      "title": "Build Emergency Fund",
      "description": "Save 6 months of expenses",
      "target_amount": 15000.00,
      "target_date": "2024-12-31T00:00:00.000Z",
      "current_progress": 5000.00,
      "status": "active",
      "milestones": null,
      "created_at": "2024-01-01T00:00:00.000Z",
      "updated_at": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### POST /api/goals
Create a new goal.

**Request Body:**
```json
{
  "goal_type": "emergency_fund",
  "title": "Build Emergency Fund",
  "description": "Save 6 months of expenses",
  "target_amount": 15000.00,
  "target_date": "2024-12-31"
}
```

**Response (201):**
```json
{
  "goal": {
    "id": "uuid",
    "user_id": "uuid",
    "goal_type": "emergency_fund",
    "title": "Build Emergency Fund",
    "description": "Save 6 months of expenses",
    "target_amount": 15000.00,
    "target_date": "2024-12-31T00:00:00.000Z",
    "current_progress": 0.00,
    "status": "active",
    "created_at": "2024-01-01T00:00:00.000Z"
  }
}
```

### PUT /api/goals/:goalId
Update a goal.

**Path Parameters:**
- `goalId` (required) - Goal UUID

**Request Body:**
```json
{
  "title": "Build Emergency Fund - Updated",
  "current_progress": 7500.00,
  "target_amount": 20000.00
}
```

**Response (200):**
```json
{
  "goal": {
    "id": "uuid",
    "title": "Build Emergency Fund - Updated",
    "current_progress": 7500.00,
    "target_amount": 20000.00,
    "updated_at": "2024-01-02T00:00:00.000Z"
  }
}
```

**Note:** Any field can be updated. `target_date` should be in ISO format if provided.

### DELETE /api/goals/:goalId
Delete a goal.

**Path Parameters:**
- `goalId` (required) - Goal UUID

**Response (200):**
```json
{
  "success": true
}
```

## Error Codes

- `CALCULATOR_NOT_FOUND` - Calculator doesn't exist
- `GOAL_NOT_FOUND` - Goal doesn't exist
- `VALIDATION_ERROR` - Invalid data


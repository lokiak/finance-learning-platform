# Backend API Documentation

## Overview

The Finance Learning Platform backend is a REST API built with Express, TypeScript, and Prisma ORM. It provides endpoints for user authentication, module management, progress tracking, calculators, goals, achievements, and AI interactions.

**Base URL:** `http://localhost:3000/api`

## Authentication

All endpoints except `/api/auth/register` and `/api/auth/login` require authentication via JWT token.

### Headers
```
Authorization: Bearer <jwt_token>
```

## API Endpoints

### Authentication Endpoints

#### POST /api/auth/register
Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123",
  "name": "John Doe"
}
```

**Response (201):**
```json
{
  "token": "jwt_token_here",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z",
    "last_login": "2024-01-01T00:00:00.000Z",
    "profile_completed": false
  }
}
```

**Validation:**
- Email must be valid format
- Password: min 8 chars, must contain uppercase, lowercase, and number
- Name: 1-255 characters

#### POST /api/auth/login
Authenticate an existing user.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123"
}
```

**Response (200):**
```json
{
  "token": "jwt_token_here",
  "user": { ...user_object }
}
```

#### GET /api/auth/me
Get current authenticated user information.

**Response (200):**
```json
{
  "user": {
    ...user_object,
    "profile": {
      "id": "uuid",
      "age": 28,
      "current_income": 75000.00,
      "financial_goals": ["Save for house", "Retirement"],
      "risk_tolerance": "moderate",
      "has_debt": true,
      "has_emergency_fund": false
    }
  }
}
```

#### POST /api/auth/logout
Logout current user (client-side token removal).

**Response (200):**
```json
{
  "success": true
}
```

### User Endpoints

#### GET /api/users/profile
Get user profile information.

**Response (200):**
```json
{
  "profile": {
    "id": "uuid",
    "user_id": "uuid",
    "age": 28,
    "current_income": 75000.00,
    "financial_goals": ["Save for house"],
    "risk_tolerance": "moderate",
    "has_debt": true,
    "has_emergency_fund": false,
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
}
```

#### PUT /api/users/profile
Update user profile.

**Request Body:**
```json
{
  "age": 28,
  "current_income": 75000.00,
  "financial_goals": ["Save for house", "Retirement"],
  "risk_tolerance": "moderate",
  "has_debt": true,
  "has_emergency_fund": false
}
```

**Response (200):**
```json
{
  "profile": { ...updated_profile }
}
```

#### GET /api/users/dashboard
Get comprehensive dashboard data.

**Response (200):**
```json
{
  "overview": {
    "total_progress": 45,
    "modules_completed": 8,
    "total_modules": 17,
    "time_invested": 340,
    "current_phase": 2
  },
  "recent_activity": [
    {
      "type": "module_completed",
      "title": "Budgeting Fundamentals",
      "timestamp": "2024-01-01T00:00:00.000Z",
      "module_id": "uuid"
    }
  ],
  "next_steps": [],
  "achievements": [
    {
      "id": "uuid",
      "title": "First Module Complete",
      "description": "Completed your first module",
      "earned_at": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### Module Endpoints

#### GET /api/modules
List all modules with user progress.

**Query Parameters:**
- `phase` (optional): Filter by phase number

**Response (200):**
```json
{
  "modules": [
    {
      "id": "uuid",
      "phase_number": 1,
      "module_number": 1,
      "title": "Your Money Story",
      "description": "Understand your relationship with money...",
      "estimated_duration": 45,
      "order_index": 1,
      "prerequisites": [],
      "created_at": "2024-01-01T00:00:00.000Z",
      "progress": {
        "status": "in_progress",
        "progress_percentage": 50,
        "started_at": "2024-01-01T00:00:00.000Z",
        "completed_at": null,
        "last_accessed": "2024-01-02T00:00:00.000Z",
        "time_spent_minutes": 25
      },
      "is_locked": false
    }
  ]
}
```

#### GET /api/modules/:moduleId
Get detailed module information with content sections.

**Response (200):**
```json
{
  "module": {
    ...module_object,
    "content": [
      {
        "id": "uuid",
        "module_id": "uuid",
        "section_number": 1,
        "section_title": "Understanding Your Money Mindset",
        "content_type": "text",
        "content_data": {
          "body": "Your relationship with money...",
          "key_takeaways": ["Point 1", "Point 2"]
        },
        "order_index": 1,
        "created_at": "2024-01-01T00:00:00.000Z"
      }
    ]
  },
  "progress": { ...progress_object }
}
```

### Progress Endpoints

#### POST /api/progress/module/:moduleId/start
Start or resume a module.

**Response (200):**
```json
{
  "progress": {
    "id": "uuid",
    "user_id": "uuid",
    "module_id": "uuid",
    "status": "in_progress",
    "progress_percentage": 0,
    "started_at": "2024-01-01T00:00:00.000Z",
    "completed_at": null,
    "last_accessed": "2024-01-01T00:00:00.000Z",
    "time_spent_minutes": 0
  }
}
```

#### PUT /api/progress/module/:moduleId
Update module progress.

**Request Body:**
```json
{
  "progress_percentage": 75,
  "time_spent_minutes": 45
}
```

**Response (200):**
```json
{
  "progress": { ...updated_progress }
}
```

#### POST /api/progress/section/:sectionId/complete
Mark a content section as completed.

**Request Body:**
```json
{
  "notes": "Key insights from this section..."
}
```

**Response (200):**
```json
{
  "section_progress": {
    "id": "uuid",
    "user_id": "uuid",
    "module_content_id": "uuid",
    "completed": true,
    "completed_at": "2024-01-01T00:00:00.000Z",
    "notes": "Key insights..."
  }
}
```

#### GET /api/progress/summary
Get overall progress summary.

**Response (200):**
```json
{
  "phases": [
    {
      "phase_number": 1,
      "phase_title": "Phase 1",
      "modules_completed": 5,
      "total_modules": 5,
      "progress_percentage": 100
    }
  ],
  "total_progress": 47,
  "time_invested": 340,
  "modules_completed": 8,
  "total_modules": 17
}
```

### Calculator Endpoints

#### GET /api/calculators
List available calculator types.

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
    }
  ]
}
```

#### POST /api/calculators/:calculatorType
Save a calculator with inputs and computed outputs.

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
  "module_id": "uuid (optional)"
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
    "input_data": { ...inputs },
    "output_data": { ...computed_results },
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z",
    "module_id": "uuid"
  },
  "output_data": { ...computed_results }
}
```

#### GET /api/calculators/saved
Get user's saved calculators.

**Query Parameters:**
- `calculator_type` (optional): Filter by calculator type

**Response (200):**
```json
{
  "saved_calculators": [
    {
      ...calculator_data_object
    }
  ]
}
```

#### GET /api/calculators/:calculatorId
Get specific saved calculator.

**Response (200):**
```json
{
  "calculator_data": { ...calculator_object }
}
```

#### PUT /api/calculators/:calculatorId
Update calculator inputs and recompute.

**Request Body:**
```json
{
  "input_data": { ...updated_inputs }
}
```

**Response (200):**
```json
{
  "calculator_data": { ...updated_calculator },
  "output_data": { ...recomputed_results }
}
```

#### DELETE /api/calculators/:calculatorId
Delete a saved calculator.

**Response (200):**
```json
{
  "success": true
}
```

### Goal Endpoints

#### GET /api/goals
Get all user goals.

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
      "target_amount": 18000.00,
      "target_date": "2025-12-31",
      "current_progress": 5000.00,
      "status": "active",
      "created_at": "2024-01-01T00:00:00.000Z",
      "updated_at": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### POST /api/goals
Create a new financial goal.

**Request Body:**
```json
{
  "goal_type": "emergency_fund",
  "title": "Build Emergency Fund",
  "description": "Save 6 months of expenses",
  "target_amount": 18000.00,
  "target_date": "2025-12-31"
}
```

**Response (201):**
```json
{
  "goal": { ...created_goal }
}
```

#### PUT /api/goals/:goalId
Update an existing goal.

**Request Body:**
```json
{
  "current_progress": 7500.00,
  "status": "active"
}
```

**Response (200):**
```json
{
  "goal": { ...updated_goal }
}
```

#### DELETE /api/goals/:goalId
Delete a goal.

**Response (200):**
```json
{
  "success": true
}
```

### Achievement Endpoints

#### GET /api/achievements
Get earned and available achievements.

**Response (200):**
```json
{
  "achievements": [
    {
      "id": "uuid",
      "user_id": "uuid",
      "achievement_type": "first_module",
      "title": "Getting Started",
      "description": "Completed your first module",
      "earned_at": "2024-01-01T00:00:00.000Z",
      "metadata": null
    }
  ],
  "available": []
}
```

### AI Endpoints

#### POST /api/ai/chat
Send a message to AI assistant (placeholder implementation).

**Request Body:**
```json
{
  "message": "Can you explain compound interest?",
  "conversation_id": "uuid (optional)",
  "module_id": "uuid (optional)",
  "context": "Module 6 - Investment Foundations"
}
```

**Response (200):**
```json
{
  "response": "This is a placeholder AI response...",
  "conversation_id": "uuid"
}
```

#### GET /api/ai/conversations
Get user's AI conversation history.

**Response (200):**
```json
{
  "conversations": [
    {
      "id": "uuid",
      "user_id": "uuid",
      "module_id": "uuid",
      "conversation_context": "Investment questions",
      "messages": [
        {
          "role": "user",
          "content": "Message text",
          "timestamp": "2024-01-01T00:00:00.000Z"
        }
      ],
      "created_at": "2024-01-01T00:00:00.000Z",
      "updated_at": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### GET /api/ai/prompt-templates
Get available AI prompt templates.

**Query Parameters:**
- `module_id` (optional): Filter by module

**Response (200):**
```json
{
  "templates": [
    {
      "id": "1",
      "module_id": null,
      "title": "Explain a concept",
      "prompt": "Can you explain {concept} in simple terms?",
      "category": "general"
    }
  ]
}
```

## Error Responses

All errors follow this format:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": { } // Only in development
  }
}
```

### Common Error Codes

- `AUTH_INVALID_CREDENTIALS` (401): Invalid email or password
- `AUTH_TOKEN_INVALID` (401): Invalid JWT token
- `AUTH_TOKEN_EXPIRED` (401): JWT token has expired
- `AUTH_UNAUTHORIZED` (401): No authentication provided
- `AUTH_USER_EXISTS` (409): Email already registered
- `VALIDATION_ERROR` (400): Input validation failed
- `RESOURCE_NOT_FOUND` (404): Requested resource not found
- `MODULE_NOT_FOUND` (404): Module not found
- `CALCULATOR_NOT_FOUND` (404): Calculator not found
- `GOAL_NOT_FOUND` (404): Goal not found
- `INTERNAL_SERVER_ERROR` (500): Server error

## Rate Limiting

- Standard endpoints: 100 requests per 15 minutes
- AI endpoints: 20 requests per 15 minutes

## Database Schema

See Prisma schema at `packages/backend/prisma/schema.prisma` for complete database structure.

Key models:
- User: User accounts
- UserProfile: Extended user information
- Module: Course modules
- ModuleContent: Module content sections
- UserProgress: Module progress tracking
- SectionProgress: Section completion tracking
- CalculatorData: Saved calculator results
- UserGoal: Financial goals
- Achievement: Earned achievements
- AIConversation: AI chat history

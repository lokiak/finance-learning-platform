# Users & Profile API

Endpoints for user profile management and dashboard data.

**Base Path**: `/api/users`

All endpoints require authentication.

## Endpoints

### GET /api/users/profile
Get user profile information.

**Response (200):**
```json
{
  "profile": {
    "id": "uuid",
    "user_id": "uuid",
    "age": 28,
    "current_income": 75000.00,
    "financial_goals": ["Save for house", "Retirement"],
    "risk_tolerance": "moderate",
    "has_debt": true,
    "has_emergency_fund": false,
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
}
```

**Note:** If no profile exists, an empty profile is created automatically.

### PUT /api/users/profile
Update user profile information.

**Request Body:**
```json
{
  "age": 29,
  "current_income": 80000.00,
  "financial_goals": ["Save for house", "Retirement", "Travel"],
  "risk_tolerance": "moderate",
  "has_debt": false,
  "has_emergency_fund": true
}
```

**Response (200):**
```json
{
  "profile": {
    "id": "uuid",
    "user_id": "uuid",
    "age": 29,
    "current_income": 80000.00,
    "financial_goals": ["Save for house", "Retirement", "Travel"],
    "risk_tolerance": "moderate",
    "has_debt": false,
    "has_emergency_fund": true,
    "updated_at": "2024-01-02T00:00:00.000Z"
  }
}
```

**Validation:**
- `age`: Optional, integer, 18-120
- `current_income`: Optional, decimal, >= 0
- `financial_goals`: Optional, array of strings
- `risk_tolerance`: Optional, one of: `conservative`, `moderate`, `aggressive`
- `has_debt`: Optional, boolean
- `has_emergency_fund`: Optional, boolean

### GET /api/users/dashboard
Get dashboard data including progress summary, recent activity, and achievements.

**Response (200):**
```json
{
  "phases": [
    {
      "phase_number": 1,
      "phase_title": "Phase 1",
      "modules_completed": 3,
      "total_modules": 5,
      "progress_percentage": 60
    }
  ],
  "total_progress": 35,
  "time_invested": 450,
  "modules_completed": 6,
  "total_modules": 17,
  "recent_activity": [],
  "achievements": []
}
```

**Response Fields:**
- `phases` - Array of phase progress data
- `total_progress` - Overall completion percentage (0-100)
- `time_invested` - Total time spent in minutes
- `modules_completed` - Number of completed modules
- `total_modules` - Total number of modules
- `recent_activity` - Recent user activity (if implemented)
- `achievements` - User achievements (if implemented)

## Error Codes

- `USER_NOT_FOUND` - User doesn't exist
- `VALIDATION_ERROR` - Invalid profile data


# Modules & Progress API

Endpoints for learning modules and progress tracking.

**Base Path**: `/api/modules`, `/api/progress`

All endpoints require authentication.

## Module Endpoints

### GET /api/modules
Get all modules with user progress.

**Query Parameters:**
- `phase` (optional) - Filter by phase number (1-4)

**Response (200):**
```json
{
  "modules": [
    {
      "id": "uuid",
      "phase_number": 1,
      "module_number": 1,
      "title": "Your Money Story",
      "description": "Connect emotionally to why this matters",
      "estimated_duration": 20,
      "order_index": 1,
      "prerequisites": [],
      "reflection_required": "none",
      "created_at": "2024-01-01T00:00:00.000Z",
      "progress": {
        "status": "in_progress",
        "progress_percentage": 50,
        "started_at": "2024-01-01T00:00:00.000Z",
        "completed_at": null,
        "last_accessed": "2024-01-02T00:00:00.000Z",
        "time_spent_minutes": 10
      },
      "is_locked": false
    }
  ]
}
```

**Response Fields:**
- `modules` - Array of modules with progress
- `progress` - User progress for the module (null if not started)
- `is_locked` - Whether module is locked (currently always false)

### GET /api/modules/:moduleId
Get module details with content.

**Path Parameters:**
- `moduleId` (required) - Module UUID

**Response (200):**
```json
{
  "module": {
    "id": "uuid",
    "phase_number": 1,
    "module_number": 1,
    "title": "Your Money Story",
    "description": "Connect emotionally to why this matters",
    "estimated_duration": 20,
    "order_index": 1,
    "prerequisites": [],
    "reflection_required": "none",
    "created_at": "2024-01-01T00:00:00.000Z",
    "content": [
      {
        "id": "uuid",
        "section_number": 1,
        "section_title": "Introduction",
        "content_type": "text",
        "content_data": {},
        "order_index": 1
      }
    ]
  },
  "progress": {
    "id": "uuid",
    "status": "in_progress",
    "progress_percentage": 50,
    "started_at": "2024-01-01T00:00:00.000Z",
    "completed_at": null,
    "last_accessed": "2024-01-02T00:00:00.000Z",
    "time_spent_minutes": 10
  }
}
```

**Error Responses:**
- `404` - Module not found

## Progress Endpoints

### POST /api/progress/module/:moduleId/start
Start a module (creates or updates progress record).

**Path Parameters:**
- `moduleId` (required) - Module UUID

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

**Note:** If progress already exists, updates `status` to `in_progress` and `last_accessed` timestamp.

### PUT /api/progress/module/:moduleId
Update module progress.

**Path Parameters:**
- `moduleId` (required) - Module UUID

**Request Body:**
```json
{
  "progress_percentage": 75,
  "time_spent_minutes": 15
}
```

**Response (200):**
```json
{
  "progress": {
    "id": "uuid",
    "status": "in_progress",
    "progress_percentage": 75,
    "time_spent_minutes": 15,
    "last_accessed": "2024-01-01T00:00:00.000Z"
  }
}
```

**Note:** If `progress_percentage` is 100, status is automatically set to `completed` and `completed_at` is set.

### POST /api/progress/section/:sectionId/complete
Mark a section as completed.

**Path Parameters:**
- `sectionId` (required) - Section (module_content) UUID

**Request Body:**
```json
{
  "notes": "Great section on compound interest"
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
    "notes": "Great section on compound interest"
  }
}
```

### GET /api/progress/summary
Get overall progress summary.

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
    },
    {
      "phase_number": 2,
      "phase_title": "Phase 2",
      "modules_completed": 0,
      "total_modules": 4,
      "progress_percentage": 0
    }
  ],
  "total_progress": 35,
  "time_invested": 450,
  "modules_completed": 6,
  "total_modules": 17
}
```

**Response Fields:**
- `phases` - Progress for each phase (1-4)
- `total_progress` - Overall completion percentage (0-100)
- `time_invested` - Total time spent in minutes
- `modules_completed` - Number of completed modules
- `total_modules` - Total number of modules

## Error Codes

- `MODULE_NOT_FOUND` - Module doesn't exist
- `VALIDATION_ERROR` - Invalid progress data


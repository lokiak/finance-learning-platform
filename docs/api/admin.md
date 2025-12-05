# Admin API

Administrative endpoints for system analytics and monitoring.

**Base Path**: `/api/admin`

**Authentication**: All endpoints require admin role.

## Overview

Admin endpoints provide comprehensive analytics and insights into:
- User engagement and activity
- Learning performance metrics
- Prediction accuracy
- Adaptation effectiveness
- Support utilization
- Reflection process usage

## Analytics Endpoints

### GET /api/admin/analytics
Get complete analytics dashboard data.

**Response (200):**
```json
{
  "analytics": {
    "overview": {
      "totalUsers": 150,
      "activeUsers": 45,
      "totalModules": 17,
      "completedModules": 234,
      "averageCompletionRate": 68.5
    },
    "predictions": {
      "stressPredictionAccuracy": {
        "totalPredictions": 1200,
        "predictionsWithOutcomes": 450,
        "averageAccuracy": 71.5,
        "accuracyByLevel": [
          { "level": 3, "accuracy": 75.2, "count": 120 },
          { "level": 5, "accuracy": 68.9, "count": 200 }
        ]
      },
      "engagementPredictions": {
        "totalPredictions": 0,
        "averageConfidence": 0
      }
    },
    "adaptations": {
      "learningStyleDetection": {
        "totalDetections": 150,
        "detectionConfidence": {
          "average": 78.5,
          "distribution": [
            { "range": "0-0.5", "count": 5 },
            { "range": "0.5-0.7", "count": 30 },
            { "range": "0.7-0.9", "count": 80 },
            { "range": "0.9-1.0", "count": 35 }
          ]
        }
      },
      "masteryImprovements": {
        "totalConcepts": 450,
        "averageMasteryGain": 72.3,
        "masteryDistribution": [
          { "range": "0-25", "count": 50 },
          { "range": "25-50", "count": 120 },
          { "range": "50-75", "count": 180 },
          { "range": "75-100", "count": 100 }
        ]
      },
      "adaptivePathUsage": {
        "fast": 120,
        "standard": 450,
        "thorough": 280,
        "remedial": 40
      }
    },
    "support": {
      "hints": {
        "totalGenerated": 320,
        "displayed": 280,
        "acknowledged": 200,
        "helpful": 156,
        "notHelpful": 44,
        "effectivenessRate": 78.0
      },
      "encouragements": {
        "totalGenerated": 150,
        "displayed": 140,
        "acknowledged": 120
      },
      "breaks": {
        "totalSuggested": 60,
        "taken": 39,
        "takenRate": 65.0
      },
      "celebrations": {
        "totalGenerated": 30,
        "displayed": 30
      }
    },
    "engagement": {
      "averageSessionLength": 28.5,
      "averageTimePerModule": 25.3,
      "dropOffPoints": [
        { "moduleId": "uuid", "moduleTitle": "Module 1", "dropOffRate": 15.2 }
      ],
      "completionRates": [
        { "moduleId": "uuid", "moduleTitle": "Module 1", "completionRate": 85.5 }
      ]
    },
    "reflection": {
      "totalProcesses": 340,
      "completedProcesses": 280,
      "completionRate": 82.35,
      "averageStepsCompleted": 4.2,
      "processesByStep": [
        { "step": 1, "count": 340 },
        { "step": 2, "count": 320 },
        { "step": 3, "count": 300 },
        { "step": 4, "count": 290 },
        { "step": 5, "count": 280 }
      ]
    },
    "performance": {
      "averageAssessmentScore": 75.5,
      "averageTimeSpent": 25.3,
      "errorRate": 12.5,
      "engagementScore": 7.2
    }
  }
}
```

### GET /api/admin/analytics/overview
Get high-level overview metrics.

**Response (200):**
```json
{
  "overview": {
    "totalUsers": 150,
    "activeUsers": 45,
    "totalModules": 17,
    "modulesInProgress": 89,
    "modulesCompleted": 234,
    "averageCompletionRate": 0.68
  }
}
```

### GET /api/admin/analytics/predictions
Get prediction accuracy metrics.

**Response (200):**
```json
{
  "predictions": {
    "totalPredictions": 1200,
    "accuracyRate": 0.75,
    "stressPredictions": {
      "total": 450,
      "accurate": 320,
      "accuracy": 0.71
    },
    "engagementPredictions": {
      "total": 750,
      "accurate": 580,
      "accuracy": 0.77
    },
    "successProbability": {
      "total": 890,
      "accurate": 670,
      "accuracy": 0.75
    }
  }
}
```

### GET /api/admin/analytics/adaptations
Get adaptation effectiveness metrics.

**Response (200):**
```json
{
  "adaptations": {
    "totalAdaptations": 890,
    "adaptationTypes": {
      "fast": 120,
      "standard": 450,
      "thorough": 280,
      "remedial": 40
    },
    "effectiveness": {
      "improved_completion": 0.65,
      "improved_engagement": 0.72,
      "improved_mastery": 0.68
    },
    "userSatisfaction": 0.78
  }
}
```

### GET /api/admin/analytics/support
Get support intervention metrics.

**Response (200):**
```json
{
  "support": {
    "totalInterventions": 560,
    "interventionTypes": {
      "hint": 320,
      "encouragement": 150,
      "break_suggestion": 60,
      "celebration": 30
    },
    "utilizationRate": 0.42,
    "effectiveness": {
      "hint_helpfulness": 0.78,
      "encouragement_impact": 0.85,
      "break_acceptance": 0.65
    },
    "averageResponseTime": 2.3
  }
}
```

### GET /api/admin/analytics/engagement
Get user engagement metrics.

**Response (200):**
```json
{
  "engagement": {
    "averageEngagementScore": 7.2,
    "engagementTrend": "increasing",
    "peakLearningTimes": ["morning", "evening"],
    "averageSessionDuration": 28,
    "sessionsPerWeek": 4.2,
    "retentionRate": 0.68
  }
}
```

### GET /api/admin/analytics/reflection
Get reflective thinking process metrics.

**Response (200):**
```json
{
  "reflection": {
    "totalProcesses": 340,
    "completedProcesses": 280,
    "completionRate": 0.82,
    "averageStepsCompleted": 4.2,
    "habitsOfMindTracked": 890,
    "languageActivities": 450,
    "averageProcessDuration": 15
  }
}
```

### GET /api/admin/analytics/performance
Get learning performance metrics.

**Response (200):**
```json
{
  "performance": {
    "averageMasteryLevel": 0.72,
    "conceptMasteryDistribution": {
      "high": 0.35,
      "medium": 0.45,
      "low": 0.20
    },
    "learningStyleDistribution": {
      "visual": 0.40,
      "auditory": 0.25,
      "kinesthetic": 0.35
    },
    "averageTimeToMastery": 12.5,
    "remediationRate": 0.15
  }
}
```

## Access Control

All admin endpoints require:
1. Valid JWT authentication token
2. User role set to `admin`

**Error Responses:**

**401 Unauthorized** - Missing or invalid token:
```json
{
  "error": {
    "code": "AUTH_UNAUTHORIZED",
    "message": "Unauthorized access"
  }
}
```

**403 Forbidden** - User is not an admin:
```json
{
  "error": {
    "code": "FORBIDDEN",
    "message": "Admin access required"
  }
}
```

## Rate Limiting

Admin endpoints may have different rate limits in production:
- Analytics endpoints: 60 requests/minute per admin user
- Consider caching analytics data for 5-15 minutes

## Data Freshness

Analytics data is calculated in real-time. For large datasets, consider:
- Implementing caching with ETag support
- Background job processing for heavy calculations
- Pre-aggregated metrics for frequently accessed data

## Best Practices

1. **Caching**: Cache analytics responses on the client side
2. **Pagination**: For detailed user lists, implement pagination
3. **Filtering**: Use date ranges for time-based analytics
4. **Export**: Consider adding CSV/JSON export endpoints

## Future Enhancements

- Real-time analytics via WebSocket
- Custom date range filtering
- Comparative analytics (period-over-period)
- User segmentation analytics
- Export functionality (CSV, PDF reports)


# Shared Package Documentation

## Overview

The `@finance-platform/shared` package contains all shared TypeScript definitions, validators, and constants used across the frontend and backend.

**Location:** `/packages/shared/`

## Package Structure

```
packages/shared/
├── src/
│   ├── types/          # TypeScript interfaces and types
│   ├── validators/     # Zod validation schemas
│   ├── constants/      # Application constants
│   └── index.ts        # Main export file
├── package.json
└── tsconfig.json
```

## Types

### User Types (`types/user.ts`)

#### Core Interfaces
- `User`: Basic user account information
- `UserProfile`: Extended profile with financial information
- `UserWithProfile`: Combined user and profile data

#### Request/Response Types
- `RegisterRequest`: User registration payload
- `LoginRequest`: User login payload
- `AuthResponse`: Authentication response with JWT
- `UpdateProfileRequest`: Profile update payload

#### Enums
- `RiskTolerance`: 'conservative' | 'moderate' | 'aggressive'

### Module Types (`types/module.ts`)

#### Core Interfaces
- `Module`: Course module definition
- `ModuleContent`: Individual content sections within a module
- `ModuleWithContent`: Module with all content sections
- `ModuleWithProgress`: Module with user progress data

#### Content Types
- `ContentType`: 'text' | 'video' | 'interactive' | 'calculator' | 'ai_prompt'
- `ContentData`: Flexible JSON structure for different content types

#### Progress Types
- `ProgressStatus`: 'not_started' | 'in_progress' | 'completed'

### Progress Types (`types/progress.ts`)

#### Core Interfaces
- `UserProgress`: Module-level progress tracking
- `SectionProgress`: Section-level completion tracking
- `ProgressSummary`: Overall progress across all phases
- `PhaseProgress`: Progress within a specific phase
- `DashboardData`: Complete dashboard data structure

#### Dashboard Components
- `RecentActivity`: Recent user actions
- `NextStep`: Suggested next actions
- `AchievementSummary`: Achievement display data

### Calculator Types (`types/calculator.ts`)

#### Generic Calculator Types
- `CalculatorData`: Saved calculator with inputs/outputs
- `SaveCalculatorRequest`: Request to save calculator
- `UpdateCalculatorRequest`: Request to update calculator

#### Specific Calculator Types

**Compound Growth Calculator**
- `CompoundGrowthInput`: Principal, contributions, rate, years
- `CompoundGrowthOutput`: Final amount, contributions, interest, yearly breakdown

**Financial Snapshot**
- `FinancialSnapshotInput`: Assets and liabilities arrays
- `FinancialSnapshotOutput`: Net worth and categorized totals
- `AssetItem`: Individual asset with category
- `LiabilityItem`: Individual liability with category

**Budget Tracker**
- `BudgetTrackerInput`: Income and expenses
- `BudgetTrackerOutput`: Total expenses, remaining, savings rate
- `ExpenseItem`: Categorized expense with fixed/variable flag

**Debt Payoff Calculator**
- `DebtPayoffInput`: Debts array, payment amount, strategy
- `DebtPayoffOutput`: Payoff timeline, total interest, monthly breakdown
- `DebtItem`: Individual debt with balance, APR, minimum payment

**Emergency Fund**
- `EmergencyFundInput`: Monthly expenses, target, current savings
- `EmergencyFundOutput`: Target amount, months to goal, progress

**Investment Growth**
- `InvestmentGrowthInput`: Investment amount, contributions, return, inflation
- `InvestmentGrowthOutput`: Final amount, real value, yearly breakdown

**Mortgage Calculator**
- `MortgageInput`: Home price, down payment, term, rate, taxes
- `MortgageOutput`: Monthly payment, total interest, amortization schedule
- `AmortizationItem`: Monthly breakdown of principal/interest/balance

**Retirement Calculator**
- `RetirementInput`: Ages, savings, contributions, expenses
- `RetirementOutput`: Projected savings, required savings, on-track status

### Goal Types (`types/goal.ts`)

#### Core Interfaces
- `UserGoal`: Financial goal with target and progress
- `CreateGoalRequest`: Request to create new goal
- `UpdateGoalRequest`: Request to update existing goal

#### Enums
- `GoalStatus`: 'active' | 'completed' | 'paused' | 'abandoned'

### Achievement Types (`types/achievement.ts`)

#### Core Interfaces
- `Achievement`: Earned achievement
- `AchievementDefinition`: Achievement criteria definition
- `AchievementResponse`: List of earned and available achievements
- `AvailableAchievement`: Achievement not yet earned

### AI Types (`types/ai.ts`)

#### Core Interfaces
- `AIConversation`: Conversation with message history
- `AIMessage`: Individual message in conversation
- `ChatRequest`: Request to send message
- `ChatResponse`: AI response
- `PromptTemplate`: Pre-defined AI prompts for modules

### API Types (`types/api.ts`)

#### Core Interfaces
- `ApiResponse<T>`: Generic API response wrapper
- `ApiError`: Structured error response
- `PaginatedResponse<T>`: Paginated list response
- `ApiErrorResponse`: Error-only response

## Validators

All validators use Zod for runtime type checking and validation.

### Auth Validators (`validators/auth.ts`)

#### Schemas
- `registerSchema`: Email, password (8+ chars, uppercase, lowercase, number), name
- `loginSchema`: Email and password
- `updateProfileSchema`: Age, income, goals, risk tolerance, debt status

### Financial Validators (`validators/financial.ts`)

#### Calculator Schemas
Each calculator has input validation:
- `compoundGrowthSchema`: Non-negative values, rate <= 100%
- `financialSnapshotSchema`: Asset and liability arrays with categories
- `budgetTrackerSchema`: Non-negative income and expenses
- `debtPayoffSchema`: At least one debt, strategy validation
- `emergencyFundSchema`: 1-24 months target range
- `investmentGrowthSchema`: Return and inflation rate limits
- `mortgageSchema`: Positive home price, term 1-50 years
- `retirementSchema`: Age validation, retirement age > current age

#### Generic Calculator Schemas
- `saveCalculatorSchema`: Calculator type, name, input data
- `updateCalculatorSchema`: Input data update

### Input Validators (`validators/input.ts`)

#### Schemas
- `updateProgressSchema`: Progress percentage 0-100, time spent
- `completeSectionSchema`: Optional notes <= 5000 chars
- `createGoalSchema`: Title, type, optional amount and date
- `updateGoalSchema`: Partial goal updates
- `chatRequestSchema`: Message <= 2000 chars, optional context
- `uuidSchema`: UUID format validation

## Constants

### Error Constants (`constants/errors.ts`)

#### Error Codes
Defines all application error codes:
- **Authentication**: Invalid credentials, user exists, token invalid/expired
- **Validation**: Validation error, invalid input, missing fields
- **Resources**: Not found errors for various entities
- **Permissions**: Permission denied, access forbidden
- **Modules**: Module locked, prerequisites not met
- **Rate Limiting**: Rate limit exceeded
- **Server**: Internal errors, database errors, service unavailable

#### Error Messages
Human-readable messages for each error code.

### Module Constants (`constants/modules.ts`)

#### Phase Definitions
- `PHASES`: Defines all 4 course phases with titles and descriptions

#### Calculator Types
- `CALCULATOR_TYPES`: String constants for all 18+ calculator types

#### Achievement Types
- `ACHIEVEMENT_TYPES`: Defines achievement type identifiers

#### Goal Types
- `GOAL_TYPES`: Common financial goal categories

### Limit Constants (`constants/limits.ts`)

#### String Limits
- MAX_NAME_LENGTH: 255
- MAX_EMAIL_LENGTH: 255
- MAX_DESCRIPTION_LENGTH: 1000
- MAX_NOTES_LENGTH: 5000
- MAX_MESSAGE_LENGTH: 2000

#### Password Limits
- MIN_PASSWORD_LENGTH: 8
- MAX_PASSWORD_LENGTH: 128

#### Financial Limits
- MAX_AMOUNT: 999,999,999,999.99
- MIN_AGE: 18
- MAX_AGE: 120
- MIN/MAX_PERCENTAGE: 0-100

#### Array Limits
- MAX_GOALS: 50
- MAX_CALCULATORS: 100
- MAX_ASSETS/LIABILITIES: 100
- MAX_EXPENSES: 100
- MAX_DEBTS: 50

#### Rate Limiting
- RATE_LIMIT_WINDOW_MS: 15 minutes
- RATE_LIMIT_MAX_REQUESTS: 100 per window
- RATE_LIMIT_AI_MAX_REQUESTS: 20 per window

#### Pagination
- DEFAULT_PAGE_SIZE: 20
- MAX_PAGE_SIZE: 100

#### Sessions
- JWT_EXPIRATION: 24h
- REFRESH_TOKEN_EXPIRATION: 7d

#### Validation Messages
- Predefined validation error messages

## Usage

### In Backend

```typescript
import {
  User,
  registerSchema,
  ErrorCodes,
  LIMITS
} from '@finance-platform/shared';

// Validate input
const result = registerSchema.safeParse(requestBody);
if (!result.success) {
  throw new ValidationError(ErrorCodes.VALIDATION_ERROR);
}

// Use types
const user: User = await createUser(result.data);
```

### In Frontend

```typescript
import {
  User,
  ModuleWithProgress,
  CompoundGrowthInput,
  ErrorCodes
} from '@finance-platform/shared';

// Type component props
interface Props {
  user: User;
  modules: ModuleWithProgress[];
}

// Type calculator inputs
const input: CompoundGrowthInput = {
  principal: 10000,
  monthly_contribution: 500,
  annual_rate: 7,
  years: 30
};
```

## Building the Package

```bash
cd packages/shared
npm install
npm run build
```

Output: `dist/` directory with compiled JavaScript and type definitions

## Development

For development with watch mode:
```bash
npm run watch
```

Changes are automatically recompiled and available to dependent packages.

## Type Safety Benefits

1. **Compile-Time Checking**: Catch type errors before runtime
2. **Autocomplete**: IDE autocomplete for all types
3. **Refactoring**: Safe refactoring across frontend/backend
4. **Documentation**: Types serve as inline documentation
5. **API Contract**: Shared types ensure API contract adherence

## Dependencies

- **zod** ^3.22.4: Runtime type validation
- **typescript** ^5.5.4: TypeScript compiler
- **@types/node** ^20.11.19: Node.js types

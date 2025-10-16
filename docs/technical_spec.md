# Technical Specification: Personal Finance Learning Platform

## Project Overview

A comprehensive web application that teaches personal finance through an interactive, module-based learning system. The platform combines educational content, AI-powered guidance, interactive financial calculators, and progress tracking to help users aged 18-30 build financial literacy and wealth.

## Technical Architecture

### Stack Summary

**Frontend:**
- React 18.3+
- TypeScript 5.5+
- Vite 5.4+
- React Query 5.x (for server state)
- Zustand 4.x (for client state)
- Tailwind CSS 3.4+
- Recharts 2.x (for data visualization)
- React Router 6.x

**Backend:**
- Node.js 20+ LTS
- Express 4.19+
- TypeScript 5.5+
- Prisma 5.x (ORM)
- PostgreSQL 16+
- JSON Web Tokens (JWT) for authentication
- Bcrypt for password hashing

**Infrastructure:**
- Docker 24+ with Docker Compose
- Nginx (for production reverse proxy)
- Multi-stage Docker builds

**Development Tools:**
- ESLint 8.x
- Prettier 3.x
- Husky (git hooks)
- ts-node for backend development

### Project Structure

```
finance-learning-platform/
├── packages/
│   ├── shared/
│   │   └── src/
│   │       ├── types/
│   │       │   ├── user.ts
│   │       │   ├── module.ts
│   │       │   ├── calculator.ts
│   │       │   ├── progress.ts
│   │       │   └── api.ts
│   │       ├── validators/
│   │       │   ├── auth.ts
│   │       │   ├── financial.ts
│   │       │   └── input.ts
│   │       └── constants/
│   │           ├── modules.ts
│   │           ├── errors.ts
│   │           └── limits.ts
│   │
│   ├── frontend/
│   │   ├── src/
│   │   │   ├── components/
│   │   │   │   ├── auth/
│   │   │   │   ├── calculators/
│   │   │   │   ├── dashboard/
│   │   │   │   ├── modules/
│   │   │   │   ├── progress/
│   │   │   │   └── shared/
│   │   │   ├── pages/
│   │   │   │   ├── Home.tsx
│   │   │   │   ├── Login.tsx
│   │   │   │   ├── Register.tsx
│   │   │   │   ├── Dashboard.tsx
│   │   │   │   ├── ModuleView.tsx
│   │   │   │   ├── CalculatorHub.tsx
│   │   │   │   └── Profile.tsx
│   │   │   ├── hooks/
│   │   │   ├── services/
│   │   │   ├── stores/
│   │   │   ├── utils/
│   │   │   └── styles/
│   │   ├── Dockerfile
│   │   └── package.json
│   │
│   └── backend/
│       ├── src/
│       │   ├── routes/
│       │   │   ├── auth.ts
│       │   │   ├── users.ts
│       │   │   ├── modules.ts
│       │   │   ├── progress.ts
│       │   │   ├── calculators.ts
│       │   │   └── ai.ts
│       │   ├── controllers/
│       │   ├── services/
│       │   │   ├── authService.ts
│       │   │   ├── userService.ts
│       │   │   ├── moduleService.ts
│       │   │   ├── progressService.ts
│       │   │   ├── calculatorService.ts
│       │   │   └── aiService.ts
│       │   ├── middleware/
│       │   │   ├── auth.ts
│       │   │   ├── validation.ts
│       │   │   └── errorHandler.ts
│       │   ├── db/
│       │   │   └── prisma/
│       │   │       ├── schema.prisma
│       │   │       └── migrations/
│       │   └── utils/
│       ├── Dockerfile
│       └── package.json
│
├── docker-compose.yml
├── .env.example
├── package.json
└── README.md
```

## Database Schema

### Core Tables

**users**
- id: UUID (primary key)
- email: VARCHAR(255) UNIQUE NOT NULL
- password_hash: VARCHAR(255) NOT NULL
- name: VARCHAR(255) NOT NULL
- created_at: TIMESTAMP DEFAULT NOW()
- updated_at: TIMESTAMP DEFAULT NOW()
- last_login: TIMESTAMP
- profile_completed: BOOLEAN DEFAULT FALSE

**user_profiles**
- id: UUID (primary key)
- user_id: UUID (foreign key to users) UNIQUE
- age: INTEGER
- current_income: DECIMAL(12,2)
- financial_goals: TEXT[]
- risk_tolerance: ENUM('conservative', 'moderate', 'aggressive')
- has_debt: BOOLEAN
- has_emergency_fund: BOOLEAN
- created_at: TIMESTAMP DEFAULT NOW()
- updated_at: TIMESTAMP DEFAULT NOW()

**modules**
- id: UUID (primary key)
- phase_number: INTEGER NOT NULL
- module_number: INTEGER NOT NULL
- title: VARCHAR(255) NOT NULL
- description: TEXT
- estimated_duration: INTEGER (minutes)
- order_index: INTEGER NOT NULL
- prerequisites: UUID[] (array of module IDs)
- created_at: TIMESTAMP DEFAULT NOW()
- UNIQUE(phase_number, module_number)

**module_content**
- id: UUID (primary key)
- module_id: UUID (foreign key to modules)
- section_number: INTEGER NOT NULL
- section_title: VARCHAR(255) NOT NULL
- content_type: ENUM('text', 'video', 'interactive', 'calculator', 'ai_prompt')
- content_data: JSONB NOT NULL
- order_index: INTEGER NOT NULL
- created_at: TIMESTAMP DEFAULT NOW()

**user_progress**
- id: UUID (primary key)
- user_id: UUID (foreign key to users)
- module_id: UUID (foreign key to modules)
- status: ENUM('not_started', 'in_progress', 'completed')
- progress_percentage: INTEGER DEFAULT 0
- started_at: TIMESTAMP
- completed_at: TIMESTAMP
- last_accessed: TIMESTAMP
- time_spent_minutes: INTEGER DEFAULT 0
- created_at: TIMESTAMP DEFAULT NOW()
- updated_at: TIMESTAMP DEFAULT NOW()
- UNIQUE(user_id, module_id)

**section_progress**
- id: UUID (primary key)
- user_id: UUID (foreign key to users)
- module_content_id: UUID (foreign key to module_content)
- completed: BOOLEAN DEFAULT FALSE
- completed_at: TIMESTAMP
- notes: TEXT
- created_at: TIMESTAMP DEFAULT NOW()
- UNIQUE(user_id, module_content_id)

**calculator_data**
- id: UUID (primary key)
- user_id: UUID (foreign key to users)
- calculator_type: VARCHAR(100) NOT NULL
- calculator_name: VARCHAR(255) NOT NULL
- input_data: JSONB NOT NULL
- output_data: JSONB NOT NULL
- created_at: TIMESTAMP DEFAULT NOW()
- updated_at: TIMESTAMP DEFAULT NOW()
- module_id: UUID (foreign key to modules, nullable)

**user_goals**
- id: UUID (primary key)
- user_id: UUID (foreign key to users)
- goal_type: VARCHAR(100) NOT NULL
- title: VARCHAR(255) NOT NULL
- description: TEXT
- target_amount: DECIMAL(12,2)
- target_date: DATE
- current_progress: DECIMAL(12,2) DEFAULT 0
- status: ENUM('active', 'completed', 'paused', 'abandoned')
- created_at: TIMESTAMP DEFAULT NOW()
- updated_at: TIMESTAMP DEFAULT NOW()

**achievements**
- id: UUID (primary key)
- user_id: UUID (foreign key to users)
- achievement_type: VARCHAR(100) NOT NULL
- title: VARCHAR(255) NOT NULL
- description: TEXT
- earned_at: TIMESTAMP DEFAULT NOW()
- metadata: JSONB

**ai_conversations**
- id: UUID (primary key)
- user_id: UUID (foreign key to users)
- module_id: UUID (foreign key to modules, nullable)
- conversation_context: VARCHAR(255)
- messages: JSONB NOT NULL
- created_at: TIMESTAMP DEFAULT NOW()
- updated_at: TIMESTAMP DEFAULT NOW()

## API Endpoints

### Authentication

**POST /api/auth/register**
- Request Body: { email, password, name }
- Response: { token, user }
- Creates new user account

**POST /api/auth/login**
- Request Body: { email, password }
- Response: { token, user }
- Authenticates user and returns JWT

**POST /api/auth/logout**
- Headers: Authorization Bearer token
- Response: { success: true }
- Invalidates current session

**GET /api/auth/me**
- Headers: Authorization Bearer token
- Response: { user, profile }
- Returns current user data

### User Management

**GET /api/users/profile**
- Headers: Authorization Bearer token
- Response: { profile }
- Returns user profile data

**PUT /api/users/profile**
- Headers: Authorization Bearer token
- Request Body: { age, current_income, financial_goals, risk_tolerance, has_debt, has_emergency_fund }
- Response: { profile }
- Updates user profile

**GET /api/users/dashboard**
- Headers: Authorization Bearer token
- Response: { overview, recent_activity, next_steps, achievements }
- Returns dashboard summary data

### Modules

**GET /api/modules**
- Headers: Authorization Bearer token
- Query Params: phase (optional)
- Response: { modules: Array }
- Returns all modules with user progress

**GET /api/modules/:moduleId**
- Headers: Authorization Bearer token
- Response: { module, content, progress }
- Returns detailed module with content sections

**GET /api/modules/:moduleId/content**
- Headers: Authorization Bearer token
- Response: { sections: Array }
- Returns all content sections for a module

### Progress Tracking

**POST /api/progress/module/:moduleId/start**
- Headers: Authorization Bearer token
- Response: { progress }
- Marks module as started

**PUT /api/progress/module/:moduleId**
- Headers: Authorization Bearer token
- Request Body: { progress_percentage, time_spent_minutes }
- Response: { progress }
- Updates module progress

**POST /api/progress/section/:sectionId/complete**
- Headers: Authorization Bearer token
- Request Body: { notes }
- Response: { section_progress }
- Marks section as completed

**GET /api/progress/summary**
- Headers: Authorization Bearer token
- Response: { phases, total_progress, time_invested, modules_completed }
- Returns overall progress summary

### Calculators

**GET /api/calculators**
- Headers: Authorization Bearer token
- Response: { calculators: Array }
- Returns available calculator types

**POST /api/calculators/:calculatorType**
- Headers: Authorization Bearer token
- Request Body: { input_data, calculator_name, module_id }
- Response: { calculator_data, output_data }
- Saves calculator with computed results

**GET /api/calculators/saved**
- Headers: Authorization Bearer token
- Query Params: calculator_type (optional)
- Response: { saved_calculators: Array }
- Returns user's saved calculators

**GET /api/calculators/:calculatorId**
- Headers: Authorization Bearer token
- Response: { calculator_data }
- Returns specific saved calculator

**PUT /api/calculators/:calculatorId**
- Headers: Authorization Bearer token
- Request Body: { input_data }
- Response: { calculator_data, output_data }
- Updates calculator inputs and recomputes

**DELETE /api/calculators/:calculatorId**
- Headers: Authorization Bearer token
- Response: { success: true }
- Deletes saved calculator

### Goals

**GET /api/goals**
- Headers: Authorization Bearer token
- Response: { goals: Array }
- Returns all user goals

**POST /api/goals**
- Headers: Authorization Bearer token
- Request Body: { goal_type, title, description, target_amount, target_date }
- Response: { goal }
- Creates new financial goal

**PUT /api/goals/:goalId**
- Headers: Authorization Bearer token
- Request Body: { current_progress, status, etc. }
- Response: { goal }
- Updates goal

**DELETE /api/goals/:goalId**
- Headers: Authorization Bearer token
- Response: { success: true }
- Deletes goal

### AI Integration

**POST /api/ai/chat**
- Headers: Authorization Bearer token
- Request Body: { message, conversation_id, module_id, context }
- Response: { response, conversation_id }
- Sends message to AI assistant

**GET /api/ai/conversations**
- Headers: Authorization Bearer token
- Response: { conversations: Array }
- Returns user's AI conversation history

**GET /api/ai/prompt-templates**
- Headers: Authorization Bearer token
- Query Params: module_id (optional)
- Response: { templates: Array }
- Returns AI prompt templates for modules

### Achievements

**GET /api/achievements**
- Headers: Authorization Bearer token
- Response: { achievements: Array, available: Array }
- Returns earned and available achievements

## Core Features

### 1. User Onboarding

**Financial Assessment Quiz:**
- Collects age, income, financial goals
- Assesses current financial situation
- Determines risk tolerance
- Creates personalized learning path
- Sets initial milestones

**Implementation:**
- Multi-step form component
- Progress indicator
- Validation at each step
- Saves to user_profiles table
- Generates recommended module sequence

### 2. Module Learning System

**Module Navigation:**
- Phase-based organization (4 phases, 17 modules)
- Prerequisite checking
- Progress indicators
- Estimated time to complete
- Locked/unlocked states

**Content Delivery:**
- Rich text content with formatting
- Embedded video support (placeholder for future)
- Interactive elements
- AI prompt suggestions
- Check-my-logic reflection prompts
- Key takeaway summaries

**Implementation:**
- Dynamic content renderer
- Section-by-section progression
- Auto-save progress
- Time tracking
- Note-taking capability

### 3. Interactive Financial Calculators

**Phase 1 Calculators:**
- Compound Growth Calculator
- Financial Snapshot (net worth)
- Monthly Budget Tracker
- Debt Inventory and Payoff Calculator (avalanche vs snowball)
- Emergency Fund Goal Tracker

**Phase 2 Calculators:**
- Investment Growth Calculator
- Account Comparison Matrix
- Portfolio Tracker
- Investment Dashboard

**Phase 3 Calculators:**
- Home Ownership Planning Model
- Mortgage Calculator (multiple scenarios)
- Amortization Schedule
- Equity Growth Tracker
- Multi-Goal Priority Planner

**Phase 4 Calculators:**
- Retirement Planning Calculator
- Retirement Income Projection
- Portfolio Stress Test
- Tax Optimization Tracker

**Calculator Features:**
- Real-time calculations
- Visual charts and graphs
- Export to CSV/Excel functionality
- Save and load functionality
- Compare scenarios side-by-side
- Integration with user profile data
- Shareable results (optional)

**Implementation:**
- Reusable calculator component framework
- Form validation
- Recharts for visualization
- Local state for calculations
- Backend persistence
- Calculation logic in shared package

### 4. AI-Powered Guidance

**AI Assistant Features:**
- Context-aware responses (knows which module user is in)
- Personalized based on user profile
- Pre-written prompt templates for each module
- Conversation history
- Clarification and explanation requests
- Scenario modeling assistance
- Decision framework support

**Implementation:**
- Chat interface component
- Conversation threading
- Context injection (user profile, current module, saved calculators)
- Prompt template library
- Rate limiting
- Conversation persistence

**Note:** Initial implementation uses placeholder for AI responses. Real AI integration (Claude API or similar) can be added later.

### 5. Progress Tracking Dashboard

**Dashboard Components:**
- Overall progress by phase
- Current module and next steps
- Time invested
- Modules completed count
- Calculator completion status
- Goals overview
- Recent achievements
- Suggested next actions

**Visualizations:**
- Phase completion rings/progress bars
- Time invested chart
- Goal progress indicators
- Module completion timeline

**Implementation:**
- Dashboard page with widgets
- Real-time data updates
- Responsive grid layout
- Interactive charts

### 6. Goal Setting and Tracking

**Goal Types:**
- Emergency fund
- Debt payoff
- Home down payment
- Retirement savings
- Custom goals

**Goal Features:**
- Set target amount and date
- Track current progress
- Milestone celebrations
- Progress visualization
- Linked to calculators
- Status management

### 7. Achievement System

**Achievement Categories:**
- Module completion (complete Phase 1, etc.)
- Calculator usage (create first budget, etc.)
- Consistency (7-day streak, etc.)
- Milestones (save first dollar, etc.)
- Learning (complete financial snapshot, etc.)

**Achievement Features:**
- Badge display
- Unlock notifications
- Progress towards next achievement
- Gamification elements (no excessive animations)

### 8. Export and Download Functionality

**Exportable Data:**
- Calculator results as CSV/Excel
- Progress reports as PDF
- Module notes
- Goal summaries

**Implementation:**
- Export buttons on relevant pages
- CSV generation utility
- PDF generation (using library like jsPDF)
- Download trigger

## User Experience Flow

### First-Time User Journey

1. **Landing Page**
   - Value proposition
   - Course overview
   - Call to action (Register)

2. **Registration**
   - Email and password
   - Basic information (name)
   - Email verification (future feature)

3. **Financial Assessment**
   - Multi-step questionnaire
   - Collects financial situation
   - Creates profile

4. **Dashboard Introduction**
   - Welcome message
   - Overview of platform
   - Recommended starting point
   - Tour of features (optional)

5. **Module 1 Start**
   - Guided introduction
   - Financial vision statement exercise
   - First AI interaction
   - Progress save

### Returning User Journey

1. **Login**
   - Email and password
   - Remember me option

2. **Dashboard**
   - Resume where left off
   - See progress
   - View goals
   - Check achievements

3. **Continue Learning**
   - Pick up mid-module or start next
   - Access calculators
   - Update goals

### Module Engagement Pattern

1. **Module Landing**
   - Overview and objectives
   - Estimated time
   - Prerequisites check
   - Start button

2. **Content Sections**
   - Read/watch content
   - Interact with examples
   - Use AI prompts
   - Complete activities

3. **Calculator Integration**
   - Open relevant calculator
   - Input user data
   - Save results
   - Link to module

4. **Module Completion**
   - Final reflection
   - Achievement unlock
   - Next module suggestion
   - Share option (optional)

## Frontend Implementation Details

### State Management Strategy

**Zustand Stores:**
- authStore: user authentication state
- userStore: user profile and preferences
- moduleStore: current module and content
- calculatorStore: active calculator data
- uiStore: UI state (modals, notifications)

**React Query:**
- API data fetching and caching
- Infinite scrolling (if needed)
- Optimistic updates
- Background refetching

### Component Architecture

**Shared Components:**
- Button (variants: primary, secondary, outline)
- Input (text, number, email, password)
- Card
- Modal
- Toast notifications
- Loading spinner
- Progress bar
- Badge
- Tab navigation
- Accordion
- Tooltip

**Feature Components:**
- AuthForm (login/register)
- ModuleCard
- CalculatorForm (generic)
- ChartContainer
- GoalCard
- AchievementBadge
- ProgressRing
- DashboardWidget
- AIChat
- NavigationMenu

### Routing Structure

```
/ - Landing page
/login - Login page
/register - Registration page
/onboarding - Financial assessment
/dashboard - Main dashboard
/modules - Module list
/modules/:phaseId - Phase view
/modules/:phaseId/:moduleId - Module content view
/calculators - Calculator hub
/calculators/:type - Specific calculator
/goals - Goals overview
/goals/:goalId - Goal detail
/profile - User profile
/achievements - Achievements page
/help - Help and FAQ
```

### Responsive Design

**Breakpoints:**
- Mobile: 320px - 767px
- Tablet: 768px - 1023px
- Desktop: 1024px+

**Mobile Considerations:**
- Touch-friendly buttons (44px minimum)
- Collapsible navigation
- Simplified calculator layouts
- Vertical stacking of content
- Swipe gestures for module navigation

**Accessibility:**
- ARIA labels
- Keyboard navigation
- Focus indicators
- Color contrast (WCAG AA)
- Screen reader support
- Semantic HTML

### Styling Approach

**Tailwind Configuration:**
- Custom color palette (professional, calming)
- Typography scale
- Spacing system
- Component classes
- Dark mode support (future)

**Design Principles:**
- Clean and professional
- Clear hierarchy
- Ample whitespace
- Consistent spacing
- Subtle animations (no emojis or excessive decoration)
- Focus on content

## Backend Implementation Details

### Service Layer Architecture

**authService:**
- register(email, password, name)
- login(email, password)
- verifyToken(token)
- hashPassword(password)
- comparePassword(password, hash)

**userService:**
- getUserById(userId)
- updateProfile(userId, profileData)
- getDashboardData(userId)
- getUserWithProgress(userId)

**moduleService:**
- getAllModules(userId)
- getModuleById(moduleId, userId)
- getModuleContent(moduleId)
- checkPrerequisites(moduleId, userId)

**progressService:**
- startModule(userId, moduleId)
- updateModuleProgress(userId, moduleId, progressData)
- completeSection(userId, sectionId, notes)
- getProgressSummary(userId)
- getPhaseProgress(userId, phaseNumber)

**calculatorService:**
- saveCalculator(userId, calculatorData)
- getCalculatorById(calculatorId)
- updateCalculator(calculatorId, inputData)
- getUserCalculators(userId, calculatorType)
- deleteCalculator(calculatorId)
- computeResults(calculatorType, inputData)

**goalService:**
- createGoal(userId, goalData)
- updateGoal(goalId, goalData)
- deleteGoal(goalId)
- getUserGoals(userId)
- updateGoalProgress(goalId, currentProgress)

**achievementService:**
- checkAndAwardAchievements(userId)
- getUserAchievements(userId)
- getAvailableAchievements(userId)

**aiService:**
- sendMessage(userId, message, context)
- getConversation(conversationId)
- getUserConversations(userId)
- getPromptTemplates(moduleId)

### Middleware

**Authentication Middleware:**
- Verify JWT token
- Attach user to request
- Handle token expiration
- Return 401 for unauthorized

**Validation Middleware:**
- Validate request body
- Validate query parameters
- Validate URL parameters
- Use validators from shared package
- Return 400 for invalid input

**Error Handling Middleware:**
- Catch errors
- Log errors
- Return appropriate status codes
- Sanitize error messages for client

**Rate Limiting:**
- Limit API requests per user
- Separate limits for AI endpoints
- Return 429 for rate limit exceeded

### Database Queries Optimization

**Indexing Strategy:**
- Index on user_id for all user-related tables
- Index on module_id for progress tracking
- Composite index on (user_id, module_id) for progress
- Index on created_at for sorting

**Query Patterns:**
- Use transactions for multi-table updates
- Batch queries where possible
- Eager loading with Prisma include
- Pagination for large result sets

### Security Measures

**Authentication:**
- JWT with expiration (24 hours)
- Refresh token mechanism (future)
- Password requirements (min 8 chars, mixed case, number)
- Bcrypt rounds: 12

**Data Protection:**
- Validate all inputs
- Sanitize user content
- Parameterized queries (Prisma)
- HTTPS only (production)
- CORS configuration
- Rate limiting
- SQL injection prevention (Prisma)
- XSS prevention

**Privacy:**
- Password never returned in API
- User data scoped to authenticated user
- No public user data exposure

## Docker Configuration

### docker-compose.yml

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:16-alpine
    container_name: finance-platform-db
    environment:
      POSTGRES_USER: ${POSTGRES_USER:-finance_user}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:-finance_password}
      POSTGRES_DB: ${POSTGRES_DB:-finance_platform_dev}
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER:-finance_user}"]
      interval: 10s
      timeout: 5s
      retries: 5

  backend:
    build:
      context: ./packages/backend
      dockerfile: Dockerfile
    container_name: finance-platform-api
    environment:
      DATABASE_URL: postgresql://${POSTGRES_USER:-finance_user}:${POSTGRES_PASSWORD:-finance_password}@postgres:5432/${POSTGRES_DB:-finance_platform_dev}
      JWT_SECRET: ${JWT_SECRET:-change-this-secret-in-production}
      NODE_ENV: ${NODE_ENV:-development}
      PORT: 3000
    ports:
      - "3000:3000"
    volumes:
      - ./packages/backend/src:/app/src
      - ./packages/shared:/app/shared
    depends_on:
      postgres:
        condition: service_healthy
    command: npm run dev

  frontend:
    build:
      context: ./packages/frontend
      dockerfile: Dockerfile
    container_name: finance-platform-web
    environment:
      VITE_API_URL: ${VITE_API_URL:-http://localhost:3000}
    ports:
      - "5173:5173"
    volumes:
      - ./packages/frontend/src:/app/src
      - ./packages/shared:/app/shared
    depends_on:
      - backend
    command: npm run dev -- --host 0.0.0.0

volumes:
  postgres_data:
```

### Environment Variables

**.env.example:**
```
# Database
POSTGRES_USER=finance_user
POSTGRES_PASSWORD=finance_password
POSTGRES_DB=finance_platform_dev
DATABASE_URL=postgresql://finance_user:finance_password@postgres:5432/finance_platform_dev

# Backend
JWT_SECRET=your-super-secret-jwt-key-change-in-production
NODE_ENV=development
PORT=3000

# Frontend
VITE_API_URL=http://localhost:3000
```

## Development Workflow

### Initial Setup

```bash
# Clone repository
git clone <repository-url>
cd finance-learning-platform

# Copy environment variables
cp .env.example .env

# Start all services
docker-compose up --build

# Services will be available at:
# Frontend: http://localhost:5173
# Backend: http://localhost:3000
# Database: localhost:5432
```

### Database Migrations

```bash
# Generate Prisma client
docker-compose exec backend npx prisma generate

# Create migration
docker-compose exec backend npx prisma migrate dev --name <migration-name>

# Apply migrations
docker-compose exec backend npx prisma migrate deploy

# Seed database
docker-compose exec backend npm run seed
```

### Development Commands

```bash
# Start services
docker-compose up

# Start in detached mode
docker-compose up -d

# Stop services
docker-compose down

# Rebuild specific service
docker-compose build backend

# View logs
docker-compose logs -f backend

# Execute command in container
docker-compose exec backend npm install <package>

# Access database
docker-compose exec postgres psql -U finance_user -d finance_platform_dev
```

## Data Seeding

### Module Content Seeding

Create seed script to populate modules table with all 17 modules from the strategic spec:

**Seed Data Structure:**
- All 4 phases
- All 17 modules with titles, descriptions, duration
- Module content sections
- Prerequisites
- Learning objectives
- Deliverables

**Seed Script Location:**
`packages/backend/src/db/prisma/seed.ts`

**Module Data Source:**
Extract from strategic spec document:
- Phase 1: Modules 1-5 (Foundations)
- Phase 2: Modules 6-9 (Building Wealth)
- Phase 3: Modules 10-13 (Building Assets & Major Goals)
- Phase 4: Modules 14-17 (Long-Term Mastery)

## Testing Strategy (Future Phase)

**Unit Tests:**
- Service layer functions
- Validators
- Calculators
- Utilities

**Integration Tests:**
- API endpoints
- Database operations
- Authentication flow

**E2E Tests:**
- User registration and login
- Module completion flow
- Calculator usage
- Goal creation

**Testing Tools (add later):**
- Vitest for unit tests
- Supertest for API tests
- Playwright for E2E tests

## Performance Considerations

**Frontend Optimization:**
- Code splitting by route
- Lazy loading components
- Memoization for expensive calculations
- Debouncing user inputs
- Image optimization
- Bundle size monitoring

**Backend Optimization:**
- Database connection pooling
- Query optimization
- Caching (future: Redis)
- Response compression
- Pagination for large datasets

**Database Optimization:**
- Proper indexing
- Query analysis
- Connection limits
- Regular vacuuming (PostgreSQL)

## Deployment Strategy (Future)

**Production Considerations:**
- Multi-stage Docker builds
- Environment-specific configs
- HTTPS enforcement
- Database backups
- Monitoring and logging
- Error tracking (Sentry)
- Analytics (privacy-focused)

**Hosting Options:**
- Railway
- Render
- DigitalOcean
- AWS (ECS/RDS)
- Vercel (frontend) + Railway (backend)

## Success Metrics

**User Engagement:**
- Registration conversion rate
- Module completion rate
- Time spent per module
- Calculator usage frequency
- Goal setting rate
- Return visit rate

**Learning Outcomes:**
- Modules completed
- Calculators created
- Goals achieved
- AI interactions
- Progress consistency

**Technical Metrics:**
- API response times
- Error rates
- Uptime
- Database query performance

## Future Enhancements (Out of Scope for Initial Build)

- Email notifications
- Social sharing
- Community forums
- Video content hosting
- Mobile apps (iOS/Android)
- Advanced AI integration (real Claude API)
- Multi-language support
- Accessibility improvements
- Dark mode
- PDF export for modules
- Printable worksheets
- Integration with financial institutions
- Collaborative features
- Mentorship matching

## Content Integration Requirements

**Module Content Format:**
Each module should have:
- Title and description
- Learning objectives
- Estimated duration
- Content sections with:
  - Section title
  - Body text (Markdown support)
  - Content type (text, interactive, calculator, ai_prompt)
  - Order/sequence
- Key takeaways
- Deliverables
- AI prompt templates
- Reflection questions

**Calculator Specifications:**
Each calculator must have:
- Input fields with validation
- Calculation logic
- Output display
- Visualization (charts/graphs)
- Save functionality
- Export capability
- Help text/tooltips

## Code Style Guidelines

**TypeScript:**
- Use strict mode
- Explicit return types for functions
- Interface over type for object shapes
- Descriptive variable names
- No any types unless absolutely necessary

**React:**
- Functional components only
- Custom hooks for reusable logic
- Props interfaces for all components
- Destructure props
- Use fragments instead of divs when possible

**Formatting:**
- Prettier for code formatting
- ESLint for linting
- 2 space indentation
- Single quotes for strings
- Semicolons required
- Trailing commas

**No Emojis Policy:**
- No emoji characters anywhere in the codebase
- No emoji in comments, console logs, or user-facing text
- Use text-based indicators only
- Focus on professional, clean design

**Naming Conventions:**
- PascalCase for components and interfaces
- camelCase for variables and functions
- UPPER_SNAKE_CASE for constants
- kebab-case for file names (except components)
- Descriptive, self-documenting names

## Error Handling Standards

**Frontend:**
- Try-catch for async operations
- User-friendly error messages
- Toast notifications for errors
- Error boundaries for component errors
- Fallback UI for failures

**Backend:**
- Consistent error response format
- Appropriate HTTP status codes
- Error logging
- Stack traces in development only
- User-safe error messages

**Error Response Format:**
```typescript
{
  error: {
    code: 'ERROR_CODE',
    message: 'User-friendly message',
    details?: any // Only in development
  }
}
```

---

# CLAUDE CODE PROMPT

You are tasked with building a Personal Finance Learning Platform web application based on the technical specification provided above. This is a comprehensive educational platform that teaches personal finance through interactive modules, calculators, and AI-powered guidance.

## Critical Requirements

1. **No Emojis:** Do not use any emoji characters anywhere in the code, comments, console logs, UI text, or any other part of the application. Use text-based indicators only. This is a professional financial application and must maintain a clean, professional appearance.

2. **Latest Versions:** Use the latest stable versions of all dependencies. Do not use outdated versions. Check npm for current versions.

3. **TypeScript Strict Mode:** All code must be in TypeScript with strict mode enabled. Use explicit types and interfaces throughout.

4. **Monorepo Structure:** Follow the specified monorepo structure with packages/shared, packages/frontend, and packages/backend.

5. **Shared Package First:** Start by creating the shared package with all TypeScript interfaces, types, validators, and constants. This is critical for type safety across the application.

6. **Docker Configuration:** Set up Docker Compose with PostgreSQL, backend, and frontend services as specified. Include proper health checks and volume mounting for development.

7. **Database Schema:** Implement the complete Prisma schema with all tables, relationships, and indexes as specified.

8. **Module Content:** Seed the database with all 17 modules from the course structure (4 phases). Extract module details from the strategic specification provided in the context.

## Implementation Order

Build the application in this sequence:

### Phase 1: Foundation (Do First)

1. **Project Setup:**
   - Initialize monorepo with workspaces
   - Set up packages/shared, packages/frontend, packages/backend
   - Configure TypeScript for all packages
   - Create Docker Compose configuration
   - Set up environment variables

2. **Shared Package:**
   - Define all TypeScript interfaces and types
   - Create validators (auth, financial inputs, etc.)
   - Define constants (error codes, module structure, etc.)
   - Export everything properly

3. **Backend Core:**
   - Set up Express with TypeScript
   - Configure Prisma with PostgreSQL
   - Create database schema
   - Set up authentication (JWT)
   - Create middleware (auth, validation, error handling)

4. **Database & Seeding:**
   - Create migrations
   - Write seed script for modules
   - Populate all 17 modules with content
   - Create initial user for testing

### Phase 2: Authentication & User Management

5. **Auth System:**
   - Implement registration endpoint
   - Implement login endpoint
   - Implement JWT verification
   - Create auth middleware
   - Test authentication flow

6. **User Profile:**
   - Create user profile endpoints
   - Implement profile update
   - Build onboarding assessment
   - Create dashboard data endpoint

### Phase 3: Core Learning System

7. **Module System:**
   - Implement module listing endpoint
   - Implement module detail endpoint
   - Create progress tracking endpoints
   - Build prerequisite checking logic

8. **Progress Tracking:**
   - Create progress update endpoints
   - Implement section completion tracking
   - Build progress summary endpoint
   - Calculate completion percentages

### Phase 4: Calculators

9. **Calculator Framework:**
   - Build generic calculator save/load system
   - Create calculator type definitions
   - Implement computation logic for each type
   - Build calculator listing/detail endpoints

10. **Specific Calculators:**
    - Compound growth calculator
    - Budget tracker
    - Debt payoff calculator
    - Emergency fund calculator
    - Investment calculators
    - Mortgage calculator
    - Retirement calculator

### Phase 5: Goals & Achievements

11. **Goal System:**
    - Create goal CRUD endpoints
    - Implement progress tracking
    - Build goal summary views

12. **Achievement System:**
    - Define achievement criteria
    - Create achievement checking logic
    - Build achievement endpoints

### Phase 6: Frontend Foundation

13. **Frontend Setup:**
    - Initialize React + Vite + TypeScript
    - Set up Tailwind CSS
    - Configure React Router
    - Set up React Query
    - Create Zustand stores

14. **Shared Components:**
    - Build component library (Button, Input, Card, etc.)
    - Create layout components
    - Build navigation components
    - Create loading and error states

### Phase 7: Frontend Features

15. **Authentication Pages:**
    - Login page
    - Registration page
    - Password validation
    - Auth state management

16. **Onboarding Flow:**
    - Financial assessment form
    - Multi-step wizard
    - Profile creation

17. **Dashboard:**
    - Build dashboard page
    - Create progress widgets
    - Display next steps
    - Show achievements

18. **Module System UI:**
    - Module list view
    - Module detail view
    - Content section renderer
    - Progress indicators
    - Navigation between sections

19. **Calculator Hub:**
    - Calculator list view
    - Generic calculator form component
    - Result visualization with charts
    - Save/load functionality
    - Export functionality

20. **Goals UI:**
    - Goal creation form
    - Goal list view
    - Progress visualization
    - Goal editing

21. **Profile & Settings:**
    - Profile view
    - Profile editing
    - Achievement display

### Phase 8: Polish & Integration

22. **Styling & Responsiveness:**
    - Implement responsive layouts
    - Add loading states
    - Add error handling
    - Polish animations and transitions

23. **Data Integration:**
    - Connect all API endpoints
    - Implement error handling
    - Add optimistic updates
    - Test all flows

24. **AI Integration (Placeholder):**
    - Create chat UI
    - Build conversation storage
    - Add prompt templates
    - Implement placeholder AI responses

## Development Guidelines

**Code Quality:**
- Write clean, readable code with comments where necessary
- Use descriptive variable and function names
- Follow separation of concerns (routes, controllers, services)
- Keep components small and focused
- Extract reusable logic into hooks and utilities

**Error Handling:**
- Implement try-catch blocks for all async operations
- Return consistent error responses
- Log errors appropriately
- Show user-friendly error messages

**Type Safety:**
- Define interfaces for all data structures
- Use types from shared package
- Avoid any types
- Use TypeScript utility types where appropriate

**Database:**
- Use transactions for multi-table operations
- Add proper indexes
- Use parameterized queries (Prisma handles this)
- Implement proper relationships

**Security:**
- Never store passwords in plain text
- Use bcrypt with appropriate rounds
- Validate all inputs
- Implement rate limiting on sensitive endpoints
- Use HTTPS in production

**Performance:**
- Implement pagination for large lists
- Use React Query caching
- Optimize database queries
- Code split frontend routes
- Lazy load components where appropriate

## Testing Approach

For initial build, focus on manual testing:
- Test all API endpoints with Postman or similar
- Test authentication flow
- Test module progression
- Test calculator functionality
- Test goal creation and tracking
- Test responsive design at different breakpoints

Automated testing can be added in a future phase.

## Deliverables

By the end of this build, the application should have:

1. Working authentication (register, login, logout)
2. User profile and onboarding flow
3. All 17 modules populated in database
4. Module viewing with progress tracking
5. All calculators functional (12+ types)
6. Goal setting and tracking
7. Achievement system
8. Dashboard with progress overview
9. Responsive design for mobile, tablet, desktop
10. Docker Compose setup for easy development
11. Complete API documentation (in code comments)
12. Database seed script with all content

## File Creation Priority

Create files in this order to avoid dependency issues:

1. Root package.json with workspaces
2. packages/shared/package.json and tsconfig
3. All shared/src files (types, validators, constants)
4. packages/backend/package.json and tsconfig
5. Backend Prisma schema
6. Backend source files (routes, controllers, services)
7. Backend Dockerfile
8. packages/frontend/package.json and tsconfig
9. Frontend source files (components, pages, hooks)
10. Frontend Dockerfile
11. docker-compose.yml
12. .env.example

## Module Content Guidelines

When seeding modules, extract from the strategic specification:

**Each module needs:**
- Phase number (1-4)
- Module number within phase
- Title (e.g., "Your Money Story")
- Description (overview of what module covers)
- Estimated duration (in minutes)
- Order index (for sequencing)
- Prerequisites (array of module IDs that must be completed first)

**Each module content section needs:**
- Section number
- Section title
- Content type (text, interactive, calculator, ai_prompt)
- Content data (JSON with text, instructions, etc.)
- Order index

Extract the detailed section content from the course outlines in the strategic spec for each phase.

## Important Notes

- This is a substantial application that will require many files. Take your time and build methodically.
- Start with the foundation and work your way up. Don't skip ahead.
- Test each feature as you build it before moving to the next.
- Use the shared package extensively for type safety.
- Keep business logic in services, not controllers or routes.
- Focus on functionality first, polish later.
- Remember: no emojis anywhere in the codebase or UI.

Begin by setting up the project structure and shared package. Then proceed through the phases systematically. Ask for clarification if any part of the specification is unclear.

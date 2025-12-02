# Development Sprint Start Prompt

Copy and paste this prompt to start a new development conversation:

---

## Development Sprint: Educational Enhancement System

I'm working on the **Finance Learning Platform** - a monorepo TypeScript project that teaches personal finance through interactive modules. I need to implement the **Educational Enhancement System** as specified in `docs/spec_docs/educational-enhancement-spec.md`.

### Project Context

**Tech Stack:**
- **Frontend**: React 18.3 + TypeScript + Vite + Tailwind CSS
- **Backend**: Node.js 20 + Express + TypeScript + Prisma ORM
- **Database**: PostgreSQL 16
- **Architecture**: NPM workspaces monorepo (`packages/frontend`, `packages/backend`, `packages/shared`)
- **Infrastructure**: Docker Compose for development

**Current State:**
- ✅ 17 learning modules fully seeded
- ✅ Basic module viewing system
- ✅ User progress tracking
- ✅ Financial calculators
- ✅ Journaling and mood tracking (recently added)
- ✅ Authentication and user management

### What I Need Built

I'm implementing **Phase 1: Foundation** (Weeks 1-2) from the educational enhancement spec, which includes:

1. **Database Schema Enhancements**
   - Create new tables: `learning_performance`, `learning_style`, `concept_mastery`, `stress_predictions`, `learning_interventions`, `module_readiness`
   - Add Dewey-inspired tables: `reflective_thinking_process`, `reflective_hypothesis`, `habits_of_mind`, `language_activities`
   - Update existing `modules` table with `reflection_required` field (boolean or enum: 'full' | 'hybrid' | 'none')
   - Update existing tables with new fields

2. **Backend Services**
   - `AdaptiveLearningService` - Performance tracking, learning style detection, content adaptation, mastery calculation
   - `PredictiveWellnessService` - Stress prediction, optimal time detection, engagement prediction
   - `ProactiveSupportService` - Hint generation, encouragement, break suggestions
   - `HolisticEducationService` - Emotional state integration, behavioral patterns, real-world application
   - `ReflectiveThinkingService` - Dewey's 5-step reflection process facilitation

3. **API Endpoints**
   - Adaptive learning endpoints (performance tracking, learning style, adapted content, mastery, learning paths)
   - Predictive wellness endpoints (stress prediction, optimal time, engagement, success probability)
   - Proactive support endpoints (hints, encouragement, breaks, celebrations)
   - Holistic education endpoints (emotional state, behavioral patterns, real-world application, module connections)
   - Reflective thinking endpoints (Dewey's 5-step process, hypotheses, habits of mind, language activities)

4. **Frontend Foundation**
   - Basic store setup (Zustand) for new services
   - Core component scaffolding (can be minimal initially)
   - Integration points with existing module system

### Critical Requirements

**NO AI**: All intelligence must be rule-based, pattern-driven, and data-informed. No AI/LLM integration YET but we DO WANT TO SET UP INFRASTRUCTURE/SCAFFOLDING FOR AI INTEGRATION.

**Dewey-Inspired**: The system is grounded in John Dewey's theory of reflective thinking, but **not all modules require the full 5-step reflection process**. Use the following criteria to determine applicability:

**Full Dewey Process (5-Step Reflection) - Use When:**
- Module involves **strategic decision-making** (e.g., "Debt Strategy", "Investment Foundations", "Retirement Planning")
- Concept has **multiple valid approaches** (e.g., avalanche vs. snowball debt payoff, different investment strategies)
- Content **challenges prior beliefs** or creates cognitive dissonance (e.g., "Credit cards aren't always bad")
- Requires **personal application** to user's specific situation (e.g., "Budgeting Fundamentals", "Emergency Fund Planning")
- Involves **trade-offs and consequences** that need reasoning (e.g., "Home Ownership vs. Renting")

**Simplified/Adaptive Approach - Use When:**
- **Factual/definitional content** (e.g., "What is a 401k?", "Types of investment accounts")
- **Procedural steps** (e.g., "How to open a brokerage account", "How to set up automatic transfers")
- **Straightforward calculations** (e.g., "Compound interest formula", "Mortgage payment calculation")
- **Reference material** (e.g., "Financial terms glossary", "Account comparison matrix")
- **Foundation concepts** that build toward reflection (e.g., basic definitions before strategic modules)

**Hybrid Approach - Use When:**
- Module has **mixed content types** (some sections need reflection, others are informational)
- **Progressive complexity** (start simple, build to reflection)
- **Prerequisite knowledge** (teach basics first, then apply through reflection)

**Differentiation Criteria:**
Ask: "Does this concept require the user to **reason through alternatives, consider consequences, and make a personal decision**?"
- **Yes** → Full Dewey process
- **No, but needs understanding** → Adaptive learning with mastery checks
- **No, just information** → Standard content delivery with optional reflection prompts

**Implementation Note**: The system should support **all three approaches** - full reflection, adaptive learning, and standard content. Modules should be tagged with `reflection_required: 'full' | 'hybrid' | 'none'` to determine which approach to use.

**Examples:**
- **"Debt Strategy"** → `reflection_required: 'full'` (multiple approaches, personal decision, consequences to consider)
- **"Investment Accounts"** → `reflection_required: 'none'` (factual information about account types)
- **"Budgeting Fundamentals"** → `reflection_required: 'hybrid'` (definitions first, then personal application through reflection)
- **"Compound Interest Explained"** → `reflection_required: 'none'` (conceptual understanding, calculation)
- **"Home Ownership Planning"** → `reflection_required: 'full'` (major life decision, multiple factors, personal situation)

**Education-First**: Every feature serves financial education. This is not about AI features—it's about better learning.

**Existing Patterns**: Follow the existing codebase patterns:
- Services in `packages/backend/src/services/`
- Routes in `packages/backend/src/routes/`
- Types in `packages/shared/src/types/`
- Stores in `packages/frontend/src/stores/`
- Components in `packages/frontend/src/components/`

### Implementation Priority

**Week 1 Focus:**
1. Database migrations for all new tables
2. Core service implementations (AdaptiveLearningService, ReflectiveThinkingService)
3. Essential API endpoints for performance tracking and reflection process
4. Basic frontend stores

**Week 2 Focus:**
1. Remaining services (PredictiveWellnessService, ProactiveSupportService, HolisticEducationService)
2. Complete API endpoint set
3. Frontend component scaffolding
4. Integration with existing module viewing system

### Key Files to Reference

- `docs/spec_docs/educational-enhancement-spec.md` - Complete specification (3435 lines)
- `packages/backend/prisma/schema.prisma` - Current database schema
- `packages/backend/src/routes/modules.ts` - Existing module routes
- `packages/frontend/src/pages/ModuleView.tsx` - Current module viewing
- `packages/shared/src/types/` - Shared type definitions

### Success Criteria

- All database tables created and migrated
- Core services functional with basic rule-based logic
- API endpoints return proper responses (can start with mock data)
- Frontend stores can fetch and display data
- Integration points identified for existing module system
- No breaking changes to existing functionality

### Questions to Consider

1. How should we differentiate between modules that need full Dewey reflection vs. simpler adaptive learning?
2. How should we integrate the reflection process into existing module viewing (when applicable)?
3. What's the best way to track performance without being intrusive?
4. How do we detect learning style from behavior patterns?
5. What's the minimal viable implementation for stress prediction?
6. How should problematic situations be presented in the UI (when reflection is required)?
7. How do we handle hybrid modules that mix reflection and standard content?

**Let's start with the database schema and core services. Please review the spec document and propose the implementation approach.**

---


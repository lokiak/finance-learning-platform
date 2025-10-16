# Finance Learning Platform

A comprehensive web application that teaches personal finance through an interactive, module-based learning system combining educational content, AI-powered guidance, interactive financial calculators, and progress tracking.

## 🎯 Project Status: Backend Complete (~40%)

**✅ Completed:**
- Complete backend API with 27 endpoints
- Authentication system with JWT
- Database schema with 11 models
- All 17 course modules seeded and ready
- Progress tracking system
- Calculator framework
- Goals and achievements system
- Comprehensive documentation

**⏳ In Progress:**
- Frontend React application

**📚 Full status report:** [docs/05-project-status.md](docs/05-project-status.md)

## Features

- **17 Learning Modules** across 4 phases: Foundations, Building Wealth, Building Assets, Long-Term Mastery
- **18+ Financial Calculators**: Compound growth, budgeting, debt payoff, retirement planning, and more
- **Progress Tracking**: Track your learning journey with detailed progress metrics
- **Goal Setting**: Set and track financial goals
- **Achievement System**: Earn badges for completing milestones
- **AI-Powered Guidance**: Context-aware assistance throughout your learning (placeholder)
- **Interactive Content**: Engaging learning experience with activities and reflections

## Tech Stack

### Frontend
- React 18.3+ with TypeScript
- Vite for fast development
- Tailwind CSS for styling
- React Query for data fetching
- Zustand for state management
- Recharts for data visualization

### Backend
- Node.js 20+ with Express
- TypeScript for type safety
- Prisma ORM with PostgreSQL 16+
- JWT authentication
- RESTful API architecture

### Infrastructure
- Docker & Docker Compose
- PostgreSQL database
- Monorepo with npm workspaces

## Project Structure

```
finance-learning-platform/
├── packages/
│   ├── shared/      # Shared TypeScript types, validators, constants
│   ├── backend/     # Express API server
│   └── frontend/    # React web application
├── docs/            # Project documentation
└── docker-compose.yml
```

## 🚀 Quick Start

### Automated Setup (Recommended)

```bash
./setup.sh
```

This script will:
- Check prerequisites
- Install dependencies
- Build the shared package
- Start Docker services
- Run database migrations
- Seed all 17 course modules
- Test the API

### Manual Setup

**Prerequisites:**
- Node.js 20+ LTS
- Docker & Docker Compose
- Git

**Steps:**

1. Copy environment variables:
```bash
cp .env.example .env
```

2. Install dependencies:
```bash
npm install
```

3. Build shared package:
```bash
cd packages/shared && npm install && npm run build && cd ../..
```

4. Start services:
```bash
npm run dev
```

5. In a new terminal, run migrations and seed:
```bash
docker-compose exec backend npx prisma migrate dev --name init
docker-compose exec backend npm run seed
```

### Services

- **Backend API:** http://localhost:3000
- **Database:** localhost:5432
- **Health Check:** http://localhost:3000/health

## Development Commands

```bash
# Start all services
npm run dev

# Start services in background
npm run dev:detached

# Stop all services
npm run down

# Rebuild Docker images
npm run build

# Clean everything
npm run clean
```

## Database Management

```bash
# Generate Prisma client
docker-compose exec backend npx prisma generate

# Create migration
docker-compose exec backend npx prisma migrate dev --name <migration-name>

# Run migrations
docker-compose exec backend npx prisma migrate deploy

# Seed database
docker-compose exec backend npm run seed

# Access database CLI
docker-compose exec postgres psql -U finance_user -d finance_platform_dev
```

## Documentation

Comprehensive documentation is available in the `/docs` directory:

- [Project Setup](docs/01-project-setup.md)
- [Shared Package](docs/02-shared-package.md)
- More documentation coming as features are built

## Architecture

The application uses a monorepo structure with three main packages:

1. **Shared Package**: TypeScript types, Zod validators, and constants shared between frontend and backend
2. **Backend**: Express API with Prisma ORM, handling authentication, module management, calculators, and progress tracking
3. **Frontend**: React SPA with modern tooling for the user interface

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Modules
- `GET /api/modules` - List all modules
- `GET /api/modules/:id` - Get module details
- `GET /api/modules/:id/content` - Get module content

### Progress
- `POST /api/progress/module/:id/start` - Start module
- `PUT /api/progress/module/:id` - Update progress
- `POST /api/progress/section/:id/complete` - Complete section
- `GET /api/progress/summary` - Get progress summary

### Calculators
- `GET /api/calculators` - List calculator types
- `POST /api/calculators/:type` - Save calculator
- `GET /api/calculators/saved` - Get saved calculators
- `PUT /api/calculators/:id` - Update calculator
- `DELETE /api/calculators/:id` - Delete calculator

### Goals
- `GET /api/goals` - List user goals
- `POST /api/goals` - Create goal
- `PUT /api/goals/:id` - Update goal
- `DELETE /api/goals/:id` - Delete goal

### AI
- `POST /api/ai/chat` - Send message to AI
- `GET /api/ai/conversations` - Get conversation history
- `GET /api/ai/prompt-templates` - Get prompt templates

## Contributing

This is a learning platform project. Contributions should maintain:
- TypeScript strict mode
- No emoji characters in code or UI
- Professional, clean design
- Comprehensive type safety
- Proper error handling

## License

[Add your license here]

## Contact

[Add contact information]

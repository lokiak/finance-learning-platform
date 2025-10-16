# Finance Learning Platform 🎓💰

A comprehensive web application that teaches personal finance through an interactive, module-based learning system combining educational content, interactive financial calculators, progress tracking, and goal management.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-61dafb)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20-green)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791)](https://www.postgresql.org/)

## 🎯 Project Status: Feature Complete

**✅ Fully Implemented:**
- ✨ Complete backend API with 27 endpoints
- 🔐 Authentication system with JWT
- 💾 Database schema with 11 models
- 📚 All 17 course modules seeded and ready
- 📊 Interactive dashboard with progress tracking
- 🎓 Module viewing system with section navigation
- 🧮 6 fully functional financial calculators with charts
- 🎯 Goals management system
- 👤 User profile management
- 📱 Responsive design across all pages

## ✨ Features

### 📚 Learning System
- **17 Learning Modules** across 4 phases:
  - Phase 1: Foundations (Your Money Story, Financial Snapshot, Budgeting, Debt Strategy, Emergency Fund)
  - Phase 2: Building Wealth (Investment Foundations, Accounts, Portfolio Building, Index Funds & ETFs)
  - Phase 3: Building Assets & Major Goals (Home Ownership, Mortgage Mastery, Home Equity, Life Goals)
  - Phase 4: Long-Term Mastery (Retirement Planning, Tax Optimization, Estate Planning, Financial Independence)
- **Section-by-section navigation** through module content
- **Multiple content types**: Text with key takeaways, interactive exercises, calculator activities, AI prompts
- **Progress tracking** at section, module, and phase levels

### 🧮 Financial Calculators
Interactive calculators with real-time visualizations:
- **Compound Growth Calculator** - See investment growth over time with line charts
- **Budget Planner** - 50/30/20 rule with pie chart breakdown
- **Debt Payoff Calculator** - Plan debt repayment strategy and timeline
- **Emergency Fund Calculator** - Determine your target emergency fund
- **Retirement Planner** - Project retirement balance and years in retirement
- **Mortgage Calculator** - Calculate monthly payments and total interest

### 🎯 Goals & Profile
- **Goal Management**: Create, track, and manage financial goals
- **Progress Tracking**: Visual progress bars for each goal
- **Categories**: Savings, debt payoff, investment, retirement, and more
- **User Profile**: Manage age, income, risk tolerance, and financial status
- **Profile Completion**: Track and complete your financial profile

### 📊 Dashboard
- **Progress Overview**: Total progress, modules completed, time invested
- **Phase Progress**: Visual progress for all 4 learning phases
- **Recent Activity**: Timeline of module starts and completions
- **Achievements**: Display earned achievement badges
- **Quick Actions**: Easy access to continue learning and tools

## 🛠 Tech Stack

### Frontend
- **React 18.3+** with TypeScript 5.5+
- **Vite 5.4+** for fast development and building
- **Tailwind CSS 3.4+** for utility-first styling
- **React Query 5.x** for server state management
- **Zustand 4.x** for client state management
- **Recharts 2.x** for data visualization
- **React Router 6.x** for navigation
- **Axios** for HTTP requests

### Backend
- **Node.js 20+** with Express 4.19+
- **TypeScript 5.5+** for type safety
- **Prisma 5.x** ORM with PostgreSQL 16+
- **JWT** authentication with bcrypt
- **Zod** for runtime validation
- **RESTful API** architecture

### Infrastructure
- **Docker & Docker Compose** for containerization
- **PostgreSQL 16+** database
- **Nginx** for frontend serving in production
- **Monorepo** with npm workspaces

## 📁 Project Structure

```
finance-learning-platform/
├── packages/
│   ├── shared/           # Shared TypeScript types, validators, constants
│   │   ├── src/
│   │   │   ├── types/    # User, Module, Calculator, Goal types
│   │   │   ├── validators/ # Zod schemas for validation
│   │   │   └── constants/ # Error codes, limits, module data
│   │   └── package.json
│   │
│   ├── backend/          # Express API server
│   │   ├── src/
│   │   │   ├── routes/   # API route handlers
│   │   │   ├── services/ # Business logic
│   │   │   ├── middleware/ # Auth, validation, error handling
│   │   │   └── index.ts
│   │   ├── prisma/
│   │   │   ├── schema.prisma # Database schema
│   │   │   └── seed.ts   # Database seeding
│   │   └── package.json
│   │
│   └── frontend/         # React web application
│       ├── src/
│       │   ├── components/ # Reusable UI components
│       │   ├── pages/     # Page components
│       │   ├── services/  # API client
│       │   ├── stores/    # State management
│       │   └── main.tsx
│       └── package.json
│
├── docs/                 # Project documentation
├── docker-compose.yml    # Docker services configuration
├── .env.example          # Environment variables template
└── setup.sh              # Automated setup script
```

## 🚀 Quick Start

### Prerequisites

- **Node.js 20+ LTS** - [Download](https://nodejs.org/)
- **Docker & Docker Compose** - [Download](https://www.docker.com/get-started)
- **Git** - [Download](https://git-scm.com/)

### Automated Setup (Recommended)

```bash
# Clone the repository
git clone https://github.com/lokiak/finance-learning-platform.git
cd finance-learning-platform

# Run the setup script
chmod +x setup.sh
./setup.sh
```

The setup script will:
1. ✅ Check prerequisites (Node.js, Docker, npm)
2. 📦 Install all dependencies
3. 🔨 Build the shared package
4. 🐳 Start Docker services (PostgreSQL, Backend, Frontend)
5. 🗄️ Run database migrations
6. 🌱 Seed all 17 course modules with content
7. 🧪 Test the API health endpoint

### Manual Setup

1. **Clone and setup environment:**
```bash
git clone https://github.com/lokiak/finance-learning-platform.git
cd finance-learning-platform
cp .env.example .env
```

2. **Install dependencies:**
```bash
npm install
```

3. **Build shared package:**
```bash
cd packages/shared
npm install
npm run build
cd ../..
```

4. **Start Docker services:**
```bash
npm run dev
```

5. **In a new terminal, run migrations and seed:**
```bash
# Run database migrations
docker-compose exec backend npx prisma migrate dev --name init

# Seed the database with all 17 modules
docker-compose exec backend npm run seed
```

6. **Access the application:**
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000
- Database: localhost:5432

### First Login

After setup, you can register a new account or use these test credentials if you've seeded test data:
- Email: `user@example.com`
- Password: `Password123`

## 📝 Development Commands

```bash
# Start all services (PostgreSQL, Backend, Frontend)
npm run dev

# Start services in background
npm run dev:detached

# Stop all services
npm run down

# Rebuild Docker images
npm run build

# Clean everything (containers, volumes, images)
npm run clean

# View logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f backend
docker-compose logs -f frontend
```

## 🗄️ Database Management

```bash
# Generate Prisma client after schema changes
docker-compose exec backend npx prisma generate

# Create a new migration
docker-compose exec backend npx prisma migrate dev --name <migration-name>

# Run pending migrations (production)
docker-compose exec backend npx prisma migrate deploy

# Seed the database with module content
docker-compose exec backend npm run seed

# Reset database (⚠️ destroys all data)
docker-compose exec backend npx prisma migrate reset

# Access PostgreSQL CLI
docker-compose exec postgres psql -U finance_user -d finance_platform_dev

# Prisma Studio (visual database browser)
docker-compose exec backend npx prisma studio
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user info
- `POST /api/auth/logout` - Logout user

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/dashboard` - Get dashboard data

### Modules
- `GET /api/modules` - List all modules (with progress)
- `GET /api/modules/:id` - Get module details with content

### Progress
- `POST /api/progress/module/:moduleId/start` - Start a module
- `PUT /api/progress/module/:moduleId` - Update module progress
- `POST /api/progress/section/:sectionId/complete` - Complete section
- `GET /api/progress/summary` - Get overall progress summary

### Calculators
- `GET /api/calculators` - List calculator types
- `POST /api/calculators/:type` - Save calculator result
- `GET /api/calculators/saved` - Get saved calculators
- `PUT /api/calculators/:id` - Update saved calculator
- `DELETE /api/calculators/:id` - Delete saved calculator

### Goals
- `GET /api/goals` - List user goals
- `POST /api/goals` - Create new goal
- `PUT /api/goals/:id` - Update goal
- `DELETE /api/goals/:id` - Delete goal

### Achievements
- `GET /api/achievements` - List user achievements
- `POST /api/achievements/:type/claim` - Claim achievement

### AI (Placeholder)
- `POST /api/ai/chat` - Send message to AI assistant
- `GET /api/ai/conversations` - Get conversation history
- `GET /api/ai/prompt-templates` - Get AI prompt templates

## 📖 Documentation

Detailed documentation is available in the `/docs` directory:

- [Project Setup](docs/01-project-setup.md) - Initial project scaffolding
- [Shared Package](docs/02-shared-package.md) - Shared types and validators
- [Backend API](docs/03-backend-api.md) - Complete API documentation
- [Setup Guide](docs/04-setup-guide.md) - Development setup instructions
- [Project Status](docs/05-project-status.md) - Current implementation status
- [Technical Spec](docs/technical_spec.md) - Original project specification

## 🏗️ Architecture

### Monorepo Structure
The project uses npm workspaces to manage three interconnected packages:

1. **Shared Package** (`@finance-platform/shared`)
   - TypeScript types and interfaces
   - Zod validation schemas
   - Error codes and constants
   - Imported by both frontend and backend

2. **Backend Package**
   - Express.js REST API
   - Prisma ORM for database access
   - JWT-based authentication
   - Business logic and data validation

3. **Frontend Package**
   - React SPA with TypeScript
   - Tailwind CSS for styling
   - React Query for data fetching
   - Zustand for state management

### Data Flow

```
User → Frontend (React) → API Client (Axios) → Backend (Express)
                                                      ↓
                                                   Prisma ORM
                                                      ↓
                                                  PostgreSQL
```

### Authentication Flow

1. User registers/logs in via frontend
2. Backend validates credentials and generates JWT
3. Frontend stores JWT in localStorage
4. JWT included in Authorization header for protected routes
5. Backend middleware verifies JWT on each request

## 🎨 UI Components

The application uses a custom component library built with Tailwind CSS:

- **Button** - Multiple variants (primary, secondary, outline, danger, ghost)
- **Input** - Text inputs with labels, errors, and validation
- **Card** - Containers with consistent styling and hover effects
- **Badge** - Status indicators with color variants
- **ProgressBar** - Visual progress indicators
- **Notification** - Toast notifications for user feedback

## 🧪 Testing

```bash
# Run backend tests (when implemented)
cd packages/backend
npm test

# Run frontend tests (when implemented)
cd packages/frontend
npm test

# Run all tests
npm test
```

## 🚀 Production Deployment

### Building for Production

```bash
# Build all packages
npm run build

# Or build individually
cd packages/backend && npm run build
cd packages/frontend && npm run build
```

### Docker Production Build

```bash
# Build production images
docker-compose -f docker-compose.prod.yml build

# Start in production mode
docker-compose -f docker-compose.prod.yml up -d
```

### Environment Variables

Required environment variables for production:

```bash
# Database
DATABASE_URL="postgresql://user:password@host:5432/dbname"

# Backend
NODE_ENV="production"
PORT=3000
JWT_SECRET="your-secure-random-secret-here"
JWT_EXPIRES_IN="24h"

# Frontend
VITE_API_URL="https://your-api-domain.com"
```

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

- Use TypeScript strict mode
- Follow existing code style and conventions
- Write meaningful commit messages
- Keep UI professional and clean
- Ensure type safety throughout
- Test your changes before submitting

## 📜 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Author

Built with Claude Code - An AI-powered development tool

## 🙏 Acknowledgments

- Course content structure inspired by personal finance best practices
- Calculator formulas based on standard financial mathematics
- UI design following modern web application patterns

## 📞 Support

For questions or issues:
- Open an issue on GitHub
- Check existing documentation in `/docs`
- Review API endpoint documentation above

---

**Note**: This is a learning platform project. The AI functionality is currently a placeholder and would need integration with an actual AI service (like Claude API or OpenAI) for production use.

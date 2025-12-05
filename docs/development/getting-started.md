# Getting Started - Development Guide

Quick start guide for developers working on the Finance Learning Platform.

## Prerequisites

- **Node.js** 20+ LTS
- **Docker Desktop**
- **Git**
- **Code Editor** (VS Code recommended)

## Quick Start

### 1. Clone Repository

```bash
git clone <repository-url>
cd finance-learning-platform
```

### 2. Install Dependencies

```bash
npm install
```

This installs dependencies for all packages (root, shared, backend, frontend).

### 3. Start Development Environment

```bash
docker-compose up -d
```

This starts:
- PostgreSQL database (port 5432)
- Backend API (port 3000)
- Frontend (port 5173)

### 4. Setup Database

```bash
# Run migrations
docker-compose exec backend npx prisma migrate dev

# Generate Prisma Client
docker-compose exec backend npx prisma generate

# Seed database (optional)
docker-compose exec backend npm run seed
```

### 5. Build Shared Package

```bash
cd packages/shared
npm run build
cd ../..
```

### 6. Verify Setup

```bash
# Test backend
curl http://localhost:3000/health

# Should return:
# {"status":"ok","timestamp":"..."}
```

## Development Workflow

### Backend Development

1. Make changes in `packages/backend/src/`
2. Backend auto-reloads on file changes
3. Check logs: `docker-compose logs -f backend`

### Frontend Development

1. Make changes in `packages/frontend/src/`
2. Frontend hot-reloads automatically
3. Open browser: `http://localhost:5173`

### Database Changes

1. Update `packages/backend/prisma/schema.prisma`
2. Create migration: `docker-compose exec backend npx prisma migrate dev --name <name>`
3. Prisma Client auto-regenerates

### Shared Package Changes

1. Update `packages/shared/src/`
2. Rebuild: `cd packages/shared && npm run build`
3. Backend/Frontend will use updated types

## Project Structure

```
finance-learning-platform/
├── packages/
│   ├── shared/          # Shared types, validators
│   ├── backend/         # Express API
│   └── frontend/        # React app
├── docs/                # Documentation
└── docker-compose.yml   # Development environment
```

## Common Commands

### Backend

```bash
# Run backend
docker-compose up backend

# View logs
docker-compose logs -f backend

# Run tests
docker-compose exec backend npm test

# Database migrations
docker-compose exec backend npx prisma migrate dev
docker-compose exec backend npx prisma generate
docker-compose exec backend npx prisma studio
```

### Frontend

```bash
# Run frontend
docker-compose up frontend

# View logs
docker-compose logs -f frontend

# Build for production
cd packages/frontend && npm run build
```

### Database

```bash
# Access PostgreSQL CLI
docker-compose exec postgres psql -U finance_user -d finance_platform_dev

# Reset database (⚠️ destroys data)
docker-compose exec backend npx prisma migrate reset

# View database in browser
docker-compose exec backend npx prisma studio
```

## Development Tips

### Hot Reload

- Backend: Auto-reloads on file changes
- Frontend: Hot module replacement (HMR)
- Database: Migrations apply automatically

### Debugging

**Backend:**
- Use `console.log()` (visible in Docker logs)
- Attach debugger on port 9229 (if configured)
- Check logs: `docker-compose logs backend`

**Frontend:**
- Use browser DevTools
- React DevTools extension recommended
- Check console for errors

### TypeScript

- Type errors shown in IDE
- Run type check: `npx tsc --noEmit`
- Shared package types available after build

## Next Steps

- Read [Project Structure](./project-structure.md)
- Review [Database Schema](./database-schema.md)
- Check [Type System](./type-system.md)
- See [Testing Overview](../testing/overview.md)

## Troubleshooting

### Port Already in Use

```bash
# Find process using port
lsof -i :3000
lsof -i :5173

# Kill process
kill -9 <PID>
```

### Database Connection Issues

```bash
# Check PostgreSQL is running
docker-compose ps postgres

# Restart database
docker-compose restart postgres

# Check connection
docker-compose exec backend npx prisma db push
```

### Type Errors

```bash
# Rebuild shared package
cd packages/shared && npm run build

# Regenerate Prisma Client
docker-compose exec backend npx prisma generate

# Restart TypeScript server in IDE
```

### Docker Issues

```bash
# Rebuild containers
docker-compose build --no-cache

# Clean up
docker-compose down -v
docker-compose up -d
```

## Getting Help

1. Check [Documentation Index](../README.md)
2. Review error messages carefully
3. Check Docker logs
4. Verify environment variables
5. Ensure all services are running


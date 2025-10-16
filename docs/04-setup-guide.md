# Finance Learning Platform - Setup Guide

## Prerequisites

Before starting, ensure you have the following installed:

- **Node.js** 20+ LTS ([Download](https://nodejs.org/))
- **Docker Desktop** ([Download](https://www.docker.com/products/docker-desktop))
- **Git** ([Download](https://git-scm.com/downloads))

## Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd finance-learning-platform
```

### 2. Install Dependencies

```bash
npm install
```

This installs dependencies for the root workspace and all packages (shared, backend, frontend).

### 3. Create Environment File

```bash
cp .env.example .env
```

Edit `.env` if needed (defaults are fine for development):

```env
# Database
POSTGRES_USER=finance_user
POSTGRES_PASSWORD=finance_password
POSTGRES_DB=finance_platform_dev

# Backend
JWT_SECRET=your-secret-key-change-in-production
NODE_ENV=development
PORT=3000

# Frontend
VITE_API_URL=http://localhost:3000
```

### 4. Build Shared Package

The shared package must be built before the backend can use it:

```bash
cd packages/shared
npm install
npm run build
cd ../..
```

### 5. Start Services with Docker

```bash
npm run dev
```

This starts:
- PostgreSQL database on port 5432
- Backend API on port 3000
- Frontend (when created) on port 5173

**First-time startup:** Docker will build images, which takes 5-10 minutes.

### 6. Run Database Migrations

In a new terminal:

```bash
docker-compose exec backend npx prisma migrate dev --name init
```

### 7. Seed the Database

Populate with all 17 course modules:

```bash
docker-compose exec backend npm run seed
```

### 8. Verify Installation

Test the API:

```bash
curl http://localhost:3000/health
```

Should return:
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Manual Setup (Without Docker)

If you prefer to run services manually:

### 1. Start PostgreSQL

Install and start PostgreSQL, then create database:

```sql
CREATE DATABASE finance_platform_dev;
CREATE USER finance_user WITH PASSWORD 'finance_password';
GRANT ALL PRIVILEGES ON DATABASE finance_platform_dev TO finance_user;
```

### 2. Update Environment Variables

Update `DATABASE_URL` in `.env`:

```env
DATABASE_URL=postgresql://finance_user:finance_password@localhost:5432/finance_platform_dev
```

### 3. Build Shared Package

```bash
cd packages/shared
npm install
npm run build
```

### 4. Setup Backend

```bash
cd packages/backend
npm install
npx prisma generate
npx prisma migrate dev
npm run seed
npm run dev
```

Backend will start on port 3000.

## Development Workflow

### Starting Services

```bash
# Start all services
npm run dev

# Start in background
npm run dev:detached

# Stop services
npm run down
```

### Viewing Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f postgres
```

### Database Management

```bash
# Access PostgreSQL CLI
docker-compose exec postgres psql -U finance_user -d finance_platform_dev

# Run Prisma Studio (Database GUI)
docker-compose exec backend npx prisma studio
```

Prisma Studio opens at http://localhost:5555

### Creating Database Migrations

When you modify the Prisma schema:

```bash
docker-compose exec backend npx prisma migrate dev --name <migration_name>
```

### Resetting Database

```bash
# Warning: This deletes all data
docker-compose exec backend npx prisma migrate reset
docker-compose exec backend npm run seed
```

### Rebuilding Docker Images

After dependency changes:

```bash
npm run build
```

Or rebuild specific service:

```bash
docker-compose build backend
```

## Testing the API

### Register a User

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123",
    "name": "Test User"
  }'
```

Save the returned `token`.

### Get Modules

```bash
curl http://localhost:3000/api/modules \
  -H "Authorization: Bearer <your_token>"
```

### Start a Module

```bash
curl -X POST http://localhost:3000/api/progress/module/<module_id>/start \
  -H "Authorization: Bearer <your_token>"
```

### Update Profile

```bash
curl -X PUT http://localhost:3000/api/users/profile \
  -H "Authorization: Bearer <your_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "age": 28,
    "current_income": 75000,
    "risk_tolerance": "moderate",
    "has_debt": false,
    "has_emergency_fund": true
  }'
```

## Project Structure

```
finance-learning-platform/
├── packages/
│   ├── shared/              # Shared types, validators, constants
│   │   ├── src/
│   │   │   ├── types/       # TypeScript interfaces
│   │   │   ├── validators/  # Zod schemas
│   │   │   └── constants/   # App constants
│   │   └── dist/            # Compiled output
│   │
│   ├── backend/             # Express API
│   │   ├── src/
│   │   │   ├── routes/      # API endpoints
│   │   │   ├── services/    # Business logic
│   │   │   ├── middleware/  # Express middleware
│   │   │   └── db/
│   │   │       └── prisma/
│   │   │           ├── schema.prisma
│   │   │           └── seed.ts
│   │   └── Dockerfile
│   │
│   └── frontend/            # React app (to be created)
│
├── docs/                    # Documentation
├── docker-compose.yml
├── .env.example
└── README.md
```

## Common Issues

### Port Already in Use

If ports 3000, 5173, or 5432 are in use:

```bash
# Find process using port
lsof -i :3000

# Kill process
kill -9 <PID>
```

Or change ports in `docker-compose.yml` and `.env`.

### Database Connection Errors

1. Ensure PostgreSQL container is healthy:
```bash
docker-compose ps
```

2. Check database logs:
```bash
docker-compose logs postgres
```

3. Restart database:
```bash
docker-compose restart postgres
```

### Prisma Client Not Generated

If you see "Cannot find module '@prisma/client'":

```bash
docker-compose exec backend npx prisma generate
```

### Module Import Errors

If backend can't find shared package:

```bash
cd packages/shared
npm run build
docker-compose restart backend
```

### Docker Build Failures

Clear Docker cache and rebuild:

```bash
docker-compose down
docker system prune -a
npm run build
```

## Environment Variables

### Backend Variables

- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: Secret key for JWT signing (change in production)
- `NODE_ENV`: development | production
- `PORT`: API server port (default 3000)

### Frontend Variables (when created)

- `VITE_API_URL`: Backend API URL

## Production Deployment

### Prerequisites

- Production PostgreSQL database
- Environment with Docker support (AWS ECS, DigitalOcean, etc.)
- Domain name and SSL certificate

### Steps

1. **Set Production Environment Variables**

Create `.env.production`:

```env
DATABASE_URL=<production_database_url>
JWT_SECRET=<strong_random_secret>
NODE_ENV=production
```

2. **Build Production Images**

```bash
docker-compose -f docker-compose.prod.yml build
```

3. **Run Migrations**

```bash
docker-compose -f docker-compose.prod.yml run backend npx prisma migrate deploy
```

4. **Seed Database**

```bash
docker-compose -f docker-compose.prod.yml run backend npm run seed
```

5. **Start Services**

```bash
docker-compose -f docker-compose.prod.yml up -d
```

### Security Checklist

- [ ] Use strong JWT_SECRET (32+ random characters)
- [ ] Enable HTTPS
- [ ] Set secure database password
- [ ] Configure CORS for production domain
- [ ] Enable rate limiting
- [ ] Set up database backups
- [ ] Configure logging and monitoring
- [ ] Review Prisma schema indexes for performance
- [ ] Set up SSL for PostgreSQL connection

## Next Steps

1. **Test the API** - Use the examples above or Postman
2. **Build the Frontend** - React app to consume the API
3. **Implement Calculator Logic** - Add real calculations for all calculator types
4. **Add Real AI Integration** - Connect to Claude API or similar
5. **Write Tests** - Unit and integration tests
6. **Set Up CI/CD** - Automated testing and deployment

## Support

For issues or questions:
1. Check documentation in `/docs`
2. Review API documentation (`docs/03-backend-api.md`)
3. Check shared package types (`packages/shared/src/types`)
4. Review Prisma schema (`packages/backend/prisma/schema.prisma`)

## Additional Resources

- [Prisma Documentation](https://www.prisma.io/docs)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [Docker Compose Reference](https://docs.docker.com/compose/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

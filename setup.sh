#!/bin/bash

# Finance Learning Platform Setup Script
# This script automates the initial setup process

set -e

echo "================================"
echo "Finance Learning Platform Setup"
echo "================================"
echo ""

# Check for required tools
echo "Checking prerequisites..."

if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 20+ from https://nodejs.org/"
    exit 1
fi

if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker from https://www.docker.com/products/docker-desktop"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose"
    exit 1
fi

echo "✅ All prerequisites found"
echo ""

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "Creating .env file from .env.example..."
    cp .env.example .env
    echo "✅ Created .env file"
else
    echo "✅ .env file already exists"
fi
echo ""

# Install dependencies
echo "Installing dependencies..."
npm install
echo "✅ Dependencies installed"
echo ""

# Build shared package
echo "Building shared package..."
cd packages/shared
npm install
npm run build
cd ../..
echo "✅ Shared package built"
echo ""

# Start Docker services
echo "Starting Docker services (this may take several minutes on first run)..."
docker-compose up -d postgres
echo "Waiting for PostgreSQL to be ready..."
sleep 10
echo "✅ Database started"
echo ""

# Start backend
echo "Starting backend..."
docker-compose up -d backend
echo "Waiting for backend to be ready..."
sleep 15
echo "✅ Backend started"
echo ""

# Run migrations
echo "Running database migrations..."
docker-compose exec -T backend npx prisma generate
docker-compose exec -T backend npx prisma migrate deploy 2>/dev/null || docker-compose exec -T backend npx prisma migrate dev --name init
echo "✅ Migrations complete"
echo ""

# Seed database
echo "Seeding database with course modules..."
docker-compose exec -T backend npm run seed
echo "✅ Database seeded"
echo ""

# Test API
echo "Testing API..."
response=$(curl -s http://localhost:3000/health || echo "failed")
if [[ $response == *"ok"* ]]; then
    echo "✅ API is responding"
else
    echo "⚠️  API may not be ready yet. Give it a few more seconds."
fi
echo ""

echo "================================"
echo "Setup Complete!"
echo "================================"
echo ""
echo "Your Finance Learning Platform is ready!"
echo ""
echo "Services:"
echo "  - Backend API: http://localhost:3000"
echo "  - Database:    localhost:5432"
echo "  - Health:      http://localhost:3000/health"
echo ""
echo "Useful commands:"
echo "  - View logs:        docker-compose logs -f"
echo "  - Stop services:    docker-compose down"
echo "  - Restart:          docker-compose restart"
echo "  - Database CLI:     docker-compose exec postgres psql -U finance_user -d finance_platform_dev"
echo "  - Prisma Studio:    docker-compose exec backend npx prisma studio"
echo ""
echo "Next steps:"
echo "1. Test the API with the examples in docs/03-backend-api.md"
echo "2. Read the setup guide in docs/04-setup-guide.md"
echo "3. Review project status in docs/05-project-status.md"
echo ""
echo "To create a test user:"
echo "  curl -X POST http://localhost:3000/api/auth/register \\"
echo "    -H 'Content-Type: application/json' \\"
echo "    -d '{\"email\":\"test@example.com\",\"password\":\"TestPass123\",\"name\":\"Test User\"}'"
echo ""

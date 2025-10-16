# Project Setup Documentation

## Overview

This document describes the initial setup of the Finance Learning Platform monorepo structure.

## Monorepo Structure

The project uses a monorepo architecture with npm workspaces to share code between packages:

```
finance-learning-platform/
├── packages/
│   ├── shared/        # Shared TypeScript types, validators, constants
│   ├── backend/       # Node.js/Express API server
│   └── frontend/      # React web application
├── docs/              # Project documentation
├── package.json       # Root package with workspaces
└── docker-compose.yml # Docker orchestration
```

## Root Package

**Location:** `/package.json`

### Purpose
- Defines npm workspaces for the monorepo
- Provides convenience scripts for development
- Manages top-level dev dependencies

### Key Scripts
- `dev`: Start all services with Docker Compose
- `dev:detached`: Start services in background
- `down`: Stop all Docker services
- `build`: Build all Docker images
- `clean`: Remove containers, volumes, and node_modules

### Dependencies
- TypeScript 5.5.4: Type checking across all packages
- @types/node 20.11.19: Node.js type definitions

## Benefits of Monorepo Architecture

1. **Code Sharing**: Shared package provides types and validators to both frontend and backend
2. **Type Safety**: End-to-end type safety from API to UI
3. **Single Source of Truth**: Constants and types defined once
4. **Simplified Development**: Start all services with one command
5. **Version Management**: Single version for shared dependencies

## Next Steps

After setup:
1. Install dependencies: `npm install`
2. Build shared package: `cd packages/shared && npm run build`
3. Start services: `npm run dev`

## Git Repository

Initialized with: `git init`

Recommended .gitignore entries:
```
node_modules/
dist/
build/
.env
.env.local
*.log
.DS_Store
```

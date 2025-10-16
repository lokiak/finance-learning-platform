# Base stage
FROM node:20-alpine AS base
WORKDIR /app

# Copy package files
COPY package.json ./
COPY packages/shared/package.json ./packages/shared/
COPY packages/backend/package.json ./packages/backend/

# Install dependencies
RUN npm install

# Copy source code
COPY packages/shared ./packages/shared
COPY packages/backend ./packages/backend

# Build shared package
WORKDIR /app/packages/shared
RUN npm run build

# Generate Prisma client
WORKDIR /app/packages/backend
RUN npx prisma generate

# Development stage
FROM base AS development
WORKDIR /app
EXPOSE 3000
CMD ["npm", "run", "dev", "--workspace=@finance-platform/backend"]

# Production build stage
FROM base AS builder
WORKDIR /app/packages/backend
RUN npm run build

# Production stage
FROM node:20-alpine AS production
WORKDIR /app

ENV NODE_ENV=production

# Copy package files
COPY package.json ./
COPY packages/shared/package.json ./packages/shared/
COPY packages/backend/package.json ./packages/backend/

# Install production dependencies only
RUN npm install --production

# Copy built files
COPY --from=builder /app/packages/shared/dist ./packages/shared/dist
COPY --from=builder /app/packages/backend/dist ./packages/backend/dist
COPY --from=builder /app/packages/backend/prisma ./packages/backend/prisma

# Generate Prisma client
WORKDIR /app/packages/backend
RUN npx prisma generate

WORKDIR /app
EXPOSE 3000
CMD ["node", "packages/backend/dist/index.js"]

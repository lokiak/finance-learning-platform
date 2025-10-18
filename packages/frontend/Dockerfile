# Base stage
FROM node:20-alpine AS base
WORKDIR /app

# Copy package files
COPY package.json ./
COPY packages/shared/package.json ./packages/shared/
COPY packages/frontend/package.json ./packages/frontend/

# Install dependencies
RUN npm install

# Copy source code
COPY packages/shared ./packages/shared
COPY packages/frontend ./packages/frontend

# Build shared package
WORKDIR /app/packages/shared
RUN npm run build

# Development stage
FROM base AS development
WORKDIR /app/packages/frontend
# Create symlink to root node_modules for workspace resolution
RUN ln -sf /app/node_modules ./node_modules
EXPOSE 5173
CMD ["npm", "run", "dev"]

# Production build stage
FROM base AS builder
WORKDIR /app/packages/frontend
RUN npm run build

# Production stage
FROM nginx:alpine AS production
COPY --from=builder /app/packages/frontend/dist /usr/share/nginx/html
COPY packages/frontend/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

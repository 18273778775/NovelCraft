# Multi-stage build for React frontend
FROM node:18-alpine AS base

# Install pnpm
RUN npm install -g pnpm

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/shared/package.json ./packages/shared/
COPY apps/frontend/package.json ./apps/frontend/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Build stage
FROM base AS builder

# Copy source code
COPY packages/shared ./packages/shared
COPY apps/frontend ./apps/frontend
COPY tsconfig.json ./

# Build shared package first
RUN pnpm --filter shared build

# Build frontend
ARG VITE_API_URL=http://localhost:3001/api
ARG VITE_APP_NAME="Novel Craft"
ARG VITE_APP_VERSION="1.0.0"

ENV VITE_API_URL=$VITE_API_URL
ENV VITE_APP_NAME=$VITE_APP_NAME
ENV VITE_APP_VERSION=$VITE_APP_VERSION

RUN pnpm --filter frontend build

# Production stage with Nginx
FROM nginx:alpine AS production

# Copy custom nginx config
COPY apps/frontend/nginx.conf /etc/nginx/conf.d/default.conf

# Copy built application
COPY --from=builder /app/apps/frontend/dist /usr/share/nginx/html

# Add non-root user
RUN addgroup -g 1001 -S nginx-group
RUN adduser -S nginx-user -u 1001 -G nginx-group

# Change ownership of nginx directories
RUN chown -R nginx-user:nginx-group /var/cache/nginx /var/run /var/log/nginx /usr/share/nginx/html

# Switch to non-root user
USER nginx-user

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/ || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]

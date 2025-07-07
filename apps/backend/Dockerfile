# Single-stage build for Node.js backend
FROM node:18-alpine

# Install pnpm
RUN npm install -g pnpm

# Create app user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nestjs -u 1001

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/shared/package.json ./packages/shared/
COPY apps/backend/package.json ./apps/backend/

# Install dependencies
RUN pnpm install --force

# Copy source code
COPY packages/shared ./packages/shared
COPY apps/backend ./apps/backend
COPY tsconfig.json ./

# Build shared package first
RUN pnpm --filter shared build

# Generate Prisma client
RUN pnpm --filter backend db:generate

# Build backend
RUN pnpm --filter backend build

# Change ownership
RUN chown -R nestjs:nodejs /app

# Switch to non-root user
USER nestjs

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3001/api/health || exit 1

# Start the application
CMD ["node", "apps/backend/dist/apps/backend/src/main.js"]

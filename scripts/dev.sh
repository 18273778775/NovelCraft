#!/bin/bash

# Novel Craft Development Environment Setup
set -e

echo "🛠️ Setting up Novel Craft development environment..."

# Check if pnpm is installed
if ! command -v pnpm &> /dev/null; then
    echo "❌ pnpm is not installed. Please install it first:"
    echo "   npm install -g pnpm"
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
pnpm install

# Generate Prisma client
echo "🗄️ Generating Prisma client..."
pnpm db:generate

# Check if .env file exists for backend
if [ ! -f apps/backend/.env ]; then
    echo "📝 Creating backend .env file..."
    cp apps/backend/.env.example apps/backend/.env 2>/dev/null || echo "# Backend environment variables
NODE_ENV=development
PORT=3001
DATABASE_URL=\"file:./dev.db\"
JWT_SECRET=\"your-super-secret-jwt-key-change-this-in-production\"
JWT_EXPIRES_IN=\"7d\"
DEEPSEEK_API_KEY=\"your-deepseek-api-key-here\"
DEEPSEEK_API_URL=\"https://api.deepseek.com\"
DEEPSEEK_MODEL=\"deepseek-chat\"
CORS_ORIGIN=\"http://localhost:3000\"
MAX_FILE_SIZE=10485760
UPLOAD_DEST=\"./uploads\"
THROTTLE_TTL=60000
THROTTLE_LIMIT=100" > apps/backend/.env
fi

# Setup database
echo "🗄️ Setting up database..."
pnpm --filter backend db:push

# Build shared package
echo "🔨 Building shared package..."
pnpm --filter shared build

# Build backend
echo "🔨 Building backend..."
pnpm --filter backend build

echo "✅ Development environment setup completed!"
echo ""
echo "🚀 To start the development servers:"
echo "   Terminal 1: pnpm backend:dev"
echo "   Terminal 2: pnpm frontend:dev"
echo ""
echo "📱 Application URLs:"
echo "   Frontend: http://localhost:3000"
echo "   Backend API: http://localhost:3001/api"
echo "   API Documentation: http://localhost:3001/api/docs"

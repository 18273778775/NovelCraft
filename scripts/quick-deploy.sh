#!/bin/bash

# Novel Craft Quick Deploy Script (using Docker Hub images)
# This script allows users to deploy without building locally

set -e

echo "🚀 Novel Craft Quick Deploy (using Docker Hub images)"
echo "=================================================="

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    echo "   Visit: https://docs.docker.com/get-docker/"
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    echo "   Visit: https://docs.docker.com/compose/install/"
    exit 1
fi

# Create project directory if it doesn't exist
PROJECT_DIR="novel-craft-deploy"
if [ ! -d "$PROJECT_DIR" ]; then
    echo "📁 Creating project directory: $PROJECT_DIR"
    mkdir -p $PROJECT_DIR
fi

cd $PROJECT_DIR

# Download necessary files
echo "📥 Downloading configuration files..."

# Create .env file
cat > .env << 'EOF'
# Database Configuration
DB_PASSWORD=secure_password_change_me

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-use-at-least-32-chars

# AI Services Configuration
DEEPSEEK_API_KEY=sk-64f2396064214545a04cb81ed9dc0380
DOUBAO_API_KEY=2836e8fe-8f55-4eb9-9b68-bfca206e678e
DOUBAO_MODEL_ID=doubao-pro-4k

# CORS Configuration
CORS_ORIGIN=http://localhost:3000

# Frontend Configuration
VITE_API_URL=http://localhost:3001/api
EOF

# Create docker-compose file
cat > docker-compose.yml << 'EOF'
version: '3.8'

services:
  database:
    image: postgres:15-alpine
    container_name: novel-craft-db
    restart: unless-stopped
    environment:
      POSTGRES_DB: novel_craft
      POSTGRES_USER: novel_craft_user
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    networks:
      - novel-craft-network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U novel_craft_user -d novel_craft"]
      interval: 30s
      timeout: 10s
      retries: 3

  backend:
    image: 18273778775/novel-craft-backend:latest
    container_name: novel-craft-backend
    restart: unless-stopped
    environment:
      NODE_ENV: production
      PORT: 3001
      DATABASE_URL: postgresql://novel_craft_user:${DB_PASSWORD}@database:5432/novel_craft?schema=public
      JWT_SECRET: ${JWT_SECRET}
      JWT_EXPIRES_IN: 7d
      DEEPSEEK_API_KEY: ${DEEPSEEK_API_KEY}
      DEEPSEEK_API_URL: https://api.deepseek.com
      DEEPSEEK_MODEL: deepseek-chat
      DOUBAO_API_KEY: ${DOUBAO_API_KEY}
      DOUBAO_API_URL: https://ark.cn-beijing.volces.com/api/v3
      DOUBAO_MODEL_ID: ${DOUBAO_MODEL_ID}
      CORS_ORIGIN: ${CORS_ORIGIN}
      MAX_FILE_SIZE: 10485760
      UPLOAD_DEST: ./uploads
      THROTTLE_TTL: 60000
      THROTTLE_LIMIT: 100
    ports:
      - "3001:3001"
    depends_on:
      database:
        condition: service_healthy
    networks:
      - novel-craft-network
    volumes:
      - backend_uploads:/app/uploads
    healthcheck:
      test: ["CMD-SHELL", "wget --no-verbose --tries=1 --spider http://localhost:3001/api/health || exit 1"]
      interval: 30s
      timeout: 10s
      retries: 3

  frontend:
    image: 18273778775/novel-craft-frontend:latest
    container_name: novel-craft-frontend
    restart: unless-stopped
    ports:
      - "3000:3000"
    depends_on:
      backend:
        condition: service_healthy
    networks:
      - novel-craft-network
    healthcheck:
      test: ["CMD-SHELL", "wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1"]
      interval: 30s
      timeout: 10s
      retries: 3

volumes:
  postgres_data:
    driver: local
  backend_uploads:
    driver: local

networks:
  novel-craft-network:
    driver: bridge
EOF

echo "✅ Configuration files created successfully!"
echo ""
echo "🔧 You can edit the .env file to customize your configuration"
echo ""

# Pull latest images
echo "📥 Pulling latest Docker images..."
docker-compose pull

# Start services
echo "🚀 Starting Novel Craft services..."
docker-compose up -d

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 30

# Check service health
echo "🔍 Checking service health..."
if docker-compose ps | grep -q "Up (healthy)"; then
    echo "✅ Services are running successfully!"
else
    echo "⚠️  Some services may still be starting. Check with: docker-compose ps"
fi

echo ""
echo "🎉 Novel Craft deployment completed!"
echo ""
echo "📱 Access your application:"
echo "   Frontend: http://localhost:3000"
echo "   Backend API: http://localhost:3001/api"
echo "   API Documentation: http://localhost:3001/api/docs"
echo "   Health Check: http://localhost:3001/api/health"
echo ""
echo "🔧 Management commands:"
echo "   View logs: docker-compose logs -f"
echo "   Stop services: docker-compose down"
echo "   Restart: docker-compose restart"
echo "   Update: docker-compose pull && docker-compose up -d"

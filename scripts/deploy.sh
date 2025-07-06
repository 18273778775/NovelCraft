#!/bin/bash

# Novel Craft Deployment Script
set -e

echo "🚀 Starting Novel Craft deployment..."

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ .env file not found. Please copy .env.example to .env and configure it."
    exit 1
fi

# Load environment variables
source .env

# Check required environment variables
required_vars=("DB_PASSWORD" "JWT_SECRET" "DEEPSEEK_API_KEY")
for var in "${required_vars[@]}"; do
    if [ -z "${!var}" ]; then
        echo "❌ Required environment variable $var is not set"
        exit 1
    fi
done

echo "✅ Environment variables validated"

# Build and start services
echo "🔨 Building and starting services..."

if [ "$1" = "prod" ]; then
    echo "🏭 Production deployment"
    docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build
else
    echo "🧪 Development deployment"
    docker-compose up -d --build
fi

# Wait for services to be healthy
echo "⏳ Waiting for services to be healthy..."
sleep 30

# Run database migrations
echo "🗄️ Running database migrations..."
docker-compose exec backend pnpm db:push

# Check service health
echo "🔍 Checking service health..."
services=("database" "backend" "frontend")

for service in "${services[@]}"; do
    if docker-compose ps $service | grep -q "Up (healthy)"; then
        echo "✅ $service is healthy"
    else
        echo "❌ $service is not healthy"
        docker-compose logs $service
        exit 1
    fi
done

echo "🎉 Deployment completed successfully!"
echo ""
echo "📱 Application URLs:"
echo "   Frontend: http://localhost:3000"
echo "   Backend API: http://localhost:3001/api"
echo "   API Documentation: http://localhost:3001/api/docs"
echo ""
echo "🔧 Management commands:"
echo "   View logs: docker-compose logs -f [service]"
echo "   Stop services: docker-compose down"
echo "   Update services: ./scripts/deploy.sh"

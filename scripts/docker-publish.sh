#!/bin/bash

# Novel Craft Docker Hub Publishing Script
set -e

# Configuration
DOCKER_USERNAME="18273778775"
BACKEND_IMAGE="novel-craft-backend"
FRONTEND_IMAGE="novel-craft-frontend"
VERSION=${1:-"latest"}

echo "🐳 Publishing Novel Craft Docker images to Docker Hub..."
echo "Version: $VERSION"

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Login to Docker Hub (you'll need to run: docker login)
echo "🔐 Please ensure you're logged in to Docker Hub (run 'docker login' if needed)"

# Build backend image
echo "🔨 Building backend image..."
docker build -t $DOCKER_USERNAME/$BACKEND_IMAGE:$VERSION -f apps/backend/Dockerfile .
docker tag $DOCKER_USERNAME/$BACKEND_IMAGE:$VERSION $DOCKER_USERNAME/$BACKEND_IMAGE:latest

# Build frontend image
echo "🔨 Building frontend image..."
docker build -t $DOCKER_USERNAME/$FRONTEND_IMAGE:$VERSION -f apps/frontend/Dockerfile .
docker tag $DOCKER_USERNAME/$FRONTEND_IMAGE:$VERSION $DOCKER_USERNAME/$FRONTEND_IMAGE:latest

# Push backend image
echo "📤 Pushing backend image..."
docker push $DOCKER_USERNAME/$BACKEND_IMAGE:$VERSION
docker push $DOCKER_USERNAME/$BACKEND_IMAGE:latest

# Push frontend image
echo "📤 Pushing frontend image..."
docker push $DOCKER_USERNAME/$FRONTEND_IMAGE:$VERSION
docker push $DOCKER_USERNAME/$FRONTEND_IMAGE:latest

echo "✅ Successfully published Docker images!"
echo ""
echo "📱 Published images:"
echo "   Backend: $DOCKER_USERNAME/$BACKEND_IMAGE:$VERSION"
echo "   Frontend: $DOCKER_USERNAME/$FRONTEND_IMAGE:$VERSION"
echo ""
echo "🚀 To use these images:"
echo "   docker pull $DOCKER_USERNAME/$BACKEND_IMAGE:$VERSION"
echo "   docker pull $DOCKER_USERNAME/$FRONTEND_IMAGE:$VERSION"
echo ""
echo "📋 Or use the provided docker-compose-hub.yml file"

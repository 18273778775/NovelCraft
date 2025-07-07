#!/bin/bash

# Novel Craft GitHub Packages Publishing Script
set -e

echo "🚀 Publishing Novel Craft CLI package to GitHub Packages..."
echo "Version: 1.2.0"

# Check if NPM_TOKEN is set
if [ -z "$NPM_TOKEN" ]; then
    echo "❌ NPM_TOKEN environment variable is not set."
    echo "Please set your GitHub Personal Access Token:"
    echo "export NPM_TOKEN=your_github_token_here"
    echo ""
    echo "Token需要以下权限:"
    echo "  - write:packages"
    echo "  - read:packages"
    echo "  - repo (如果仓库是私有的)"
    exit 1
fi

# Check if we're logged in to npm
if ! npm whoami --registry=https://npm.pkg.github.com > /dev/null 2>&1; then
    echo "🔐 Logging in to GitHub Packages..."
    echo "//npm.pkg.github.com/:_authToken=$NPM_TOKEN" > ~/.npmrc
    echo "@18273778775:registry=https://npm.pkg.github.com" >> ~/.npmrc
fi

# Verify login
echo "🔍 Verifying GitHub Packages access..."
if ! npm whoami --registry=https://npm.pkg.github.com > /dev/null 2>&1; then
    echo "❌ GitHub Packages login failed"
    echo "Please check your NPM_TOKEN"
    exit 1
fi

echo "✅ GitHub Packages access verified"

# Build shared package first
echo "🔨 Building shared package..."
pnpm --filter shared build

# Publish shared package
echo "📦 Publishing shared package..."
cd packages/shared
npm publish --registry=https://npm.pkg.github.com
cd ../..

echo "✅ Shared package published successfully!"

# Prepare main CLI package
echo "📋 Preparing main CLI package for publishing..."

# Ensure bin directory exists and is executable
if [ ! -f "bin/novel-craft.js" ]; then
    echo "❌ CLI script not found: bin/novel-craft.js"
    exit 1
fi

chmod +x bin/novel-craft.js

# Ensure main entry exists
if [ ! -f "index.js" ]; then
    echo "❌ Main entry not found: index.js"
    exit 1
fi

# Test CLI locally
echo "🧪 Testing CLI locally..."
node bin/novel-craft.js --version

echo "📦 Publishing main CLI package..."
# Publish main CLI package directly
npm publish --registry=https://npm.pkg.github.com

echo "✅ Successfully published Novel Craft packages to GitHub Packages!"
echo ""
echo "📦 Published packages:"
echo "   @18273778775/novel-craft-shared@1.2.0"
echo "   @18273778775/novel-craft@1.2.0"
echo ""
echo "🎉 Your Novel Craft CLI tool is now available!"
echo ""
echo "🔧 Anyone can now install and use:"
echo "   npm install -g @18273778775/novel-craft"
echo "   # or use directly with npx"
echo "   npx @18273778775/novel-craft create my-novel-app"
echo ""
echo "🚀 Quick start for users:"
echo "   npx @18273778775/novel-craft create my-novel-app"
echo "   cd my-novel-app"
echo "   novel-craft setup"
echo "   novel-craft dev"
echo ""
echo "📱 After setup, access at:"
echo "   Frontend: http://localhost:3000"
echo "   API: http://localhost:3001/api"
echo "   Docs: http://localhost:3001/api/docs"
echo ""
echo "📚 Package page: https://github.com/18273778775/NovelCraft/packages"

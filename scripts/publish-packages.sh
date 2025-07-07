#!/bin/bash

# Novel Craft GitHub Packages Publishing Script
set -e

echo "🚀 Publishing Novel Craft packages to GitHub Packages..."

# Check if NPM_TOKEN is set
if [ -z "$NPM_TOKEN" ]; then
    echo "❌ NPM_TOKEN environment variable is not set."
    echo "Please set your GitHub Personal Access Token:"
    echo "export NPM_TOKEN=your_github_token_here"
    exit 1
fi

# Check if we're logged in to npm
if ! npm whoami --registry=https://npm.pkg.github.com > /dev/null 2>&1; then
    echo "🔐 Logging in to GitHub Packages..."
    echo "//npm.pkg.github.com/:_authToken=$NPM_TOKEN" > ~/.npmrc
    echo "@18273778775:registry=https://npm.pkg.github.com" >> ~/.npmrc
fi

# Build shared package
echo "🔨 Building shared package..."
pnpm --filter shared build

# Publish shared package
echo "📦 Publishing shared package..."
cd packages/shared
npm publish --registry=https://npm.pkg.github.com
cd ../..

# Build and prepare main package
echo "🔨 Building main package..."
pnpm build

# Create a publishable version of the main package
echo "📋 Preparing main package for publishing..."

# Create a temporary package.json for publishing
cat > package-publish.json << EOF
{
  "name": "@18273778775/novel-craft",
  "version": "1.1.0",
  "description": "AI-powered novel editing and polishing system - Complete Application",
  "main": "index.js",
  "bin": {
    "novel-craft": "./bin/novel-craft.js"
  },
  "scripts": {
    "start": "node bin/novel-craft.js",
    "install-deps": "pnpm install",
    "setup": "pnpm install && pnpm db:generate",
    "dev": "pnpm backend:dev & pnpm frontend:dev",
    "build": "pnpm build"
  },
  "publishConfig": {
    "registry": "https://npm.pkg.github.com"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/18273778775/NovelCraft.git"
  },
  "keywords": [
    "novel",
    "ai",
    "writing",
    "editing",
    "deepseek",
    "nestjs",
    "react",
    "typescript"
  ],
  "author": "18273778775",
  "license": "MIT",
  "bugs": {
    "url": "https://github.com/18273778775/NovelCraft/issues"
  },
  "homepage": "https://github.com/18273778775/NovelCraft#readme",
  "engines": {
    "node": ">=18.0.0",
    "pnpm": ">=8.0.0"
  },
  "dependencies": {
    "@18273778775/novel-craft-shared": "^1.1.0"
  },
  "peerDependencies": {
    "pnpm": ">=8.0.0"
  }
}
EOF

# Create CLI entry point
mkdir -p bin
cat > bin/novel-craft.js << 'EOF'
#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('🎨 Novel Craft - AI-powered Novel Editing System');
console.log('================================================');

const command = process.argv[2];

switch (command) {
  case 'init':
    console.log('📁 Initializing Novel Craft project...');
    // Copy template files or clone repository
    execSync('git clone https://github.com/18273778775/NovelCraft.git novel-craft-project', { stdio: 'inherit' });
    console.log('✅ Project initialized! Run: cd novel-craft-project && pnpm install');
    break;
    
  case 'dev':
    console.log('🚀 Starting development servers...');
    execSync('pnpm backend:dev & pnpm frontend:dev', { stdio: 'inherit' });
    break;
    
  case 'build':
    console.log('🔨 Building application...');
    execSync('pnpm build', { stdio: 'inherit' });
    break;
    
  case 'setup':
    console.log('⚙️ Setting up Novel Craft...');
    execSync('pnpm install && pnpm db:generate', { stdio: 'inherit' });
    console.log('✅ Setup complete!');
    break;
    
  default:
    console.log(`
📖 Usage: novel-craft <command>

Commands:
  init     Initialize a new Novel Craft project
  setup    Install dependencies and setup database
  dev      Start development servers
  build    Build the application
  
Examples:
  novel-craft init
  novel-craft setup
  novel-craft dev

📚 Documentation: https://github.com/18273778775/NovelCraft
🐛 Issues: https://github.com/18273778775/NovelCraft/issues
`);
}
EOF

chmod +x bin/novel-craft.js

# Create main entry point
cat > index.js << 'EOF'
// Novel Craft - AI-powered Novel Editing System
// This package provides the complete Novel Craft application

const packageInfo = require('./package.json');

console.log(`Novel Craft v${packageInfo.version}`);
console.log('AI-powered novel editing and polishing system');
console.log('');
console.log('To get started:');
console.log('1. Run: novel-craft init');
console.log('2. Follow the setup instructions');
console.log('');
console.log('Documentation: https://github.com/18273778775/NovelCraft');

module.exports = {
  version: packageInfo.version,
  name: packageInfo.name,
  description: packageInfo.description
};
EOF

# Publish main package
echo "📦 Publishing main package..."
cp package-publish.json package.json
npm publish --registry=https://npm.pkg.github.com

# Restore original package.json
git checkout package.json

# Clean up
rm -f package-publish.json index.js
rm -rf bin

echo "✅ Successfully published Novel Craft packages to GitHub Packages!"
echo ""
echo "📦 Published packages:"
echo "   @18273778775/novel-craft-shared@1.1.0"
echo "   @18273778775/novel-craft@1.1.0"
echo ""
echo "🔧 Team members can install with:"
echo "   npm install @18273778775/novel-craft"
echo "   # or"
echo "   pnpm add @18273778775/novel-craft"
echo ""
echo "🚀 Quick start for team:"
echo "   npx @18273778775/novel-craft init"
echo "   cd novel-craft-project"
echo "   pnpm install"
echo "   pnpm dev"

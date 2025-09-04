#!/bin/bash

# ReWear Deployment Script
# This script helps automate the deployment process

echo "🚀 ReWear Deployment Script"
echo "=========================="

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "❌ Git repository not found. Please initialize git first:"
    echo "   git init"
    echo "   git add ."
    echo "   git commit -m 'Initial commit'"
    exit 1
fi

# Check if remote origin exists
if ! git remote get-url origin > /dev/null 2>&1; then
    echo "❌ No remote origin found. Please add your GitHub repository:"
    echo "   git remote add origin https://github.com/yourusername/rewear.git"
    exit 1
fi

echo "✅ Git repository is ready"

# Check Node.js version
NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18 or higher is required. Current version: $(node --version)"
    exit 1
fi

echo "✅ Node.js version is compatible: $(node --version)"

# Install dependencies
echo "📦 Installing dependencies..."

echo "Installing backend dependencies..."
cd backend
npm install
cd ..

echo "Installing frontend dependencies..."
cd frontend
npm install
cd ..

echo "✅ Dependencies installed successfully"

# Build frontend
echo "🔨 Building frontend..."
cd frontend
npm run build
cd ..

echo "✅ Frontend built successfully"

# Check if .env files exist
echo "🔍 Checking environment files..."

if [ ! -f "backend/.env" ]; then
    echo "⚠️  Backend .env file not found. Please create it using backend/env.example as a template."
fi

if [ ! -f "frontend/.env" ]; then
    echo "⚠️  Frontend .env file not found. Please create it using frontend/env.example as a template."
fi

echo ""
echo "🎯 Deployment Options:"
echo "1. Vercel (Recommended) - Follow DEPLOYMENT_GUIDE.md"
echo "2. Heroku + Netlify - Follow DEPLOYMENT_GUIDE.md"
echo "3. Railway - Follow DEPLOYMENT_GUIDE.md"
echo ""
echo "📋 Next Steps:"
echo "1. Set up MongoDB Atlas database"
echo "2. Set up Cloudinary account"
echo "3. Create .env files with your credentials"
echo "4. Choose your deployment platform"
echo "5. Follow the detailed guide in DEPLOYMENT_GUIDE.md"
echo ""
echo "📚 Documentation:"
echo "- DEPLOYMENT_GUIDE.md - Complete deployment instructions"
echo "- DEPLOYMENT_FIXES.md - Common issues and solutions"
echo "- README.md - Project overview and setup"
echo ""
echo "🎉 Ready to deploy! Good luck!"

@echo off
REM ReWear Deployment Script for Windows
REM This script helps automate the deployment process

echo 🚀 ReWear Deployment Script
echo ==========================

REM Check if git is initialized
if not exist ".git" (
    echo ❌ Git repository not found. Please initialize git first:
    echo    git init
    echo    git add .
    echo    git commit -m "Initial commit"
    pause
    exit /b 1
)

echo ✅ Git repository is ready

REM Check Node.js version
for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo ✅ Node.js version: %NODE_VERSION%

REM Install dependencies
echo 📦 Installing dependencies...

echo Installing backend dependencies...
cd backend
call npm install
cd ..

echo Installing frontend dependencies...
cd frontend
call npm install
cd ..

echo ✅ Dependencies installed successfully

REM Build frontend
echo 🔨 Building frontend...
cd frontend
call npm run build
cd ..

echo ✅ Frontend built successfully

REM Check if .env files exist
echo 🔍 Checking environment files...

if not exist "backend\.env" (
    echo ⚠️  Backend .env file not found. Please create it using backend\env.example as a template.
)

if not exist "frontend\.env" (
    echo ⚠️  Frontend .env file not found. Please create it using frontend\env.example as a template.
)

echo.
echo 🎯 Deployment Options:
echo 1. Vercel (Recommended) - Follow DEPLOYMENT_GUIDE.md
echo 2. Heroku + Netlify - Follow DEPLOYMENT_GUIDE.md
echo 3. Railway - Follow DEPLOYMENT_GUIDE.md
echo.
echo 📋 Next Steps:
echo 1. Set up MongoDB Atlas database
echo 2. Set up Cloudinary account
echo 3. Create .env files with your credentials
echo 4. Choose your deployment platform
echo 5. Follow the detailed guide in DEPLOYMENT_GUIDE.md
echo.
echo 📚 Documentation:
echo - DEPLOYMENT_GUIDE.md - Complete deployment instructions
echo - DEPLOYMENT_FIXES.md - Common issues and solutions
echo - README.md - Project overview and setup
echo.
echo 🎉 Ready to deploy! Good luck!
pause

@echo off
echo 🚀 Starting Trendix deployment...

REM Check if .env.local exists
if not exist .env.local (
    echo ⚠️  Warning: .env.local not found. Please create it with your API keys.
    echo 📝 See DEPLOYMENT.md for required environment variables.
)

REM Install dependencies
echo 📦 Installing dependencies...
call npm install

REM Run type checking
echo 🔍 Running type checks...
call npm run typecheck

REM Build the project
echo 🏗️  Building project...
call npm run build

REM Check if build was successful
if %errorlevel% equ 0 (
    echo ✅ Build successful!
    echo 🌐 Your app is ready for deployment!
    echo.
    echo Next steps:
    echo 1. Set up your environment variables in .env.local
    echo 2. Choose a deployment platform (Firebase App Hosting, Vercel, etc.)
    echo 3. Deploy using your chosen platform's CLI
    echo.
    echo 📖 See DEPLOYMENT.md for detailed instructions
) else (
    echo ❌ Build failed. Please fix the errors and try again.
    exit /b 1
)

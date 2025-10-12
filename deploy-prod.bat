@echo off
echo 🚀 Deploying Trendix to Production...

echo.
echo 📦 Building project...
call npm run build
if %errorlevel% neq 0 (
    echo ❌ Build failed!
    pause
    exit /b 1
)

echo.
echo 🔥 Deploying Firestore rules...
call firebase deploy --only firestore:rules
if %errorlevel% neq 0 (
    echo ❌ Firestore rules deployment failed!
    pause
    exit /b 1
)

echo.
echo 🌐 Deploying to Firebase hosting...
call firebase deploy --only hosting
if %errorlevel% neq 0 (
    echo ❌ Hosting deployment failed!
    pause
    exit /b 1
)

echo.
echo ✅ Production deployment complete!
echo.
echo 📋 Next steps:
echo 1. Set environment variables in Firebase Console
echo 2. Configure Facebook App for production domain
echo 3. Add production domain to Firebase Auth
echo 4. Test user settings and Facebook connection
echo.
echo 📖 See PRODUCTION_FIX.md for detailed instructions
echo.
pause

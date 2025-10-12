#!/bin/bash

echo "🚀 Deploying Trendix to Production..."

echo ""
echo "📦 Building project..."
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

echo ""
echo "🔥 Deploying Firestore rules..."
firebase deploy --only firestore:rules
if [ $? -ne 0 ]; then
    echo "❌ Firestore rules deployment failed!"
    exit 1
fi

echo ""
echo "🌐 Deploying to Firebase hosting..."
firebase deploy --only hosting
if [ $? -ne 0 ]; then
    echo "❌ Hosting deployment failed!"
    exit 1
fi

echo ""
echo "✅ Production deployment complete!"
echo ""
echo "📋 Next steps:"
echo "1. Set environment variables in Firebase Console"
echo "2. Configure Facebook App for production domain"
echo "3. Add production domain to Firebase Auth"
echo "4. Test user settings and Facebook connection"
echo ""
echo "📖 See PRODUCTION_FIX.md for detailed instructions"
echo ""

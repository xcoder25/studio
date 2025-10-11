#!/bin/bash

# Trendix Deployment Script
echo "🚀 Starting Trendix deployment..."

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "⚠️  Warning: .env.local not found. Please create it with your API keys."
    echo "📝 See DEPLOYMENT.md for required environment variables."
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Run type checking
echo "🔍 Running type checks..."
npm run typecheck

# Build the project
echo "🏗️  Building project..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo "🌐 Your app is ready for deployment!"
    echo ""
    echo "Next steps:"
    echo "1. Set up your environment variables in .env.local"
    echo "2. Choose a deployment platform (Firebase App Hosting, Vercel, etc.)"
    echo "3. Deploy using your chosen platform's CLI"
    echo ""
    echo "📖 See DEPLOYMENT.md for detailed instructions"
else
    echo "❌ Build failed. Please fix the errors and try again."
    exit 1
fi

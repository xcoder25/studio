# Trendix - All-in-One Social Media Manager

Trendix is an AI-powered platform for social media management, content creation, and video generation. It combines content creation, scheduling, analytics, and an AI-powered video editor into one seamless platform.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Firebase project (already configured)
- Google AI API key (for AI features)
- Paystack API keys (for payments)

### Installation

1. **Clone and install dependencies:**
   ```bash
   git clone <your-repo-url>
   cd studio
   npm install
   ```

2. **Set up environment variables:**
   Create a `.env.local` file with your API keys (see DEPLOYMENT.md for details)

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Access the application:**
   Open [http://localhost:9002](http://localhost:9002) in your browser

## 🎯 Features

- **AI Content Generation** - Create engaging social media posts, captions, and hashtags
- **Content Scheduling** - Plan and automate your content calendar
- **AI Video Editor** - Generate videos from text prompts or images
- **Performance Analytics** - Track growth and engagement
- **Image & Asset Library** - Organize brand assets
- **Multi-Platform Support** - Twitter, Instagram, Facebook, TikTok, YouTube
- **Team Collaboration** - Agency features for managing multiple clients

## 🛠️ Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run typecheck    # Run TypeScript checks
npm run lint         # Run ESLint
```

### Project Structure

```
src/
├── ai/              # AI flows and Genkit configuration
├── app/             # Next.js app router pages
├── components/      # Reusable UI components
├── context/         # React contexts
├── hooks/           # Custom React hooks
└── lib/             # Utilities and configurations
```

## 🚀 Deployment

### Quick Deploy

Run the deployment script:
```bash
# Windows
deploy.bat

# Unix/Linux/Mac
./deploy.sh
```

### Manual Deployment

1. **Build the project:**
   ```bash
   npm run build
   ```

2. **Deploy to your preferred platform:**
   - **Firebase App Hosting:** `firebase deploy`
   - **Vercel:** `vercel --prod`
   - **Netlify:** Upload the `out` folder

### Environment Variables

Required environment variables (see DEPLOYMENT.md for full list):

```env
# Firebase (already configured)
NEXT_PUBLIC_FIREBASE_PROJECT_ID=studio-6206919014-a31aa
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyAMRXTBSLRyeWkAw1KegOkokAHwlHKwenM

# Google AI (required for AI features)
GOOGLE_GENAI_API_KEY=your_google_ai_api_key_here

# Paystack (required for payments)
PAYSTACK_SECRET_KEY=your_paystack_secret_key_here
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=your_paystack_public_key_here
```

## 📱 Pages & Features

- **Landing Page** (`/`) - Marketing site with pricing
- **Authentication** (`/login`, `/signup`) - User authentication
- **Dashboard** (`/dashboard`) - Analytics and overview
- **Composer** (`/composer`) - AI-powered content creation
- **Video Generator** (`/video-generator`) - AI video editing tools
- **YouTube Studio** (`/youtube-studio`) - YouTube management
- **Calendar** (`/calendar`) - Content scheduling
- **Library** (`/library`) - Asset management
- **Settings** (`/settings`) - User preferences
- **Pricing** (`/pricing`) - Subscription management

## 🔧 Tech Stack

- **Frontend:** Next.js 15, React 18, TypeScript
- **Styling:** Tailwind CSS, Radix UI
- **AI:** Google Genkit, Gemini AI
- **Database:** Firebase Firestore
- **Authentication:** Firebase Auth
- **Payments:** Paystack
- **Deployment:** Firebase App Hosting (recommended)

## 📖 Documentation

- [Deployment Guide](DEPLOYMENT.md) - Detailed deployment instructions
- [API Documentation](docs/) - API reference and guides

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and type checks
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues:
1. Check the console for errors
2. Verify all environment variables are set
3. Ensure all API keys are valid
4. Check Firebase project configuration

---

**Ready to launch your social media empire? 🚀**

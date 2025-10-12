# 🚨 Production Fix Guide

## Current Issues in Production

Your production deployment is failing because:

1. **Missing Environment Variables** - Firebase hosting doesn't have access to your local `.env.local` file
2. **Firestore Rules Not Deployed** - Security rules are only local, not in production
3. **Facebook App Configuration** - Facebook app needs production domain configuration
4. **Firebase Auth Domain** - Production domain not added to Firebase Auth

## 🔧 Step-by-Step Fix

### 1. Set Up Firebase Hosting Environment Variables

**Option A: Firebase Console (Recommended)**
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `studio-6206919014-a31aa`
3. Go to **Hosting** → **Environment Variables**
4. Add these variables:

```env
NEXT_PUBLIC_FIREBASE_PROJECT_ID=studio-6206919014-a31aa
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyAMRXTBSLRyeWkAw1KegOkokAHwlHKwenM
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=studio-6206919014-a31aa.firebaseapp.com
NEXT_PUBLIC_FACEBOOK_APP_ID=your_facebook_app_id_here
NEXT_PUBLIC_APP_URL=https://your-production-domain.com
```

**Option B: Firebase CLI**
```bash
# Set environment variables
firebase functions:config:set app.facebook_app_id="your_facebook_app_id"
firebase functions:config:set app.firebase_api_key="AIzaSyAMRXTBSLRyeWkAw1KegOkokAHwlHKwenM"
```

### 2. Deploy Firestore Security Rules

```bash
# Deploy Firestore rules to production
firebase deploy --only firestore:rules
```

### 3. Configure Facebook App for Production

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Select your Facebook App
3. Go to **Facebook Login** → **Settings**
4. Add your production domain to **Valid OAuth Redirect URIs**:
   - `https://your-production-domain.com/api/auth/facebook/callback`
5. Add production domain to **App Domains**:
   - `your-production-domain.com`

### 4. Update Firebase Auth Configuration

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `studio-6206919014-a31aa`
3. Go to **Authentication** → **Settings** → **Authorized domains**
4. Add your production domain:
   - `your-production-domain.com`

### 5. Update Production URLs

Update your production environment variables:

```env
# Production URLs
NEXT_PUBLIC_APP_URL=https://your-production-domain.com
NODE_ENV=production

# Facebook App Configuration
NEXT_PUBLIC_FACEBOOK_APP_ID=your_facebook_app_id_here
FACEBOOK_APP_SECRET=your_facebook_app_secret_here
```

### 6. Deploy to Production

```bash
# Build for production
npm run build

# Deploy to Firebase hosting
firebase deploy --only hosting
```

## 🔍 Debugging Production Issues

### Check Production Logs

1. **Firebase Console** → **Functions** → **Logs**
2. **Firebase Console** → **Hosting** → **Logs**
3. **Browser Console** on production site

### Common Production Errors

**"Failed to load user settings"**
- Check Firestore rules are deployed
- Verify user is authenticated
- Check Firebase Auth domain configuration

**"Facebook connection failed"**
- Verify Facebook App ID is set
- Check Facebook App domain configuration
- Ensure OAuth redirect URIs include production domain

**"Permission denied"**
- Deploy Firestore security rules
- Check user authentication status
- Verify Firebase project configuration

## 🚀 Quick Production Fix Commands

```bash
# 1. Deploy Firestore rules
firebase deploy --only firestore:rules

# 2. Deploy hosting
firebase deploy --only hosting

# 3. Check deployment status
firebase hosting:channel:list

# 4. View production logs
firebase functions:log
```

## 📱 Production Checklist

- [ ] Environment variables set in Firebase hosting
- [ ] Firestore security rules deployed
- [ ] Facebook App configured for production domain
- [ ] Firebase Auth domain includes production URL
- [ ] Production build successful
- [ ] User settings loading correctly
- [ ] Facebook connection working
- [ ] All social media connections functional

## 🆘 Still Having Issues?

1. **Check Firebase Console** for error logs
2. **Verify all environment variables** are set correctly
3. **Test authentication flow** in production
4. **Check browser console** for client-side errors
5. **Verify API keys** are valid and not expired

---

**Your production deployment should work after completing these steps! 🎉**

# Troubleshooting Guide

## User Settings Not Loading

### Issue: Settings page fails to load user data from Firestore

**Possible Causes:**
1. Firestore security rules blocking access
2. User not authenticated
3. Firestore not properly initialized
4. Missing environment variables

**Solutions:**

1. **Check Firestore Security Rules:**
   ```bash
   # Deploy Firestore rules
   firebase deploy --only firestore:rules
   ```

2. **Check Authentication:**
   - Ensure user is logged in
   - Check browser console for auth errors
   - Verify Firebase Auth is working

3. **Check Environment Variables:**
   Create `.env.local` file with:
   ```env
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=studio-6206919014-a31aa
   NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyAMRXTBSLRyeWkAw1KegOkokAHwlHKwenM
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=studio-6206919014-a31aa.firebaseapp.com
   ```

4. **Debug Steps:**
   - Open browser console
   - Check for Firestore errors
   - Look for "Loading user settings for:" logs
   - Check if user document exists

## Facebook Connection Issues

### Issue: Facebook OAuth not working

**Possible Causes:**
1. Missing Facebook App ID
2. Facebook App not configured properly
3. Invalid redirect URIs
4. Facebook SDK not loading

**Solutions:**

1. **Create Facebook App:**
   - Go to [Facebook Developers](https://developers.facebook.com/)
   - Create new app
   - Add Facebook Login product
   - Get App ID and App Secret

2. **Configure Facebook App:**
   - Add `http://localhost:9002` to Valid OAuth Redirect URIs
   - Add `http://localhost:9002/settings` to App Domains
   - Enable Facebook Login

3. **Set Environment Variables:**
   ```env
   NEXT_PUBLIC_FACEBOOK_APP_ID=your_facebook_app_id
   FACEBOOK_APP_SECRET=your_facebook_app_secret
   ```

4. **Debug Steps:**
   - Check browser console for Facebook SDK errors
   - Verify App ID is loaded: `console.log('Facebook App ID:', process.env.NEXT_PUBLIC_FACEBOOK_APP_ID)`
   - Check if `window.FB` is available after SDK loads

## Common Error Messages

### "Failed to load user settings"
- Check Firestore rules
- Verify user authentication
- Check network connectivity

### "Facebook connection failed"
- Verify Facebook App ID
- Check Facebook App configuration
- Ensure redirect URIs are correct

### "Permission denied"
- Check Firestore security rules
- Verify user is authenticated
- Check user document permissions

## Quick Fixes

1. **Restart Development Server:**
   ```bash
   npm run dev
   ```

2. **Clear Browser Cache:**
   - Clear localStorage
   - Clear cookies
   - Hard refresh (Ctrl+F5)

3. **Check Firebase Console:**
   - Verify Firestore database exists
   - Check security rules
   - Verify authentication is enabled

4. **Test Authentication:**
   - Try logging out and back in
   - Check if other Firebase features work
   - Verify user object in console

## Environment Variables Checklist

Make sure you have all required environment variables:

```env
# Firebase (Required)
NEXT_PUBLIC_FIREBASE_PROJECT_ID=studio-6206919014-a31aa
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyAMRXTBSLRyeWkAw1KegOkokAHwlHKwenM
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=studio-6206919014-a31aa.firebaseapp.com

# Facebook (Required for Facebook connection)
NEXT_PUBLIC_FACEBOOK_APP_ID=your_facebook_app_id
FACEBOOK_APP_SECRET=your_facebook_app_secret

# Other Social Media (Optional)
NEXT_PUBLIC_TWITTER_CLIENT_ID=your_twitter_client_id
TWITTER_CLIENT_SECRET=your_twitter_client_secret
# ... etc
```

## Still Having Issues?

1. Check browser console for specific error messages
2. Check Network tab for failed requests
3. Verify Firebase project configuration
4. Test with a fresh browser profile
5. Check if other users can access the app

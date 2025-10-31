# Social Media API Setup Guide

This guide provides step-by-step instructions for setting up OAuth 2.0 integrations with all supported social media platforms.

## 🔧 Platform-Specific Setup

### 1. Facebook OAuth 2.0 (Graph API v21.0)

**Required for:** Facebook login, page management, post publishing

**Setup Steps:**
1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create a new app → Choose "Consumer" or "Business"
3. Add "Facebook Login" product
4. Configure OAuth settings:
   - **Valid OAuth Redirect URIs:** `https://your-domain.com/api/auth/facebook/callback`
   - **App Domains:** `your-domain.com`
5. Get credentials:
   - **App ID** → `NEXT_PUBLIC_FACEBOOK_APP_ID`
   - **App Secret** → `FACEBOOK_APP_SECRET`

**Required Scopes:**
- `email` - User email
- `public_profile` - Basic profile info
- `pages_manage_posts` - Post to pages
- `pages_read_engagement` - Read page engagement

**API Endpoints Used:**
- Authorization: `https://www.facebook.com/v21.0/dialog/oauth`
- Token Exchange: `https://graph.facebook.com/v21.0/oauth/access_token`
- User Info: `https://graph.facebook.com/v21.0/me`

---

### 2. Twitter OAuth 2.0 with PKCE (API v2)

**Required for:** Twitter login, tweet reading, user info

**Setup Steps:**
1. Go to [Twitter Developer Portal](https://developer.twitter.com/)
2. Create a new project and app
3. Enable OAuth 2.0 with PKCE
4. Configure OAuth settings:
   - **Callback URL:** `https://your-domain.com/api/auth/twitter/callback`
   - **Website URL:** `https://your-domain.com`
5. Get credentials:
   - **Client ID** → `NEXT_PUBLIC_TWITTER_CLIENT_ID`
   - **Client Secret** → `TWITTER_CLIENT_SECRET`

**Required Scopes:**
- `tweet.read` - Read tweets
- `users.read` - Read user profiles
- `follows.read` - Read follow relationships

**API Endpoints Used:**
- Authorization: `https://twitter.com/i/oauth2/authorize`
- Token Exchange: `https://api.twitter.com/2/oauth2/token`
- User Info: `https://api.twitter.com/2/users/me`

**PKCE Implementation:**
- Code Challenge: Base64URL encoded random string
- Code Verifier: Random 32-byte string
- Method: `plain` (for development, use `S256` in production)

---

### 3. Instagram Basic Display API OAuth 2.0

**Required for:** Instagram login, media access, user info

**Setup Steps:**
1. Go to [Facebook Developers](https://developers.facebook.com/) (Instagram is owned by Facebook)
2. Create a new app → Choose "Consumer"
3. Add "Instagram Basic Display" product
4. Configure OAuth settings:
   - **Valid OAuth Redirect URIs:** `https://your-domain.com/api/auth/instagram/callback`
   - **Deauthorize Callback URL:** `https://your-domain.com/api/auth/instagram/deauthorize`
5. Get credentials:
   - **Client ID** → `NEXT_PUBLIC_INSTAGRAM_CLIENT_ID`
   - **Client Secret** → `INSTAGRAM_CLIENT_SECRET`

**Required Scopes:**
- `user_profile` - Basic profile info
- `user_media` - Access to user's media

**API Endpoints Used:**
- Authorization: `https://api.instagram.com/oauth/authorize`
- Token Exchange: `https://api.instagram.com/oauth/access_token`
- User Info: `https://graph.instagram.com/me`

**Note:** Instagram Basic Display API is for personal use only. For business features, use Instagram Graph API.

---

### 4. LinkedIn API v2 OAuth 2.0

**Required for:** LinkedIn login, profile access, company info

**Setup Steps:**
1. Go to [LinkedIn Developers](https://www.linkedin.com/developers/)
2. Create a new app
3. Configure OAuth settings:
   - **Authorized Redirect URLs:** `https://your-domain.com/api/auth/linkedin/callback`
   - **Authorized Domains:** `your-domain.com`
4. Get credentials:
   - **Client ID** → `NEXT_PUBLIC_LINKEDIN_CLIENT_ID`
   - **Client Secret** → `LINKEDIN_CLIENT_SECRET`

**Required Scopes:**
- `r_liteprofile` - Basic profile info
- `r_emailaddress` - Email address
- `w_member_social` - Post updates

**API Endpoints Used:**
- Authorization: `https://www.linkedin.com/oauth/v2/authorization`
- Token Exchange: `https://www.linkedin.com/oauth/v2/accessToken`
- User Info: `https://api.linkedin.com/v2/people/~`

---

### 5. YouTube Data API v3 OAuth 2.0

**Required for:** YouTube login, channel management, video access

**Setup Steps:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable YouTube Data API v3
4. Create OAuth 2.0 credentials:
   - **Application Type:** Web application
   - **Authorized Redirect URIs:** `https://your-domain.com/api/auth/youtube/callback`
5. Get credentials:
   - **Client ID** → `NEXT_PUBLIC_GOOGLE_CLIENT_ID`
   - **Client Secret** → `GOOGLE_CLIENT_SECRET`

**Required Scopes:**
- `https://www.googleapis.com/auth/youtube.readonly` - Read YouTube data
- `https://www.googleapis.com/auth/youtube.upload` - Upload videos
- `https://www.googleapis.com/auth/youtube.force-ssl` - Force SSL

**API Endpoints Used:**
- Authorization: `https://accounts.google.com/o/oauth2/v2/auth`
- Token Exchange: `https://oauth2.googleapis.com/token`
- Channel Info: `https://www.googleapis.com/youtube/v3/channels`

---

### 6. TikTok Login Kit (OAuth 2.0)

**Required for:** TikTok login, user info, video access

**Setup Steps:**
1. Go to [TikTok for Developers](https://developers.tiktok.com/)
2. Create a new app for "Login Kit"
3. Configure your app settings:
   - **Platform:** Web
   - **Site URL:** `https://your-domain.com`
   - **Redirect URI:** `https://your-domain.com/api/auth/tiktok/callback`
4. Get credentials:
   - **Client Key** → `NEXT_PUBLIC_TIKTOK_CLIENT_KEY`
   - **Client Secret** → `TIKTOK_CLIENT_SECRET`

**Required Scopes:**
- `user.info.basic`
- `video.list`

**API Endpoints Used:**
- Authorization: `https://www.tiktok.com/v2/auth/authorize/`
- Token Exchange: `https://open.tiktokapis.com/v2/oauth/token/`
- User Info: `https://open.tiktokapis.com/v2/user/info/`

---

## 🔐 Security Best Practices

### Environment Variables
- Never commit API keys to version control
- Use different keys for development and production
- Rotate keys regularly
- Use environment variable management tools

### OAuth Security
- Always use HTTPS in production
- Implement CSRF protection with state parameter
- Use PKCE for public clients (Twitter)
- Store access tokens securely
- Implement token refresh logic

### API Rate Limits
- **Facebook:** 200 calls per hour per user
- **Twitter:** 300 requests per 15-minute window
- **Instagram:** 200 calls per hour per user
- **LinkedIn:** 100,000 calls per day
- **YouTube:** 10,000 units per day

---

## 🚀 Production Deployment

### Firebase Hosting Environment Variables
```bash
# Set environment variables in Firebase Console
firebase functions:config:set \
  facebook.app_id="your_facebook_app_id" \
  facebook.app_secret="your_facebook_app_secret" \
  twitter.client_id="your_twitter_client_id" \
  twitter.client_secret="your_twitter_client_secret"
```

### Domain Configuration
Update all OAuth redirect URIs to use your production domain:
- `https://your-domain.com/api/auth/facebook/callback`
- `https://your-domain.com/api/auth/twitter/callback`
- `https://your-domain.com/api/auth/instagram/callback`
- `https://your-domain.com/api/auth/linkedin/callback`
- `https://your-domain.com/api/auth/youtube/callback`

### SSL Certificate
Ensure your production domain has a valid SSL certificate for OAuth to work properly.

---

## 🐛 Troubleshooting

### Common Issues

**"Invalid redirect URI"**
- Check that redirect URIs match exactly in developer console
- Ensure HTTPS is used in production
- Verify domain is added to authorized domains

**"Invalid client credentials"**
- Verify Client ID and Secret are correct
- Check that environment variables are set properly
- Ensure keys are not expired

**"Insufficient permissions"**
- Check that required scopes are requested
- Verify app has necessary permissions in developer console
- Ensure user has granted permissions

**"Rate limit exceeded"**
- Implement exponential backoff
- Cache API responses when possible
- Monitor API usage in developer consoles

### Debug Steps
1. Check browser console for OAuth errors
2. Verify network requests in browser dev tools
3. Check server logs for API call failures
4. Test OAuth flow in developer console
5. Verify environment variables are loaded

---

## 📚 Additional Resources

- [Facebook Graph API Documentation](https://developers.facebook.com/docs/graph-api)
- [Twitter API v2 Documentation](https://developer.twitter.com/en/docs/twitter-api)
- [Instagram Basic Display API](https://developers.facebook.com/docs/instagram-basic-display-api)
- [LinkedIn API Documentation](https://docs.microsoft.com/en-us/linkedin/)
- [YouTube Data API Documentation](https://developers.google.com/youtube/v3)
- [TikTok Login Kit Documentation](https://developers.tiktok.com/doc/login-kit-web)

---

**Your social media integrations are now properly configured! 🎉**

import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error');

  if (error) {
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/settings?error=twitter_auth_failed`);
  }

  if (!code || state !== 'twitter_auth') {
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/settings?error=invalid_twitter_auth`);
  }

  try {
    // Generate code verifier for PKCE (should match the one used in authorization)
    const codeVerifier = crypto.randomBytes(32).toString('base64url');
    
    // Exchange code for access token using PKCE
    const tokenResponse = await fetch('https://api.twitter.com/2/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(`${process.env.NEXT_PUBLIC_TWITTER_CLIENT_ID}:${process.env.TWITTER_CLIENT_SECRET}`).toString('base64')}`,
      },
      body: new URLSearchParams({
        code,
        grant_type: 'authorization_code',
        client_id: process.env.NEXT_PUBLIC_TWITTER_CLIENT_ID!,
        redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/twitter/callback`,
        code_verifier: codeVerifier,
      }),
    });

    const tokenData = await tokenResponse.json();

    if (!tokenData.access_token) {
      throw new Error('Failed to get access token');
    }

    // Get user info
    const userResponse = await fetch('https://api.twitter.com/2/users/me?user.fields=username,name,profile_image_url', {
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`,
      },
    });

    const userData = await userResponse.json();

    if (!userData.data) {
      throw new Error('Failed to get user data');
    }

    // Send message to parent window
    const html = `
      <!DOCTYPE html>
      <html>
        <head><title>Twitter Auth</title></head>
        <body>
          <script>
            window.opener.postMessage({
              type: 'TWITTER_AUTH_SUCCESS',
              username: '${userData.data.username}',
              userId: '${userData.data.id}',
              accessToken: '${tokenData.access_token}',
              profilePicture: '${userData.data.profile_image_url || ''}'
            }, '${process.env.NEXT_PUBLIC_APP_URL}');
            window.close();
          </script>
        </body>
      </html>
    `;
    
    return new NextResponse(html, {
      headers: { 'Content-Type': 'text/html' },
    });
  } catch (error) {
    console.error('Twitter callback error:', error);
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/settings?error=twitter_connection_failed`);
  }
}

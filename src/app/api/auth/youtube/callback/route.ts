import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error');

  if (error) {
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/settings?error=youtube_auth_failed`);
  }

  if (!code || state !== 'youtube_auth') {
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/settings?error=invalid_youtube_auth`);
  }

  try {
    // Exchange code for access token
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        code,
        grant_type: 'authorization_code',
        redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/youtube/callback`,
      }),
    });

    const tokenData = await tokenResponse.json();

    if (!tokenData.access_token) {
      throw new Error('Failed to get access token');
    }

    // Get user info
    const userResponse = await fetch(`https://www.googleapis.com/youtube/v3/channels?part=snippet&mine=true&access_token=${tokenData.access_token}`);

    const userData = await userResponse.json();

    if (userData.items && userData.items.length > 0) {
      const channel = userData.items[0];
      
      // Save to Firestore (simplified version)
      const youtubeAccount = {
        platform: 'YouTube',
        connected: true,
        username: channel.snippet.title,
        userId: channel.id,
        accessToken: tokenData.access_token,
        connectedAt: new Date().toISOString(),
        profilePicture: channel.snippet.thumbnails.default.url,
      };

      // Send message to parent window
      const html = `
        <!DOCTYPE html>
        <html>
          <head><title>YouTube Auth</title></head>
          <body>
            <script>
              window.opener.postMessage({
                type: 'YOUTUBE_AUTH_SUCCESS',
                username: '${channel.snippet.title}',
                userId: '${channel.id}',
                accessToken: '${tokenData.access_token}',
                profilePicture: '${channel.snippet.thumbnails.default.url}'
              }, '${process.env.NEXT_PUBLIC_APP_URL}');
              window.close();
            </script>
          </body>
        </html>
      `;
      
      return new NextResponse(html, {
        headers: { 'Content-Type': 'text/html' },
      });
    } else {
      throw new Error('No YouTube channel found');
    }
  } catch (error) {
    console.error('YouTube callback error:', error);
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/settings?error=youtube_connection_failed`);
  }
}

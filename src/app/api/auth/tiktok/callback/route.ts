import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error_code');

  const respondWithError = (error: string) => {
    return new NextResponse(`
      <!DOCTYPE html>
      <html><body><script>
        window.opener.postMessage({ type: 'TIKTOK_AUTH_ERROR', error: '${error}' }, '*');
        window.close();
      </script></body></html>
    `, { headers: { 'Content-Type': 'text/html' } });
  };

  if (error) {
    return respondWithError(`TikTok authentication failed with error: ${error}`);
  }

  if (!code) {
    return respondWithError('Authorization code is missing.');
  }

  try {
    // 1. Exchange authorization code for access token
    const tokenResponse = await fetch('https://open.tiktokapis.com/v2/oauth/token/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_key: process.env.NEXT_PUBLIC_TIKTOK_CLIENT_KEY!,
        client_secret: process.env.TIKTOK_CLIENT_SECRET!,
        code: code,
        grant_type: 'authorization_code',
        redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/tiktok/callback`,
      }),
    });

    const tokenData = await tokenResponse.json();
    if (!tokenResponse.ok || !tokenData.access_token) {
      console.error('TikTok Token Error:', tokenData);
      throw new Error(tokenData.error_description || 'Failed to retrieve access token.');
    }

    // 2. Use access token to get user info
    const userInfoResponse = await fetch('https://open.tiktokapis.com/v2/user/info/?fields=open_id,username,display_name,avatar_url', {
      headers: { 'Authorization': `Bearer ${tokenData.access_token}` },
    });

    const userInfoData = await userInfoResponse.json();
    if (userInfoData.error.code !== 'ok') {
        console.error('TikTok User Info Error:', userInfoData);
        throw new Error(userInfoData.error.message || 'Failed to fetch user information.');
    }

    const user = userInfoData.data.user;

    // 3. Send user data to the parent window and close the popup
    const html = `
      <!DOCTYPE html>
      <html>
        <head><title>TikTok Auth</title></head>
        <body>
          <script>
            window.opener.postMessage({
              type: 'TIKTOK_AUTH_SUCCESS',
              userId: '${user.open_id}',
              username: '${user.username}',
              displayName: '${user.display_name}',
              profilePicture: '${user.avatar_url}',
              accessToken: '${tokenData.access_token}'
            }, '${process.env.NEXT_PUBLIC_APP_URL}');
            window.close();
          </script>
        </body>
      </html>
    `;

    return new NextResponse(html, { headers: { 'Content-Type': 'text/html' } });

  } catch (err: any) {
    console.error('TikTok OAuth Callback Error:', err);
    return respondWithError(err.message || 'An unexpected error occurred during TikTok authentication.');
  }
}

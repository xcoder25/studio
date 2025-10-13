import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error');

  if (error) {
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/settings?error=facebook_auth_failed`);
  }

  if (!code || state !== 'facebook_auth') {
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/settings?error=invalid_facebook_auth`);
  }

  try {
    // Exchange code for access token
    const tokenResponse = await fetch('https://graph.facebook.com/v21.0/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID!,
        client_secret: process.env.FACEBOOK_APP_SECRET!,
        redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/facebook/callback`,
        code,
      }),
    });

    const tokenData = await tokenResponse.json();

    if (!tokenData.access_token) {
      throw new Error('Failed to get access token');
    }

    // Get user info using access token
    const userResponse = await fetch(`https://graph.facebook.com/v21.0/me?fields=id,name,email,picture&access_token=${tokenData.access_token}`);
    const userData = await userResponse.json();

    // Send message to parent window
    const html = `
      <!DOCTYPE html>
      <html>
        <head><title>Facebook Auth</title></head>
        <body>
          <script>
            window.opener.postMessage({
              type: 'FACEBOOK_AUTH_SUCCESS',
              username: '${userData.name}',
              userId: '${userData.id}',
              accessToken: '${tokenData.access_token}',
              profilePicture: '${userData.picture?.data?.url || ''}'
            }, '${process.env.NEXT_PUBLIC_APP_URL}');
            window.close();
          </script>
        </body>
      </html>
    `;

    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html',
      },
    });
  } catch (error) {
    console.error('Facebook OAuth error:', error);
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/settings?error=facebook_auth_error`);
  }
}

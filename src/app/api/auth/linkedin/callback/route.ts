import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error');

  if (error) {
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/settings?error=linkedin_auth_failed`);
  }

  if (!code || state !== 'linkedin_auth') {
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/settings?error=invalid_linkedin_auth`);
  }

  try {
    // Exchange code for access token
    const tokenResponse = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        client_id: process.env.LINKEDIN_CLIENT_ID!,
        client_secret: process.env.LINKEDIN_CLIENT_SECRET!,
        redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/linkedin/callback`,
      }),
    });

    const tokenData = await tokenResponse.json();

    if (!tokenData.access_token) {
      throw new Error('Failed to get access token');
    }

    // Get user info
    const userResponse = await fetch('https://api.linkedin.com/v2/people/~:(id,firstName,lastName,profilePicture(displayImage~:playableStreams))', {
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`,
      },
    });

    const userData = await userResponse.json();

    // Save to Firestore (simplified version)
    const linkedinAccount = {
      platform: 'LinkedIn',
      connected: true,
      username: `${userData.firstName.localized.en_US} ${userData.lastName.localized.en_US}`,
      userId: userData.id,
      accessToken: tokenData.access_token,
      connectedAt: new Date().toISOString(),
    };

    // Send message to parent window
    const html = `
      <!DOCTYPE html>
      <html>
        <head><title>LinkedIn Auth</title></head>
        <body>
          <script>
            window.opener.postMessage({
              type: 'LINKEDIN_AUTH_SUCCESS',
              username: '${userData.firstName.localized.en_US} ${userData.lastName.localized.en_US}',
              userId: '${userData.id}',
              accessToken: '${tokenData.access_token}',
              profilePicture: ''
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
    console.error('LinkedIn callback error:', error);
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/settings?error=linkedin_connection_failed`);
  }
}

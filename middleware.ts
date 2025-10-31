
import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // This middleware is currently empty.
  // You can add logic here to handle redirects, authentication, etc.
  return NextResponse.next();
}

export const config = {
  // Add paths you want the middleware to run on.
  // By default it runs on all paths.
  // matcher: ['/about/:path*'],
};

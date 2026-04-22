import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const SECRET = new TextEncoder().encode(
  process.env.ADMIN_PASSWORD || 'fallback-secret-change-me'
);

const PROTECTED_PATHS = ['/dashboard', '/api/config', '/api/upload', '/api/contacts'];
const PUBLIC_PATHS = ['/dashboard/login'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if path needs protection
  const isProtected = PROTECTED_PATHS.some((p) => pathname.startsWith(p));
  const isPublic = PUBLIC_PATHS.some((p) => pathname === p);

  if (!isProtected || isPublic) {
    return NextResponse.next();
  }

  const token = request.cookies.get('admin_session')?.value;

  if (!token) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.redirect(new URL('/dashboard/login', request.url));
  }

  try {
    await jwtVerify(token, SECRET);
    return NextResponse.next();
  } catch {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.redirect(new URL('/dashboard/login', request.url));
  }
}

export const config = {
  matcher: ['/dashboard/:path*', '/api/config/:path*', '/api/upload/:path*', '/api/contacts/:path*'],
};

import { NextResponse } from 'next/server';
import { createToken } from '@/lib/auth';

const COOKIE_NAME = 'admin_session';

// POST: Login
export async function POST(req: Request) {
  try {
    const { password } = await req.json();

    if (!process.env.ADMIN_PASSWORD) {
      return NextResponse.json(
        { error: 'ADMIN_PASSWORD not configured on server.' },
        { status: 500 }
      );
    }

    if (password !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Invalid password.' }, { status: 401 });
    }

    const token = await createToken();

    const response = NextResponse.json({ success: true });
    response.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    return response;
  } catch {
    return NextResponse.json({ error: 'Server error.' }, { status: 500 });
  }
}

// DELETE: Logout
export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.set(COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
    path: '/',
  });
  return response;
}

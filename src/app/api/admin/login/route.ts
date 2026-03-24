import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

/**
 * Hardcoded admin login for the demo as requested.
 * @param request 
 * @returns 
 */
export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    if (username === 'admin' && password === 'admin123') {
      // Set a simple session cookie
      const cookieStore = await cookies();
      cookieStore.set('admin-session', 'true', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24, // 24 hours
        path: '/',
      });

      return NextResponse.json({ success: true, message: 'Logged in successfully' });
    }

    return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Bad request' }, { status: 400 });
  }
}

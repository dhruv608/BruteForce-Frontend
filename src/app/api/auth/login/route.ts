import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    
    // Call the real backend length
    const res = await fetch('http://localhost:5000/api/auth/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    const data = await res.json();
    
    if (res.ok && data.user?.role === 'SUPERADMIN') {
      const cookieStore = await cookies();
      
      const setCookieHeader = res.headers.get('set-cookie');
      if (setCookieHeader) {
        const match = setCookieHeader.match(/refreshToken=([^;]+)/);
        if (match) {
          cookieStore.set('superadmin_refresh', match[1], {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            path: '/',
            maxAge: 7 * 24 * 60 * 60 // 7 days
          });
        }
      }

      cookieStore.set('superadmin_auth', 'true', { 
        httpOnly: true, 
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 60 * 60 * 24 * 7 // 1 week
      });
      cookieStore.set('superadmin_token', data.accessToken, { 
        httpOnly: true, 
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 60 * 60 * 24 * 7
      });
      return NextResponse.json({ success: true, user: data.user });
    }
    
    if (res.ok && data.user?.role !== 'SUPERADMIN') {
      return NextResponse.json({ success: false, message: 'Unauthorized: Superadmin access required' }, { status: 403 });
    }
    
    return NextResponse.json({ success: false, message: data.error || 'Invalid credentials' }, { status: res.status });
  } catch (e) {
    return NextResponse.json({ success: false, message: 'Server connection failed' }, { status: 500 });
  }
}

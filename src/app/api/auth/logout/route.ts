import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  const cookieStore = await cookies();
  cookieStore.delete('superadmin_auth');
  cookieStore.delete('superadmin_token');
  return NextResponse.json({ success: true });
}

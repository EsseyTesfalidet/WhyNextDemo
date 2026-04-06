import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const body = (await request.json()) as { isOptimized?: boolean };
  const value = body.isOptimized ? '1' : '0';

  cookies().set('isOptimized', value, {
    httpOnly: false,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 14,
    path: '/'
  });

  return NextResponse.json({ ok: true, isOptimized: value === '1' });
}

import { NextResponse } from 'next/server';
import { MOVIES } from '@/lib/movies';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const delayMs = Number(url.searchParams.get('delayMs') ?? '2500');

  await new Promise((resolve) => setTimeout(resolve, delayMs));

  return NextResponse.json({ movies: MOVIES });
}

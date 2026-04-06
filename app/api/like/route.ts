import { NextResponse } from 'next/server';

let likes = 0;

export async function POST() {
  likes += 1;
  return NextResponse.json({ likes });
}

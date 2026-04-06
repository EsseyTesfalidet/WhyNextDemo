import { NextResponse } from 'next/server';
import { getSeoProofFromServer } from '@/lib/seo-proof';

export async function GET() {
  const payload = await getSeoProofFromServer();
  return NextResponse.json(payload);
}

import { NextResponse } from 'next/server';
import { MOSAIC_TOTAL } from '@/lib/mosaic';
import { fetchMosaicPhotos } from '@/lib/picsum';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const countParam = Number(url.searchParams.get('count') ?? String(MOSAIC_TOTAL));
  const count = Number.isFinite(countParam) ? Math.min(Math.max(countParam, 1), 7000) : MOSAIC_TOTAL;

  const { photos } = await fetchMosaicPhotos(count);

  return NextResponse.json({
    photos,
    count: photos.length
  });
}

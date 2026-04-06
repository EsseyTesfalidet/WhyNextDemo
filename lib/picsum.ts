import { MOSAIC_TOTAL } from '@/lib/mosaic';

export type PicsumPhoto = {
  id: string;
  author: string;
  width: number;
  height: number;
  url: string;
  download_url: string;
};

function fallbackPhotos(seedCount = 100): PicsumPhoto[] {
  return Array.from({ length: seedCount }, (_, index) => {
    const id = String(index + 10);
    return {
      id,
      author: 'Fallback Author ' + String(index + 1),
      width: 1200,
      height: 800,
      url: 'https://picsum.photos/id/' + id + '/info',
      download_url: 'https://picsum.photos/id/' + id + '/1200/800'
    };
  });
}

function loopToCount(list: PicsumPhoto[], count: number) {
  if (list.length === 0) {
    return fallbackPhotos(Math.max(1, count)).slice(0, count);
  }

  return Array.from({ length: count }, (_, index) => {
    const source = list[index % list.length];
    return {
      ...source,
      id: source.id + '-' + String(index)
    };
  });
}

export async function fetchPicsumSeedList(limit = 100): Promise<PicsumPhoto[]> {
  try {
    const response = await fetch('https://picsum.photos/v2/list?page=1&limit=' + String(limit), {
      next: { revalidate: 60 * 60 }
    });

    if (response.ok === false) {
      return fallbackPhotos(limit);
    }

    const data = (await response.json()) as PicsumPhoto[];
    return data.length > 0 ? data : fallbackPhotos(limit);
  } catch {
    return fallbackPhotos(limit);
  }
}

export async function fetchMosaicPhotos(count = MOSAIC_TOTAL) {
  const start = Date.now();
  const base = await fetchPicsumSeedList(100);
  const photos = loopToCount(base, count);
  return {
    photos,
    elapsedMs: Date.now() - start
  };
}

export function picsumTileUrl(photoId: string, size = 120) {
  const numeric = photoId.split('-')[0];
  return 'https://picsum.photos/id/' + numeric + '/' + String(size) + '/' + String(size);
}

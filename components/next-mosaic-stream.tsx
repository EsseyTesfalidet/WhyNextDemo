import Image from 'next/image';
import Link from 'next/link';
import { LikeButton } from '@/components/like-button';
import { PerformanceConsole } from '@/components/performance-console';
import { TeachingDashboard } from '@/components/teaching-dashboard';
import { MOSAIC_COLS, MOSAIC_ROWS, MOSAIC_TOTAL, TileZone, buildMosaicMask } from '@/lib/mosaic';
import { fetchMosaicPhotos, picsumTileUrl } from '@/lib/picsum';
import { getSeoProofFromServer } from '@/lib/seo-proof';

const NEXT_FAST_TOTAL = 3000;

type DetailLevel = 'fast' | 'full';

function overlayClass(zone: TileZone) {
  if (zone === 'osu') {
    return 'bg-[#bb0000]/52';
  }
  return 'bg-slate-950/48';
}

function opacityFor(zone: TileZone) {
  if (zone === 'osu') {
    return 0.97;
  }
  return 0.12;
}

export default async function NextMosaicStream({ detailLevel }: { detailLevel: DetailLevel }) {
  const isFast = detailLevel === 'fast';
  const fetchCount = isFast ? NEXT_FAST_TOTAL : MOSAIC_TOTAL;

  const { photos, elapsedMs } = await fetchMosaicPhotos(fetchCount);
  const seoPayload = await getSeoProofFromServer();
  const mask = buildMosaicMask(MOSAIC_ROWS, MOSAIC_COLS);

  const cells: Array<{ id: string; zone: TileZone; photoId?: string }> = [];
  let photoPtr = 0;

  for (let index = 0; index < mask.length; index += 1) {
    const cell = mask[index];

    if (isFast && index % 2 === 1) {
      cells.push({ id: 'empty-' + String(index), zone: cell.zone });
      continue;
    }

    const photo = photos[photoPtr % photos.length];
    photoPtr += 1;
    cells.push({ id: photo.id + '-' + String(index), zone: cell.zone, photoId: photo.id });
  }

  return (
    <>
      <section className="rounded-2xl border border-slate-300 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-xl font-semibold text-slate-900">OSU Mosaic Lab</h2>
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">Next.js Mode</span>
        </div>
        <p className="mt-2 text-sm text-slate-700">
          Data is prepared on the server and streamed through <code>{'<Suspense>'}</code>. Fast view renders 3,000 tiles,
          then you can switch to full 6,000 detail.
        </p>

        <div className="mt-3 flex flex-wrap items-center gap-4 rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
          <span>Rendered tiles: {isFast ? NEXT_FAST_TOTAL : MOSAIC_TOTAL}</span>
          <span>Data prep: {elapsedMs}ms</span>
          <span>Pattern: OSU letters</span>
        </div>

        <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
          <p className="font-semibold">SEO Proof</p>
          <p className="mt-1">{seoPayload.phrase}</p>
        </div>

        <div className="mt-3 flex flex-wrap gap-3 text-sm">
          {isFast ? (
            <Link href="/?detail=full" className="rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-700 hover:bg-slate-100">
              Load Full 6,000 Detail
            </Link>
          ) : (
            <Link href="/?detail=fast" className="rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-700 hover:bg-slate-100">
              Back to Fast 3,000 View
            </Link>
          )}
        </div>

        <div
          className="mt-4 grid overflow-hidden rounded-xl border border-slate-300 bg-slate-950"
          style={{ gridTemplateColumns: 'repeat(' + String(MOSAIC_COLS) + ', minmax(0, 1fr))' }}
        >
          {cells.map((cell) => (
            <div key={cell.id} className="relative aspect-square" style={{ opacity: opacityFor(cell.zone) }}>
              {cell.photoId ? (
                <Image
                  src={picsumTileUrl(cell.photoId, 100)}
                  alt="Mosaic tile"
                  fill
                  loading="lazy"
                  sizes="(max-width: 768px) 10vw, (max-width: 1200px) 2vw, 1.2vw"
                  className="object-cover"
                />
              ) : (
                <div className="absolute inset-0 bg-slate-900" />
              )}
              <div className={'pointer-events-none absolute inset-0 mix-blend-multiply ' + overlayClass(cell.zone)} />
            </div>
          ))}
        </div>

        <div className="mt-4 flex flex-wrap gap-4">
          <LikeButton />
          <Link href="/movie/blade-runner-2049" className="text-sm text-blue-700 hover:underline">
            Open Dynamic Route Demo
          </Link>
        </div>
      </section>

      <TeachingDashboard mode="Next" primaryFetchMs={elapsedMs} sourceHasTitles fetchCount={fetchCount} />
      <PerformanceConsole elapsedMs={elapsedMs} channel="Server" />
    </>
  );
}

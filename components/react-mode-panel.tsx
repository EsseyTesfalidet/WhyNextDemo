'use client';

import { useEffect, useMemo, useState } from 'react';
import { PerformanceConsole } from '@/components/performance-console';
import { RequestStream } from '@/components/request-stream';
import { TeachingDashboard, trackCall } from '@/components/teaching-dashboard';
import { MOSAIC_COLS, MOSAIC_ROWS, MOSAIC_TOTAL, TileZone, buildMosaicMask } from '@/lib/mosaic';
import { PicsumPhoto, picsumTileUrl } from '@/lib/picsum';
import { SeoProofPayload } from '@/lib/seo-proof';
import { emitTelemetry } from '@/lib/telemetry';

type PositionedTile = {
  id: string;
  src: string;
  zone: TileZone;
  opacity: number;
  filter: string;
};

const MIN_RENDER_INDICATOR_MS = 1200;

function zoneVisual(zone: TileZone) {
  if (zone === 'osu') {
    return { opacity: 0.96, filter: 'saturate(1.8) hue-rotate(-24deg) contrast(1.08)' };
  }
  return { opacity: 0.14, filter: 'grayscale(0.95) saturate(0.2)' };
}

export function ReactModePanel() {
  const [tiles, setTiles] = useState<PositionedTile[]>([]);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [layoutMs, setLayoutMs] = useState(0);
  const [seoPhrase, setSeoPhrase] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const mask = useMemo(() => buildMosaicMask(MOSAIC_ROWS, MOSAIC_COLS), []);

  useEffect(() => {
    let isMounted = true;
    let hideLoaderTimer: ReturnType<typeof setTimeout> | undefined;

    async function run() {
      const start = performance.now();
      const [mosaicResponse, seoResponse] = await Promise.all([
        fetch('/api/picsum?count=' + String(MOSAIC_TOTAL)),
        fetch('/api/seo-proof')
      ]);

      const payload = (await mosaicResponse.json()) as { photos: PicsumPhoto[] };
      const seoPayload = (await seoResponse.json()) as SeoProofPayload;

      trackCall(start, '/api/picsum?count=' + String(MOSAIC_TOTAL), 'GET mosaic photos in client useEffect', 'React', 'GET', mosaicResponse.status);
      trackCall(start, '/api/seo-proof', 'GET SEO phrase on client', 'React', 'GET', seoResponse.status);

      const layoutStart = performance.now();

      const mapped = payload.photos.map((photo, index) => {
        const cell = mask[index % mask.length];
        const visual = zoneVisual(cell.zone);

        return {
          id: photo.id + '-' + String(index),
          src: picsumTileUrl(photo.id, 90),
          zone: cell.zone,
          opacity: visual.opacity,
          filter: visual.filter
        };
      });

      const layoutDuration = Math.round(performance.now() - layoutStart);
      const elapsed = Math.round(performance.now() - start);

      if (isMounted) {
        setTiles(mapped);
        setLayoutMs(layoutDuration);
        setElapsedMs(elapsed);
        setSeoPhrase(seoPayload.phrase);

        const delayMs = Math.max(0, MIN_RENDER_INDICATOR_MS - elapsed);
        hideLoaderTimer = setTimeout(() => {
          if (isMounted) {
            setLoading(false);
          }
        }, delayMs);

        emitTelemetry({
          route: '/mosaic/layout-grid',
          label: 'Client responsive grid tile mapping',
          ms: layoutDuration,
          mode: 'React',
          method: 'LAYOUT',
          status: 200
        });
      }
    }

    run();
    return () => {
      isMounted = false;
      if (hideLoaderTimer) {
        clearTimeout(hideLoaderTimer);
      }
    };
  }, [mask]);

  return (
    <>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="space-y-6">
          <section className="rounded-2xl border border-slate-300 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-2xl font-bold text-slate-900 lg:text-3xl">OSU Mosaic Lab</h2>
              <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">React Mode</span>
            </div>
            <p className="mt-2 text-sm text-slate-700">
              6,000 photos are fetched in <code>useEffect</code>, then mapped on the client to draw an OSU wordmark
              mosaic.
            </p>

            <div className="mt-3 flex flex-wrap items-center gap-4 rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
              <span>Total tiles: {MOSAIC_TOTAL}</span>
              <span>Layout calc: {layoutMs}ms</span>
              <span>Pattern: OSU</span>
            </div>

            <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
              <p className="font-semibold">SEO Proof</p>
              <p className="mt-1">{seoPhrase ?? 'Loading SEO phrase on client...'}</p>
            </div>

            <div
              className="relative mt-4 grid overflow-hidden rounded-xl border border-slate-300 bg-black"
              style={{
                gridTemplateColumns: 'repeat(' + String(MOSAIC_COLS) + ', minmax(0, 1fr))',
                aspectRatio: String(MOSAIC_COLS) + ' / ' + String(MOSAIC_ROWS)
              }}
            >
              {loading ? (
                <div className="absolute inset-0 z-10 grid place-items-center bg-black text-slate-100">
                  <div className="text-center">
                    <p className="font-semibold">Rendering client-side mosaic...</p>
                    <p className="mt-1 text-xs text-slate-200">Preparing tiles in the browser</p>
                  </div>
                </div>
              ) : null}

              {!loading
                ? tiles.map((tile) => (
                    <div key={tile.id} className="relative aspect-square" style={{ opacity: tile.opacity, filter: tile.filter }}>
                      <img
                        src={tile.src}
                        alt="Mosaic tile"
                        loading="eager"
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                    </div>
                  ))
                : null}
            </div>
          </section>

          <TeachingDashboard mode="React" primaryFetchMs={elapsedMs} sourceHasTitles={false} />
        </div>

        <div className="lg:sticky lg:top-6 lg:self-start">
          <RequestStream mode="React" />
        </div>
      </div>

      <PerformanceConsole elapsedMs={elapsedMs} channel="Client" />
    </>
  );
}

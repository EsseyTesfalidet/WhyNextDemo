import { Suspense } from 'react';
import { RequestStream } from '@/components/request-stream';
import NextMosaicStream from '@/components/next-mosaic-stream';

type DetailLevel = 'fast' | 'full';

function MosaicFallback({ detailLevel }: { detailLevel: DetailLevel }) {
  const isFast = detailLevel === 'fast';
  return (
    <section className="rounded-2xl border border-slate-300 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-xl font-semibold text-slate-900">OSU Mosaic Lab</h2>
        <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">Next.js Mode</span>
      </div>
      <p className="mt-2 text-sm text-slate-700">
        {isFast ? 'Streaming fast 3,000-tile view with Suspense...' : 'Streaming full 6,000-tile detail with Suspense...'}
      </p>
      <div className="mt-4 h-[560px] animate-pulse rounded-xl border border-slate-300 bg-slate-100" />
    </section>
  );
}

export function NextModePanel({ detailLevel }: { detailLevel: DetailLevel }) {
  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
      <div className="space-y-6">
        <Suspense fallback={<MosaicFallback detailLevel={detailLevel} />}>
          <NextMosaicStream detailLevel={detailLevel} />
        </Suspense>
      </div>

      <div className="lg:sticky lg:top-6 lg:self-start">
        <RequestStream mode="Next" />
      </div>
    </div>
  );
}

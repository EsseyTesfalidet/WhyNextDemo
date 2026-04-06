'use client';

export function PerformanceConsole({
  elapsedMs,
  channel
}: {
  elapsedMs: number;
  channel: 'Client' | 'Server';
}) {
  return (
    <div className="fixed bottom-0 left-0 right-0 border-t border-slate-300 bg-slate-950/95 px-4 py-3 text-sm text-emerald-300">
      Performance Console: Data fetched in {(elapsedMs / 1000).toFixed(1)}s ({channel})
    </div>
  );
}

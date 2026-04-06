'use client';

import { useEffect, useMemo, useState } from 'react';
import { TelemetryEntry, emitTelemetry, subscribeTelemetry } from '@/lib/telemetry';

type RequestStreamProps = {
  mode: 'React' | 'Next';
};

const MAX_LINES = 14;

function lineForEntry(entry: TelemetryEntry) {
  const method = entry.method ?? 'GET';
  const status = entry.status ?? 200;
  const rounded = Math.round(entry.ms);
  return `${method} ${entry.route} ${status} in ${rounded}ms`;
}

function timeLabel(timestamp: number) {
  return new Date(timestamp).toLocaleTimeString([], {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
}

export function RequestStream({ mode }: RequestStreamProps) {
  const [entries, setEntries] = useState<TelemetryEntry[]>([]);

  useEffect(() => {
    setEntries([]);

    const unsubscribe = subscribeTelemetry((entry) => {
      setEntries((prev) => [entry, ...prev].slice(0, MAX_LINES));
    });

    const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined;
    const navMs = nav ? nav.duration : 0;

    emitTelemetry({
      label: 'Document request',
      route: '/',
      ms: navMs,
      mode,
      method: 'GET',
      status: 200
    });

    return unsubscribe;
  }, [mode]);

  const filtered = useMemo(
    () => entries.filter((entry) => entry.mode === mode || entry.mode === 'Any'),
    [entries, mode]
  );

  return (
    <aside className="rounded-2xl border border-slate-200 bg-slate-950 p-4 text-slate-100 shadow-lg">
      <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Under The Hood</p>
      <h3 className="mt-1 text-sm font-semibold text-white">Live Request Stream</h3>
      <p className="mt-1 text-xs text-slate-400">Mode: {mode}</p>

      <div className="mt-4 space-y-2 font-mono text-xs">
        {filtered.length === 0 ? <p className="text-slate-500">Waiting for request activity...</p> : null}
        {filtered.map((entry) => (
          <div key={entry.id} className="rounded-lg border border-slate-800 bg-slate-900 p-2">
            <p className="text-emerald-300">{lineForEntry(entry)}</p>
            <p className="mt-1 text-[11px] text-slate-500">{timeLabel(entry.timestamp)}</p>
          </div>
        ))}
      </div>
    </aside>
  );
}

'use client';

import { useEffect, useMemo, useState } from 'react';
import { MOSAIC_TOTAL } from '@/lib/mosaic';
import { DemoMode, TelemetryEntry, emitTelemetry, subscribeTelemetry } from '@/lib/telemetry';

type TeachingDashboardProps = {
  mode: 'React' | 'Next';
  primaryFetchMs: number;
  sourceHasTitles: boolean;
  fetchCount?: number;
};

const MAX_ROWS = 8;

function formatMs(ms: number) {
  if (ms >= 1000) {
    return (ms / 1000).toFixed(2) + 's';
  }
  return String(Math.round(ms)) + 'ms';
}

function maxValue(values: number[]) {
  return Math.max(...values, 1);
}

export function TeachingDashboard({ mode, primaryFetchMs, sourceHasTitles, fetchCount = MOSAIC_TOTAL }: TeachingDashboardProps) {
  const [rows, setRows] = useState<TelemetryEntry[]>([]);
  const mosaicRoute = '/api/picsum?count=' + String(fetchCount);

  useEffect(() => {
    setRows([]);

    const unsubscribe = subscribeTelemetry((entry) => {
      setRows((prev) => [entry, ...prev].slice(0, MAX_ROWS));
    });

    emitTelemetry({
      label: mode === 'React' ? 'Client mosaic fetch complete' : 'Server mosaic fetch complete',
      route: mosaicRoute,
      ms: primaryFetchMs,
      mode,
      method: mode === 'React' ? 'GET' : 'RSC',
      status: 200
    });

    emitTelemetry({
      label: sourceHasTitles ? 'View Source contains streamed mosaic shell' : 'View Source misses final mosaic tiles',
      route: '/ (view-source)',
      ms: sourceHasTitles ? 100 : 2500,
      mode,
      method: 'SEO',
      status: sourceHasTitles ? 200 : 204
    });

    return unsubscribe;
  }, [mode, primaryFetchMs, sourceHasTitles, mosaicRoute]);

  const filteredRows = useMemo(
    () => rows.filter((row) => row.mode === mode || row.mode === 'Any'),
    [rows, mode]
  );

  const top = maxValue(filteredRows.map((row) => row.ms));

  return (
    <section className="rounded-2xl border border-slate-200 bg-white/95 p-5 shadow-lg shadow-slate-200">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Live Teaching Dashboard</p>
          <h3 className="mt-1 text-lg font-bold text-slate-900">Runtime Evidence in the Browser</h3>
        </div>
        <span
          className={
            'rounded-full px-3 py-1 text-xs font-semibold ' +
            (mode === 'React' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800')
          }
        >
          {mode} Mode
        </span>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <article className="rounded-xl border border-slate-200 bg-slate-50 p-3">
          <p className="text-xs uppercase tracking-wide text-slate-500">Primary Fetch</p>
          <p className="mt-1 text-xl font-bold text-slate-900">{formatMs(primaryFetchMs)}</p>
        </article>
        <article className="rounded-xl border border-slate-200 bg-slate-50 p-3">
          <p className="text-xs uppercase tracking-wide text-slate-500">Source Visibility</p>
          <p className="mt-1 text-xl font-bold text-slate-900">{sourceHasTitles ? 'Visible' : 'Missing'}</p>
        </article>
        <article className="rounded-xl border border-slate-200 bg-slate-50 p-3">
          <p className="text-xs uppercase tracking-wide text-slate-500">Latest API Calls</p>
          <p className="mt-1 text-xl font-bold text-slate-900">{filteredRows.length}</p>
        </article>
      </div>

      <div className="mt-4 space-y-2">
        {filteredRows.length === 0 ? (
          <p className="text-sm text-slate-500">No telemetry events yet. Interact with the page to populate this feed.</p>
        ) : null}
        {filteredRows.map((row) => {
          const width = String(Math.max(10, Math.round((row.ms / top) * 100))) + '%';
          return (
            <div key={row.id} className="rounded-xl border border-slate-200 p-3">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-medium text-slate-800">{row.label}</p>
                <p className="text-sm font-semibold text-slate-900">{formatMs(row.ms)}</p>
              </div>
              <p className="mt-1 text-xs text-slate-500">{row.route}</p>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200">
                <div
                  className={
                    'h-full rounded-full ' + (mode === 'React' ? 'bg-amber-500' : 'bg-emerald-500')
                  }
                  style={{ width }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <p className="mt-4 text-xs text-slate-500">
        Teaching tip: terminal logs include dev compiler overhead, but this panel reflects browser runtime requests.
      </p>
    </section>
  );
}

export function trackCall(
  start: number,
  route: string,
  label: string,
  mode: DemoMode,
  method: string,
  status: number
) {
  const ms = performance.now() - start;
  emitTelemetry({ route, label, ms, mode, method, status });
}

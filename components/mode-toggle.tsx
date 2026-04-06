'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useMode } from '@/components/mode-provider';
import { trackCall } from '@/components/teaching-dashboard';

export function ModeToggle() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { isOptimized, setOptimized } = useMode();

  const onToggle = (nextValue: boolean) => {
    setOptimized(nextValue);
    startTransition(async () => {
      const start = performance.now();
      const response = await fetch('/api/mode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isOptimized: nextValue })
      });

      trackCall(
        start,
        '/api/mode',
        nextValue ? 'Switch mode to Next.js (ON)' : 'Switch mode to React (OFF)',
        'Any',
        'POST',
        response.status
      );

      router.refresh();
    });
  };

  return (
    <div className="rounded-xl border border-slate-300 bg-white p-4 shadow-sm">
      <p className="text-sm font-semibold text-slate-700">Comparison Toggle</p>
      <p className="mt-1 text-xs text-slate-500">OFF = Standard React / ON = Next.js power mode</p>
      <div className="mt-3 flex gap-2">
        <button
          type="button"
          disabled={isPending}
          onClick={() => onToggle(false)}
          className={`rounded-md px-3 py-2 text-sm font-medium transition ${
            !isOptimized ? 'bg-amber-500 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          React Mode (OFF)
        </button>
        <button
          type="button"
          disabled={isPending}
          onClick={() => onToggle(true)}
          className={`rounded-md px-3 py-2 text-sm font-medium transition ${
            isOptimized ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          Next.js Mode (ON)
        </button>
      </div>
    </div>
  );
}

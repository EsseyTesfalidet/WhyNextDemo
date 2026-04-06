'use client';

import { useEffect, useState } from 'react';

const STORAGE_KEY = 'why-next-demo-projector-mode';

function applyProjectorClass(enabled: boolean) {
  const root = document.documentElement;
  if (enabled) {
    root.classList.add('projector');
  } else {
    root.classList.remove('projector');
  }
}

export function ProjectorToggle() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    const initial = saved === '1';
    setEnabled(initial);
    applyProjectorClass(initial);

    const onKey = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() !== 'p') {
        return;
      }
      const next = !document.documentElement.classList.contains('projector');
      setEnabled(next);
      window.localStorage.setItem(STORAGE_KEY, next ? '1' : '0');
      applyProjectorClass(next);
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const onToggle = () => {
    const next = !enabled;
    setEnabled(next);
    window.localStorage.setItem(STORAGE_KEY, next ? '1' : '0');
    applyProjectorClass(next);
  };

  return (
    <button
      type="button"
      onClick={onToggle}
      className={`rounded-md border px-3 py-2 text-sm font-semibold transition ${
        enabled
          ? 'border-indigo-700 bg-indigo-700 text-white hover:bg-indigo-800'
          : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-100'
      }`}
      aria-pressed={enabled}
    >
      {enabled ? 'Projector Mode: ON' : 'Projector Mode: OFF'}
    </button>
  );
}

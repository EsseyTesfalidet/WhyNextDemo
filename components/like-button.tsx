'use client';

import { useState, useTransition } from 'react';
import { trackCall } from '@/components/teaching-dashboard';

export function LikeButton() {
  const [likes, setLikes] = useState(0);
  const [isPending, startTransition] = useTransition();

  const onLike = () => {
    startTransition(async () => {
      const start = performance.now();
      const response = await fetch('/api/like', { method: 'POST' });
      const payload = (await response.json()) as { likes: number };
      setLikes(payload.likes);
      trackCall(start, '/api/like', 'POST like interaction', 'Any', 'POST', response.status);
    });
  };

  return (
    <button
      type="button"
      onClick={onLike}
      disabled={isPending}
      className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-70"
    >
      {isPending ? 'Liking...' : `Like (${likes})`}
    </button>
  );
}

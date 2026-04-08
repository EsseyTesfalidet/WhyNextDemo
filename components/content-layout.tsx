'use client';

import { usePathname } from 'next/navigation';
import { RouteBlackboard } from '@/components/route-blackboard';

export function ContentLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (pathname === '/') {
    return <div className="min-w-0">{children}</div>;
  }

  return (
    <div className="grid gap-6 xl:grid-cols-2 xl:items-stretch">
      <div className="min-w-0">{children}</div>
      <div className="min-w-0">
        <RouteBlackboard />
      </div>
    </div>
  );
}

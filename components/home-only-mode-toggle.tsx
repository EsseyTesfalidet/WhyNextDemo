'use client';

import { usePathname } from 'next/navigation';
import { ModeToggle } from '@/components/mode-toggle';

export function HomeOnlyModeToggle() {
  const pathname = usePathname();

  if (pathname !== '/') {
    return null;
  }

  return <ModeToggle />;
}

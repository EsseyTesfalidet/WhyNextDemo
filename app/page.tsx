import { cookies } from 'next/headers';
import { ReactModePanel } from '@/components/react-mode-panel';
import { NextModePanel } from '@/components/next-mode-panel';

export default function HomePage() {
  const isOptimized = cookies().get('isOptimized')?.value === '1';

  if (!isOptimized) {
    return <ReactModePanel />;
  }

  return <NextModePanel />;
}

import type { Metadata } from 'next';
import Link from 'next/link';
import { cookies } from 'next/headers';
import '@/app/globals.css';
import { ModeProvider } from '@/components/mode-provider';
import { ModeToggle } from '@/components/mode-toggle';
import { ProjectorToggle } from '@/components/projector-toggle';

export const metadata: Metadata = {
  title: 'Why Next.js Demo',
  description: 'Teaching lab that contrasts React-style client rendering with Next.js features.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const isOptimized = cookies().get('isOptimized')?.value === '1';

  return (
    <html lang="en">
      <body>
        <ModeProvider initialOptimized={isOptimized}>
          <main className="mx-auto max-w-[120rem] px-4 py-8 lg:px-8">
            <header className="mb-6 rounded-2xl border border-slate-200 bg-white/85 p-5 shadow-sm backdrop-blur">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Next.js Feature Battle</p>
                  <h1 className="mt-1 text-3xl font-bold text-slate-900">Teaching Lab: React vs Next.js</h1>
                  <p className="mt-2 text-base text-slate-600">
                    Toggle between slow client-only rendering and Next.js optimized rendering.
                  </p>
                </div>
                <ProjectorToggle />
              </div>

              <nav className="mt-4 flex flex-wrap gap-4 text-base">
                <Link href="/" className="text-blue-700 hover:underline">
                  Home
                </Link>
                <Link href="/terms/tos" className="text-blue-700 hover:underline">
                  Terms of Service (SSG)
                </Link>
              </nav>

              <div className="mt-4">
                <ModeToggle />
              </div>
            </header>
            {children}
          </main>
        </ModeProvider>
      </body>
    </html>
  );
}

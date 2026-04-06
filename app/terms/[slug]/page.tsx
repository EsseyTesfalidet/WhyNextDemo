import { notFound } from 'next/navigation';

export function generateStaticParams() {
  return [{ slug: 'tos' }];
}

export default function TermsPage({ params }: { params: { slug: string } }) {
  if (params.slug !== 'tos') {
    notFound();
  }

  return (
    <section className="rounded-2xl border border-slate-300 bg-white p-6 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Static Site Generation</p>
      <h2 className="mt-2 text-2xl font-bold text-slate-900">Terms of Service</h2>
      <p className="mt-4 text-slate-700">
        This page is generated at build time via <code>generateStaticParams</code>, then served instantly like a static
        file.
      </p>
      <p className="mt-3 text-slate-700">In production, this means near-zero server work and very fast response times.</p>
    </section>
  );
}

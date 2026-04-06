import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getMovieById } from '@/lib/movies';

export default function MoviePage({ params }: { params: { id: string } }) {
  // In react-router-dom we would declare a dynamic route in JS config like "/movie/:id".
  // In Next.js App Router, creating /movie/[id]/page.tsx automatically creates that URL.
  const movie = getMovieById(params.id);

  if (!movie) {
    notFound();
  }

  return (
    <section className="rounded-2xl border border-slate-300 bg-white p-6 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Dynamic Route</p>
      <h2 className="mt-2 text-2xl font-bold text-slate-900">{movie.title}</h2>
      <p className="mt-1 text-sm text-slate-600">{movie.year}</p>
      <p className="mt-4 text-slate-700">{movie.synopsis}</p>
      <Link href="/" className="mt-6 inline-block text-blue-700 hover:underline">
        Back to battle board
      </Link>
    </section>
  );
}

import { Movie } from '@/lib/types';

export const MOVIES: Movie[] = [
  {
    id: 'blade-runner-2049',
    title: 'Blade Runner 2049',
    year: 2017,
    synopsis: 'A new blade runner uncovers a secret that could reshape society.'
  },
  {
    id: 'arrival',
    title: 'Arrival',
    year: 2016,
    synopsis: 'A linguist is recruited to communicate with mysterious visitors.'
  },
  {
    id: 'mad-max-fury-road',
    title: 'Mad Max: Fury Road',
    year: 2015,
    synopsis: 'In a desert wasteland, a rebellion on wheels ignites hope.'
  },
  {
    id: 'the-martian',
    title: 'The Martian',
    year: 2015,
    synopsis: 'An astronaut stranded on Mars must science his way home.'
  }
];

export async function getMoviesFromServer(): Promise<{ movies: Movie[]; elapsedMs: number }> {
  const start = Date.now();
  await new Promise((resolve) => setTimeout(resolve, 100));
  return { movies: MOVIES, elapsedMs: Date.now() - start };
}

export function getMovieById(id: string): Movie | undefined {
  return MOVIES.find((movie) => movie.id === id);
}

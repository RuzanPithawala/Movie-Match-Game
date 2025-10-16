import { getPopularMovies } from '@/lib/tmdb';
import MovieStack from '@/components/MovieStack';

export default async function Home() {
  const movies = await getPopularMovies();

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-black">
      <div className="container mx-auto px-4 py-8 min-h-screen flex flex-col">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">
            🎬 Movie Match Game
          </h1>
          <p className="text-xl text-gray-300">
            Swipe right to like, left to pass
          </p>
        </div>

        {/* Movie Stack */}
        <div className="flex-1 flex items-start justify-center">
          <MovieStack initialMovies={movies} />
        </div>
      </div>
    </main>
  );
}
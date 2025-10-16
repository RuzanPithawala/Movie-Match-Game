'use client';

import { useState, useEffect } from 'react';
import { Movie } from '@/lib/tmdb';
import MovieCard from './MovieCard';
import { Heart, X } from 'lucide-react';
import { generateMockUserPreferences, calculateMatchPercentage, User } from '@/lib/matchCalculator';

interface MovieStackProps {
  initialMovies: Movie[];
}

export default function MovieStack({ initialMovies }: MovieStackProps) {
  const [movies] = useState(initialMovies);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likedMovies, setLikedMovies] = useState<Movie[]>([]);
  const [dislikedMovies, setDislikedMovies] = useState<Movie[]>([]);
  const [mockUsers, setMockUsers] = useState<User[]>([]);

    useEffect(() => {
    setMockUsers(generateMockUserPreferences(initialMovies));
    }, [initialMovies]);

  const handleSwipe = (direction: 'left' | 'right') => {
    const currentMovie = movies[currentIndex];
    
    if (direction === 'right') {
      setLikedMovies([...likedMovies, currentMovie]);
    } else {
      setDislikedMovies([...dislikedMovies, currentMovie]);
    }
    
    setCurrentIndex(currentIndex + 1);
  };

  const handleButtonClick = (direction: 'left' | 'right') => {
    handleSwipe(direction);
  };

  // Calculate visible cards (current + next 2)
  const visibleMovies = movies.slice(currentIndex, currentIndex + 3);

  if (currentIndex >= movies.length) {
  const userMatches = mockUsers.map(user => ({
    ...user,
    matchPercentage: calculateMatchPercentage(likedMovies, user.likedMovies)
  })).sort((a, b) => b.matchPercentage - a.matchPercentage);

  return (
    <div className="flex flex-col items-center justify-start w-full max-w-2xl text-white px-4">
      <h2 className="text-5xl font-bold mb-3">🎉 All Done!</h2>
      <p className="text-xl mb-8 text-gray-300">You&apos;ve rated all the movies</p>
      
      {/* Your Stats */}
      <div className="bg-gradient-to-br from-purple-600/30 to-blue-600/30 backdrop-blur-lg border border-white/20 p-8 rounded-2xl mb-8 w-full shadow-2xl">
        <h3 className="text-2xl font-bold mb-4 text-center">📊 Your Stats</h3>
        <div className="flex justify-around text-center">
          <div>
            <p className="text-5xl font-bold text-green-400 mb-2">{likedMovies.length}</p>
            <p className="text-lg text-gray-300">❤️ Liked</p>
          </div>
          <div className="w-px bg-white/20"></div>
          <div>
            <p className="text-5xl font-bold text-red-400 mb-2">{dislikedMovies.length}</p>
            <p className="text-lg text-gray-300">👎 Passed</p>
          </div>
        </div>
      </div>

      {/* Match Results */}
      {likedMovies.length > 0 && (
        <div className="w-full mb-8">
          <h3 className="text-3xl font-bold mb-6 text-center">🤝 Your Matches</h3>
          <div className="space-y-4">
            {userMatches.map(user => (
              <div 
                key={user.id}
                className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 backdrop-blur-lg border border-white/20 p-5 rounded-2xl flex items-center justify-between hover:scale-105 transition-transform shadow-xl"
              >
                <div className="flex items-center gap-4">
                  <span className="text-5xl">{user.avatar}</span>
                  <div>
                    <p className="font-bold text-xl text-white">{user.name}</p>
                    <p className="text-sm text-gray-300">{user.likedMovies.length} liked movies</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-4xl font-black ${
                    user.matchPercentage >= 70 ? 'text-green-400' :
                    user.matchPercentage >= 40 ? 'text-yellow-400' :
                    'text-red-400'
                  }`}>
                    {user.matchPercentage}%
                  </div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider">match</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={() => {
          setCurrentIndex(0);
          setLikedMovies([]);
          setDislikedMovies([]);
          setMockUsers(generateMockUserPreferences(initialMovies));
        }}
        className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-10 py-4 rounded-full font-bold text-xl transition-all transform hover:scale-110 shadow-2xl"
      >
        🔄 Start Over
      </button>
    </div>
  );
}

  return (
    <div className="flex flex-col items-center">
      {/* Card Stack */}
      <div className="relative w-full max-w-sm h-[550px] mb-12">
        {visibleMovies.map((movie, index) => (
            <MovieCard
                key={movie.id}
                movie={movie}
                onSwipe={index === 0 ? handleSwipe : () => {}}
                isTopCard={index === 0}
                style={{
                    zIndex: visibleMovies.length - index,
                    transform: `scale(${1 - index * 0.05}) translateY(${index * 10}px)`,
                }}
            />
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-6">
        <button
          onClick={() => handleButtonClick('left')}
          className="bg-red-500 hover:bg-red-600 text-white p-6 rounded-full shadow-lg transition transform hover:scale-110"
        >
          <X size={32} />
        </button>
        <button
          onClick={() => handleButtonClick('right')}
          className="bg-green-500 hover:bg-green-600 text-white p-6 rounded-full shadow-lg transition transform hover:scale-110"
        >
          <Heart size={32} />
        </button>
      </div>

      {/* Counter */}
      <div className="mt-8 text-white text-center bg-black/30 backdrop-blur px-6 py-3 rounded-lg">
        <p className="text-lg">
          {currentIndex + 1} / {movies.length}
        </p>
        <div className="flex gap-6 mt-2">
          <span className="text-green-400">❤️ {likedMovies.length}</span>
          <span className="text-red-400">👎 {dislikedMovies.length}</span>
        </div>
      </div>
    </div>
  );
}
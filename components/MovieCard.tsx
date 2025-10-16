'use client';

import { motion, PanInfo } from 'framer-motion';
import { Movie, getImageUrl } from '@/lib/tmdb';
import { Heart, X } from 'lucide-react';
import { useState } from 'react';

interface MovieCardProps {
  movie: Movie;
  onSwipe: (direction: 'left' | 'right') => void;
  isTopCard: boolean;
  style?: React.CSSProperties;
}

export default function MovieCard({ movie, onSwipe, isTopCard, style }: MovieCardProps) {
  const [exitX, setExitX] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);

  const handleDrag = (event: any, info: PanInfo) => {
    setDragOffset(info.offset.x);
  };

  const handleDragEnd = (event: any, info: PanInfo) => {
    if (info.offset.x > 100) {
      // Swiped right
      setExitX(1000);
      setTimeout(() => onSwipe('right'), 200);
    } else if (info.offset.x < -100) {
      // Swiped left
      setExitX(-1000);
      setTimeout(() => onSwipe('left'), 200);
    }
    setDragOffset(0);
  };

    return (
    <div className="absolute w-full max-w-sm select-none" style={style}>
        {/* Static Swipe Indicators - Don't move with card */}
        {isTopCard && (
        <>
            {/* Green overlay when swiping right */}
            <motion.div
            style={{ 
                opacity: dragOffset > 30 ? Math.min(dragOffset / 150, 0.5) : 0 
            }}
            className="absolute inset-0 bg-green-500 pointer-events-none rounded-2xl z-20"
            />
            
            {/* Red overlay when swiping left */}
            <motion.div
            style={{ 
                opacity: dragOffset < -30 ? Math.min(Math.abs(dragOffset) / 150, 0.5) : 0 
            }}
            className="absolute inset-0 bg-red-500 pointer-events-none rounded-2xl z-20"
            />
            
            {/* LIKE Badge */}
            <motion.div
            style={{ 
                opacity: dragOffset > 30 ? 1 : 0,
                scale: dragOffset > 30 ? 1 : 0.5
            }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-green-500 text-white px-10 py-6 rounded-2xl font-black text-5xl rotate-12 pointer-events-none shadow-2xl border-8 border-white z-30"
            >
            <Heart className="inline mr-3" size={48} fill="white" strokeWidth={3} /> LIKE
            </motion.div>
            
            {/* NOPE Badge */}
            <motion.div
            style={{ 
                opacity: dragOffset < -30 ? 1 : 0,
                scale: dragOffset < -30 ? 1 : 0.5
            }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-red-500 text-white px-10 py-6 rounded-2xl font-black text-5xl -rotate-12 pointer-events-none shadow-2xl border-8 border-white z-30"
            >
            <X className="inline mr-3" size={48} strokeWidth={4} /> NOPE
            </motion.div>
        </>
        )}

        {/* Draggable Card */}
        <motion.div
        drag
        dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
        dragElastic={1}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
        initial={{ scale: 1 }}
        animate={{ x: exitX, rotate: exitX / 10 }}
        transition={{ duration: 0.3 }}
        whileDrag={{ cursor: 'grabbing' }}
        className="cursor-grab"
        >
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            {/* Movie Poster */}
            <div className="relative h-80">
            <img
                src={getImageUrl(movie.poster_path, 'w780')}
                alt={movie.title}
                className="w-full h-full object-cover pointer-events-none"
                draggable={false}
            />
            </div>

            {/* Movie Info */}
            {isTopCard && (
            <div className="p-4">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                {movie.title}
                </h2>
                <div className="flex items-center gap-4 mb-3">
                <span className="text-yellow-500 font-semibold">
                    ⭐ {movie.vote_average.toFixed(1)}
                </span>
                <span className="text-gray-500">
                    {new Date(movie.release_date).getFullYear()}
                </span>
                </div>
                <p className="text-gray-600 text-sm line-clamp-2">
                {movie.overview}
                </p>
            </div>
            )}
        </div>
        </motion.div>
    </div>
    );
}
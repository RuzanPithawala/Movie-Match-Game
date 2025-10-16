import { Movie } from './tmdb';

export interface User {
  id: string;
  name: string;
  avatar: string;
  likedMovies: number[];
}

// Mock users with their preferences
export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    avatar: '👩‍💼',
    likedMovies: []
  },
  {
    id: '2',
    name: 'Mike Johnson',
    avatar: '👨‍💻',
    likedMovies: []
  },
  {
    id: '3',
    name: 'Alex Rivera',
    avatar: '🧑‍🎨',
    likedMovies: []
  },
  {
    id: '4',
    name: 'Emma Watson',
    avatar: '👩‍🔬',
    likedMovies: []
  }
];

export function calculateMatchPercentage(
  userLikedMovies: Movie[],
  otherUserLikedMovies: number[]
): number {
  if (userLikedMovies.length === 0 || otherUserLikedMovies.length === 0) {
    return 0;
  }

  const userMovieIds = userLikedMovies.map(m => m.id);
  const commonMovies = userMovieIds.filter(id => otherUserLikedMovies.includes(id));
  
  const matchPercentage = (commonMovies.length / Math.max(userMovieIds.length, otherUserLikedMovies.length)) * 100;
  
  return Math.round(matchPercentage);
}

// Generate random liked movies for mock users
export function generateMockUserPreferences(allMovies: Movie[]): User[] {
  return mockUsers.map(user => ({
    ...user,
    likedMovies: allMovies
      .filter(() => Math.random() > 0.5) // 50% chance of liking each movie
      .map(m => m.id)
      .slice(0, 10) // Limit to 10 liked movies per user
  }));
}
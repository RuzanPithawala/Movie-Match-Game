const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

export interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  backdrop_path: string | null;
  overview: string;
  vote_average: number;
  release_date: string;
  genre_ids: number[];
}

export interface TMDBResponse {
  results: Movie[];
  page: number;
  total_pages: number;
}

export async function getPopularMovies(page: number = 1): Promise<Movie[]> {
  try {
    const response = await fetch(
      `${BASE_URL}/movie/popular?api_key=${API_KEY}&page=${page}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch movies');
    }
    
    const data: TMDBResponse = await response.json();
    return data.results;
  } catch (error) {
    console.error('Error fetching movies:', error);
    return [];
  }
}

export function getImageUrl(path: string | null, size: string = 'w500'): string {
  if (!path) return '/placeholder-movie.png';
  return `https://image.tmdb.org/t/p/${size}${path}`;
}
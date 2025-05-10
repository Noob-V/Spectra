import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const MoviesContext = createContext();

// MoviesProvider component provides the context for managing movies, favorites, and search history.
// It fetches movies from an API and allows adding/removing favorites and managing search history.
export const MoviesProvider = ({ children }) => {
  const [movies, setMovies] = useState([]);
  const [favorites, setFavorites] = useState(JSON.parse(localStorage.getItem('favorites')) || []);
  const [searchHistory, setSearchHistory] = useState([]); // searchHistory state
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({ genre: '', year: '', rating: '' });

  const API_KEY = process.env.REACT_APP_TMDB_API_KEY; 
  const BASE_URL = process.env.REACT_APP_TMDB_BASE_URL;

  const fetchMovies = async (query = '', pageNum = 1) => {
    setLoading(true);
    try {
      // Destructure filters
      const { genre, year, rating } = filters;

      // Construct query parameters based on filters
      const params = {
        api_key: API_KEY,
        query: query || undefined,
        page: pageNum,
        with_genres: genre || undefined,
        primary_release_year: year || undefined,
        'vote_average.gte': rating || undefined,
      };

      // Remove undefined values from params
      const queryParams = Object.fromEntries(
        Object.entries(params).filter(([_, value]) => value !== undefined)
      );

      // Determine the endpoint (search or discover)
      const endpoint = query
        ? `${BASE_URL}/search/movie`
        : `${BASE_URL}/discover/movie`;

      // Make the API request
      const response = await axios.get(endpoint, { params: queryParams });

      // Update state with the fetched movies
      setMovies(prev =>
        pageNum === 1 ? response.data.results : [...prev, ...response.data.results]
      );
      setPage(pageNum + 1);
      setTotalPages(response.data.total_pages);
      setError(null);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false); // Reset loading state
  };

  //add a movie to favorites
  // It checks if the movie is already in favorites, if not, it adds it to the list
  const addFavorite = (movie) => {
    const newFavorites = [...favorites, movie];
    setFavorites(newFavorites);
    localStorage.setItem('favorites', JSON.stringify(newFavorites));
  };
  // Remove a movie from favorites
  // It filters out the movie with the given id and updates the state and localStorage
  const removeFavorite = (id) => {
    const newFavorites = favorites.filter(movie => movie.id !== id);
    setFavorites(newFavorites);
    localStorage.setItem('favorites', JSON.stringify(newFavorites));
  };

  // search history
  // It retrieves the search history from localStorage and sets it to the state
  const addSearchTerm = (term) => {
    const newHistory = [term, ...searchHistory.filter(t => t !== term)].slice(0, 5);
    setSearchHistory(newHistory);
    localStorage.setItem('searchHistory', JSON.stringify(newHistory));
  };

   return (
    <MoviesContext.Provider value={{
      movies,
      favorites,
      searchHistory,
      setSearchHistory, // Provide setSearchHistory in the context
      loading,
      error,
      filters,
      page,
      totalPages,
      fetchMovies,
      addFavorite,
      removeFavorite,
      addSearchTerm,
      setFilters
    }}>
      {children}
    </MoviesContext.Provider>
  );
};

export const useMovies = () => useContext(MoviesContext);
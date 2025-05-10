import axios from 'axios';

const API_KEY = process.env.REACT_APP_TMDB_API_KEY;
const BASE_URL = process.env.REACT_APP_TMDB_BASE_URL;

export const fetchMovies = async (query, page = 1) => {
  try {
    const url = query 
      ? `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${query}&page=${page}`
      : `${BASE_URL}/movie/popular?api_key=${API_KEY}&page=${page}`;
    
    const response = await axios.get(url);
    return response.data.results;
  } catch (error) {
    throw new Error('Failed to fetch movies');
  }
};

export const fetchMovieDetails = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/movie/${id}?api_key=${API_KEY}`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch movie details');
  }
};

// This file provides API service functions to interact with the TMDB (The Movie Database) API using Axios.
// - `fetchMovies`: Fetches a list of movies based on a search query or retrieves popular movies if no query is provided.
// - `fetchMovieDetails`: Fetches detailed information about a specific movie by its ID.
// Both functions handle errors gracefully and throw custom error messages if the API call fails.
// These utilities are designed to streamline communication with the TMDB API for movie-related data.
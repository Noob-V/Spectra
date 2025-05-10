import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Box, Typography, Grid, Chip, CircularProgress, Button, Avatar, Card } from '@mui/material';
import axios from 'axios';
import ReactPlayer from 'react-player';
import { useMovies, useAuth } from '../contexts';
import { motion } from 'framer-motion';

// This component fetches and displays detailed information about a specific movie.
// It includes the movie's title, overview, release date, rating, cast, trailer, and recommendations.
export const MovieDetails = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [cast, setCast] = useState([]);
  const [trailer, setTrailer] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addFavorite, removeFavorite, favorites } = useMovies();
  const { user } = useAuth();

  // Fetch movie details, cast, trailer, and recommendations using the TMDB API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [movieRes, creditsRes, videosRes, recommendationsRes] = await Promise.all([
          axios.get(`${process.env.REACT_APP_TMDB_BASE_URL}/movie/${id}?api_key=${process.env.REACT_APP_TMDB_API_KEY}`),
          axios.get(`${process.env.REACT_APP_TMDB_BASE_URL}/movie/${id}/credits?api_key=${process.env.REACT_APP_TMDB_API_KEY}`),
          axios.get(`${process.env.REACT_APP_TMDB_BASE_URL}/movie/${id}/videos?api_key=${process.env.REACT_APP_TMDB_API_KEY}`),
          axios.get(`${process.env.REACT_APP_TMDB_BASE_URL}/movie/${id}/recommendations?api_key=${process.env.REACT_APP_TMDB_API_KEY}`)
        ]);
        // Set the fetched data to state variables
        setMovie(movieRes.data);
        setCast(creditsRes.data.cast.slice(0, 10));
        setTrailer(videosRes.data.results.find(v => v.site === 'YouTube'));
        setRecommendations(recommendationsRes.data.results.slice(0, 8));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching movie details:', error);
        setLoading(false);
      }
    };
// Call the fetch function
    fetchData();
  }, [id]);
// Check if the movie is still loading
  if (loading) return <CircularProgress sx={{ display: 'block', mx: 'auto', my: 4 }} />;
// Check if the movie data is available
  return (
    <Box
      sx={{
        p: 4,
        background: `linear-gradient(to bottom, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.95)), url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: 'white',
        minHeight: '100vh',
      }}
    >
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
        {/* Movie Details Section */}
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Box
              component="img"
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              sx={{
                width: '100%',
                borderRadius: 2,
                boxShadow: '0 8px 16px rgba(0, 0, 0, 0.5)',
              }}
            />
          </Grid>

          <Grid item xs={12} md={8}>
            <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold' }}>
              {movie.title}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
              <Chip label={`★ ${movie.vote_average}`} color="primary" />
              <Chip label={new Date(movie.release_date).getFullYear()} />
              {movie.genres.map(genre => (
                <Chip key={genre.id} label={genre.name} variant="outlined" sx={{ color: 'white', borderColor: 'white' }} />
              ))}
            </Box>

            <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
              {movie.overview}
            </Typography>

            {user && (
              <Button
                variant="contained"
                color={favorites.some(f => f.id === movie.id) ? 'error' : 'primary'}
                onClick={() =>
                  favorites.some(f => f.id === movie.id)
                    ? removeFavorite(movie.id)
                    : addFavorite(movie)
                }
                sx={{ mb: 3 }}
              >
                {favorites.some(f => f.id === movie.id) ? 'Remove Favorite' : 'Add Favorite'}
              </Button>
            )}
          </Grid>
        </Grid>

        {/* Trailer Section */}
        {trailer && (
          <Card
            sx={{
              mt: 6,
              p: 2,
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              borderRadius: 2,
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)',
            }}
          >
            <Typography variant="h5" gutterBottom>
              Trailer
            </Typography>
            <ReactPlayer
              url={`https://www.youtube.com/watch?v=${trailer.key}`}
              controls
              width="100%"
            />
          </Card>
        )}

        {/* Cast Section */}
        <Typography variant="h5" sx={{ mt: 6, mb: 2, fontWeight: 'bold' }}>
          Cast
        </Typography>
        <Grid container spacing={2}>
          {cast.map(actor => (
            <Grid item xs={6} sm={4} md={3} key={actor.id}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  gap: 1,
                  '&:hover': { transform: 'scale(1.05)', transition: 'transform 0.3s' },
                }}
              >
                <Avatar
                  src={`https://image.tmdb.org/t/p/w200${actor.profile_path}`}
                  alt={actor.name}
                  sx={{ width: 80, height: 80, boxShadow: '0 4px 8px rgba(0, 0, 0, 0.5)' }}
                />
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                  {actor.name}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>

        {/* Recommendations Section */}
        <Typography variant="h5" sx={{ mt: 6, mb: 2, fontWeight: 'bold' }}>
          Recommended Movies
        </Typography>
        <Grid container spacing={4}>
          {recommendations.map(rec => (
            <Grid item xs={12} sm={6} md={3} key={rec.id}>
              <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }}>
                <Link to={`/movie/${rec.id}`} style={{ textDecoration: 'none' }}>
                  <Card
                    sx={{
                      backgroundColor: 'rgba(0, 0, 0, 0.7)',
                      color: 'white',
                      borderRadius: 2,
                      overflow: 'hidden',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)',
                    }}
                  >
                    <Box
                      component="img"
                      src={`https://image.tmdb.org/t/p/w500${rec.poster_path}`}
                      alt={rec.title}
                      sx={{ width: '100%', height: 300, objectFit: 'cover' }}
                    />
                    <Box sx={{ p: 2 }}>
                      <Typography variant="body1" noWrap>
                        {rec.title}
                      </Typography>
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        ★ {rec.vote_average}
                      </Typography>
                    </Box>
                  </Card>
                </Link>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </motion.div>
    </Box>
  );
};
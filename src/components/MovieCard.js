import { useState, useEffect } from 'react';
import { 
  Card, 
  CardMedia, 
  CardContent, 
  Typography, 
  IconButton, 
  Box, 
  Chip,
  Skeleton,
  Tooltip,
  alpha
} from '@mui/material';
import { 
  Favorite, 
  FavoriteBorder, 
  CalendarMonth, 
  Star
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { useMovies, useAuth } from '../contexts';
import { Link } from 'react-router-dom';


// This component displays a movie card with details like title, release date, and rating.
// It also includes a favorite button to add/remove the movie from favorites.
export const MovieCard = ({ movie }) => {
  const theme = useTheme();
  const { favorites, addFavorite, removeFavorite } = useMovies();
  const { user } = useAuth();
  const [isFavorite, setIsFavorite] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    setIsFavorite(favorites.some(fav => fav.id === movie.id));
  }, [favorites, movie.id]);

  const handleFavorite = () => {
    if (!user) return;
    isFavorite ? removeFavorite(movie.id) : addFavorite(movie);
  };

  // Format release date
  const releaseYear = movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A';
  
  // Handle rating display
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A';

  // Animation for the card
  return (
    <motion.div 
      whileHover={{ 
        scale: 1.03, 
        y: -5,
        transition: { duration: 0.3, ease: "easeOut" }
      }} 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card 
        sx={{ 
          height: '100%', 
          position: 'relative',
          borderRadius: 2,
          overflow: 'hidden',
          boxShadow: theme.palette.mode === 'dark' 
            ? '0 10px 20px rgba(0,0,0,0.3)'
            : '0 10px 20px rgba(0,0,0,0.1)',
          background: theme.palette.mode === 'dark' 
            ? 'linear-gradient(to bottom, #2c3e50, #1e272e)'
            : 'white',
          display: 'flex',
          flexDirection: 'column',
          '&:hover': {
            boxShadow: theme.palette.mode === 'dark' 
              ? '0 14px 28px rgba(0,0,0,0.4)'
              : '0 14px 28px rgba(0,0,0,0.25)',
          }
        }}
      >
        {/* Favorite Button with Animation */}
        <Tooltip title={user ? (isFavorite ? "Remove from favorites" : "Add to favorites") : "Sign in to add favorites"}>
          <motion.div
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            style={{ 
              position: 'absolute', 
              right: 8, 
              top: 8, 
              zIndex: 2,
              background: alpha(theme.palette.background.paper, 0.5),
              borderRadius: '50%'
            }}
          >
            <IconButton
              onClick={handleFavorite}
              disabled={!user}
              sx={{
                color: isFavorite ? 'error.main' : 'white',
                '&:hover': {
                  bgcolor: alpha(theme.palette.background.paper, 0.2),
                },
                transition: 'all 0.2s ease',
              }}
            >
              {isFavorite ? (
                <Favorite sx={{ fontSize: 26 }} />
              ) : (
                <FavoriteBorder sx={{ 
                  color: 'white', 
                  fontSize: 26,
                  filter: 'drop-shadow(0 2px 2px rgba(0,0,0,0.5))'
                }} />
              )}
            </IconButton>
          </motion.div>
        </Tooltip>

        {/* Movie Poster with Link */}
        <Box sx={{ position: 'relative', overflow: 'hidden' }}>
          <Link to={`/movie/${movie.id}`} style={{ textDecoration: 'none', display: 'block' }}>
            {!imageLoaded && (
              <Skeleton 
                variant="rectangular" 
                height={400} 
                animation="wave" 
                sx={{ 
                  bgcolor: theme.palette.mode === 'dark' ? 'grey.800' : 'grey.200',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  zIndex: 1
                }} 
              />
            )}
            <CardMedia
              component="img"
              image={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              sx={{ 
                height: 400,
                objectFit: 'cover',
                transition: 'transform 0.5s ease',
                '&:hover': {
                  transform: 'scale(1.05)',
                },
              }}
              onLoad={() => setImageLoaded(true)}
            />
            
            {/* Overlay gradient */}
            <Box 
              sx={{ 
                position: 'absolute', 
                bottom: 0, 
                left: 0, 
                right: 0, 
                height: '30%',
                background: 'linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0))',
                zIndex: 1
              }} 
            />
          </Link>
        </Box>

        {/* Rating Badge */}
        <Chip 
          icon={<Star sx={{ color: theme.palette.mode === 'dark' ? '#FFD700' : '#FF8F00' }} />}
          label={rating}
          sx={{ 
            position: 'absolute', 
            left: 12, 
            top: 12, 
            fontWeight: 'bold',
            backgroundColor: theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.7)' : 'rgba(255,255,255,0.9)',
            color: theme.palette.mode === 'dark' ? '#FFD700' : '#FF8F00',
            borderRadius: '12px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
            '& .MuiChip-icon': {
              color: theme.palette.mode === 'dark' ? '#FFD700' : '#FF8F00',
            }
          }} 
        />

        {/* Card Content */}
        <CardContent 
          sx={{ 
            flexGrow: 1, 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'space-between',
            p: 2
          }}
        >
          <Typography 
            variant="h6" 
            noWrap
            component="h3"
            sx={{ 
              fontWeight: 600, 
              mb: 1.5,
              color: theme.palette.mode === 'dark' ? theme.palette.grey[100] : theme.palette.grey[900],
              lineHeight: 1.3,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {movie.title}
          </Typography>
          
          <Box 
            sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              mt: 'auto'
            }}
          >
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                color: theme.palette.mode === 'dark' ? theme.palette.grey[400] : theme.palette.grey[700],
              }}
            >
              <CalendarMonth sx={{ fontSize: 18, mr: 0.5 }} />
              <Typography 
                variant="body2"
                sx={{ fontWeight: 500 }}
              >
                {releaseYear}
              </Typography>
            </Box>
            
            {/* Genre Chip */}
            {movie.genre_ids && movie.genre_ids[0] && (
              <Chip 
                label="Action" 
                size="small"
                sx={{ 
                  fontSize: '0.7rem',
                  height: 24,
                  bgcolor: theme.palette.mode === 'dark' ? alpha(theme.palette.primary.main, 0.2) : alpha(theme.palette.primary.light, 0.2),
                  color: theme.palette.mode === 'dark' ? theme.palette.primary.light : theme.palette.primary.dark,
                  fontWeight: 500,
                  '&:hover': {
                    bgcolor: theme.palette.mode === 'dark' ? alpha(theme.palette.primary.main, 0.3) : alpha(theme.palette.primary.light, 0.3),
                  }
                }} 
              />
            )}
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
};
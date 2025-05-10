import { useState } from 'react';
import { 
  Container, 
  Grid, 
  Typography, 
  Box, 
  Paper,
  Divider,
  useTheme,
  Fade,
  Button,
  alpha
} from '@mui/material';
import { 
  FavoriteBorder, 
  SentimentDissatisfied, 
  ArrowBack,
  MovieFilter,
  Sort
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useMovies } from '../contexts';
import { MovieCard } from '../components';
import { Link } from 'react-router-dom';

export const Favorites = () => {
  const { favorites } = useMovies();// Get the list of favorite movies
  const theme = useTheme(); // Get the current theme
  const [sortOrder, setSortOrder] = useState('date');  // 'date', 'rating', 'name'

  // Sort favorites based on selected order
  const sortedFavorites = [...favorites].sort((a, b) => {
    switch(sortOrder) {
      case 'rating':
        return b.vote_average - a.vote_average; // Highest rating first
      case 'name':
        return a.title.localeCompare(b.title); // A-Z
      case 'date':
      default:
        // Most recently added first (assuming favorites array maintains order)
        return 0; // Keep original order
    }
  });

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        when: "beforeChildren"
      }
    }
  };
  // Animation for each item
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  // Header gradient based on theme
  const headerGradient = theme.palette.mode === 'dark'
    ? 'linear-gradient(to right, #4568dc, #b06ab3)'
    : 'linear-gradient(to right, #2193b0, #6dd5ed)';

  return (
    <Box 
      sx={{ 
        minHeight: '90vh',
        py: 6,
        background: theme.palette.mode === 'dark' 
          ? 'linear-gradient(to bottom, #0f2027, #203a43, #2c5364)'
          : 'linear-gradient(to bottom, #e0eafc, #cfdef3)',
      }}
    >
      <Container maxWidth="xl">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Box 
            sx={{ 
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              justifyContent: 'space-between',
              alignItems: { xs: 'flex-start', sm: 'center' },
              mb: 4
            }}
          >
            <Box>
              <Typography 
                variant="h3" 
                component="h1"
                sx={{ 
                  fontWeight: 700,
                  mb: 1,
                  background: headerGradient,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  display: 'inline-flex',
                  alignItems: 'center',
                }}
              >
                <FavoriteBorder sx={{ mr: 1, fontSize: 40, color: theme.palette.error.main }} />
                Your Favorites
              </Typography>
              
              <Typography 
                variant="subtitle1" 
                color="text.secondary"
                sx={{ maxWidth: '700px', mb: 2 }}
              >
                Your personally curated collection of favorite movies. These selections reflect your unique taste in cinema.
              </Typography>
            </Box>

            <Button 
              component={Link} 
              to="/"
              startIcon={<ArrowBack />}
              variant="outlined"
              sx={{ 
                borderRadius: 8,
                textTransform: 'none',
                px: 2,
                mt: { xs: 2, sm: 0 }
              }}
            >
              Back to Browse
            </Button>
          </Box>
        </motion.div>

        <Divider sx={{ mb: 4 }} />

        {/* Controls Section */}
        {favorites.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Box 
              sx={{ 
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 3
              }}
            >
              <Typography variant="h6" color="text.secondary">
                {favorites.length} {favorites.length === 1 ? 'Movie' : 'Movies'}
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  size="small"
                  startIcon={<Sort />}
                  variant={sortOrder === 'date' ? 'contained' : 'outlined'}
                  onClick={() => setSortOrder('date')}
                  sx={{ 
                    borderRadius: 6,
                    textTransform: 'none',
                  }}
                >
                  Recent
                </Button>
                <Button
                  size="small"
                  startIcon={<StarIcon />}
                  variant={sortOrder === 'rating' ? 'contained' : 'outlined'}
                  onClick={() => setSortOrder('rating')}
                  sx={{ 
                    borderRadius: 6,
                    textTransform: 'none',
                  }}
                >
                  Rating
                </Button>
                <Button
                  size="small"
                  startIcon={<SortIcon />}
                  variant={sortOrder === 'name' ? 'contained' : 'outlined'}
                  onClick={() => setSortOrder('name')}
                  sx={{ 
                    borderRadius: 6,
                    textTransform: 'none',
                  }}
                >
                  A-Z
                </Button>
              </Box>
            </Box>
          </motion.div>
        )}

        {/* Content Section */}
        {favorites.length === 0 ? (
          <Fade in={true} timeout={1000}>
            <Paper 
              elevation={3}
              sx={{ 
                p: 5, 
                textAlign: 'center',
                borderRadius: 4,
                background: theme.palette.mode === 'dark' 
                  ? alpha(theme.palette.background.paper, 0.8)
                  : theme.palette.background.paper,
                backdropFilter: 'blur(10px)',
              }}
            >
              <SentimentDissatisfied 
                sx={{ 
                  fontSize: 80, 
                  color: theme.palette.mode === 'dark' ? theme.palette.grey[600] : theme.palette.grey[400],
                  mb: 2
                }} 
              />
              <Typography variant="h5" gutterBottom fontWeight={600}>
                Your favorites collection is empty
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph sx={{ maxWidth: 600, mx: 'auto', mb: 4 }}>
                Start building your personal movie collection by clicking the heart icon on any movie card you love.
              </Typography>
              <Button 
                component={Link} 
                to="/"
                variant="contained"
                startIcon={<MovieFilter />}
                size="large"
                sx={{ 
                  borderRadius: 8,
                  textTransform: 'none',
                  px: 4,
                  py: 1.5,
                  background: headerGradient,
                  '&:hover': {
                    background: theme.palette.mode === 'dark'
                      ? 'linear-gradient(to right, #5e7cef, #c380c3)'
                      : 'linear-gradient(to right, #21a6d0, #7ee0f9)'
                  }
                }}
              >
                Discover Movies
              </Button>
            </Paper>
          </Fade>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <Grid container spacing={3}>
              {sortedFavorites.map((movie) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={movie.id}>
                  <motion.div variants={itemVariants}>
                    <MovieCard movie={movie} />
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </motion.div>
        )}
      </Container>
    </Box>
  );
};

// Helper icons for sorting
const StarIcon = () => {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" 
        fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
};

// Icon for sorting by name
const SortIcon = () => {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 6H14M3 12H12M3 18H10M21 6L17 10M17 6L21 10M21 14V18M21 18L17 18M21 18L18 21" 
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
};
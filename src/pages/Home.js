import { Box, Typography, useTheme, alpha } from '@mui/material';
import { useEffect, useState } from 'react';
import { Grid, TextField, Container, CircularProgress, Button, IconButton } from '@mui/material';
import { useMovies, useAuth } from '../contexts';
import { MovieCard, Filters, SearchHistory } from '../components';
import { motion } from 'framer-motion';
import { useDebounce } from '../hooks';
import Slider from 'react-slick';
import { ChevronLeft, ChevronRight, Star, Search } from '@mui/icons-material';
import { Chip } from '@mui/material';
import { Link } from 'react-router-dom';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

// Carousel arrow component for navigation
const CarouselArrow = ({ onClick, direction }) => (
  <IconButton
    onClick={onClick}
    sx={{
      position: 'absolute',
      [direction === 'prev' ? 'left' : 'right']: { xs: 10, sm: 15, md: 20, lg: 30  },
      top: '50%',
      transform: 'translateY(-50%)',
      zIndex: 10,
      color: 'white',
      backgroundColor: 'rgba(15, 15, 25, 0.6)',
      backdropFilter: 'blur(10px)',
      width: { xs: 40, sm: 48, md: 56 },
      height: { xs: 40, sm: 48, md: 56 },
      transition: 'all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      '&:hover': {
        backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.85),
        transform: 'translateY(-50%) scale(1.1)',
        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.5), 0 0 15px rgba(114, 137, 218, 0.5)',
      },
      '&:active': {
        transform: 'translateY(-50%) scale(0.95)'
      }
    }}
  >
    {direction === 'prev' ? <ChevronLeft fontSize="medium" /> : <ChevronRight fontSize="medium" />}
  </IconButton>
);

// Section heading component for consistent styling
const SectionHeading = ({ text, gradientColors }) => (
  <Typography 
    variant="h2" 
    component="h2"
    sx={{
      fontWeight: 800,
      mb: { xs: 4, md: 6 },
      background: gradientColors,
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      color: 'transparent',
      textAlign: 'center',
      letterSpacing: '0.02em',
      textTransform: 'uppercase',
      fontFamily: '"Space Grotesk", sans-serif',
      fontSize: { xs: '1.75rem', sm: '2.25rem', md: '2.5rem' },
      position: 'relative',
      '&::after': {
        content: '""',
        position: 'absolute',
        bottom: -12,
        left: '50%',
        transform: 'translateX(-50%)',
        width: { xs: 60, md: 80 },
        height: 4,
        borderRadius: 2,
        background: gradientColors,
      }
    }}
  >
    {text}
  </Typography>
);

// Main Home component
export const Home = () => {
  const theme = useTheme();
  const { movies, fetchMovies, loading, addSearchTerm, filters, page, totalPages } = useMovies();
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 500);
  const { user } = useAuth();

  // Get top 10 rated movies
  const topPicks = [...movies]
    .sort((a, b) => b.vote_average - a.vote_average) // Sort movies by rating
    .slice(0, 10); // Top 10 movies based on rating 

  useEffect(() => {
    fetchMovies(debouncedSearch, 1); // Fetch movies based on search term and filters
    if (debouncedSearch) addSearchTerm(debouncedSearch);
  }, [debouncedSearch, filters]); // Ensure filters are included in the dependency array

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 700,
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: <CarouselArrow direction="next" />, 
    prevArrow: <CarouselArrow direction="prev" />,
    centerMode: true,
    centerPadding: { xs: '0px', sm: '50px', md: '80px', lg: '160px' },

    // Responsive settings for different screen sizes
    responsive: [
      {
        breakpoint: theme.breakpoints.values.xl,
        settings: {
          slidesToShow: 1.5,
          centerPadding: '120px',
        }
      },
      {
        breakpoint: theme.breakpoints.values.lg,
        settings: {
          slidesToShow: 1.3,
          centerPadding: '80px',
        }
      },
      {
        breakpoint: theme.breakpoints.values.md,
        settings: {
          slidesToShow: 1.15,
          centerPadding: '40px',
        }
      },
      {
        breakpoint: theme.breakpoints.values.sm,
        settings: {
          slidesToShow: 1,
          centerPadding: '20px',
          centerMode: false
        }
      }
    ],
    dotsClass: 'slick-dots custom-dots',
    autoplay: true,
    autoplaySpeed: 7000,
    pauseOnHover: true,
    fade: false,
    cssEase: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
  };

  // Animation for the entire page
  return (
    <Box
      sx={{
        background: (theme) => `linear-gradient(135deg, 
          ${alpha('#090b13', 0.97)} 0%, 
          ${alpha('#12151f', 0.95)} 50%,
          ${alpha('#1a1d2c', 0.93)} 100%)`,
        color: 'common.white',
        minHeight: '100vh',
        pt: { xs: 2, sm: 3, md: 6 },
        pb: { xs: 4, sm: 6, md: 10 },
        overflowX: 'hidden',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: 'url("/assets/subtle-pattern.png")',
          backgroundSize: '200px',
          opacity: 0.04,
          pointerEvents: 'none',
        }
      }}
    >
      <Container maxWidth="xl">
        {/* Hero Section */}
        <Box 
          component={motion.div}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          sx={{ 
            textAlign: 'center', 
            mb: { xs: 3, sm: 4, md: 6 },
            mt: { xs: 1, sm: 2, md: 0 }
          }}
        >
          <Typography 
            variant="h1" 
            sx={{
              fontWeight: 900,
              fontSize: { xs: '2rem', sm: '2.5rem', md: '3.5rem', lg: '4.5rem' },
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
              background: 'linear-gradient(135deg, #fff 30%, rgba(255,255,255,0.6) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              color: 'transparent',
              mb: 2,
              textShadow: '0 20px 30px rgba(0,0,0,0.5)',
              fontFamily: '"Space Grotesk", sans-serif',
            }}
          >
            Discover Cinematic Excellence
          </Typography>
          <Typography
            variant="subtitle1"
            component={motion.p}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            sx={{
              fontSize: { xs: '0.875rem', sm: '1rem', md: '1.25rem' },
              maxWidth: '800px',
              mx: 'auto',
              px: { xs: 2, sm: 0 },
              color: 'rgba(255,255,255,0.7)',
              mb: { xs: 3, sm: 4, md: 5 },
              fontWeight: 400,
              lineHeight: 1.5,
            }}
          >
            Explore the world's finest films, curated just for you.
            Find your next cinematic adventure.
          </Typography>
        </Box>

        {/* Search Section */}
        <Box 
          sx={{ 
            mb: { xs: 4, sm: 5, md: 8 }, 
            position: 'relative',
            maxWidth: { xs: '100%', sm: '750px', md: '850px' },
            mx: 'auto',
            px: { xs: 2, sm: 0 }
          }}
        >
          <motion.div 
            initial={{ y: -20, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }} 
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Box 
              sx={{ 
                position: 'relative',
                borderRadius: 4,
                boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                overflow: 'hidden',
              }}
            >
              <TextField
                fullWidth
                variant="filled"
                placeholder="Search cinematic masterpieces..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <Search 
                      sx={{ 
                        mr: 1.5, 
                        ml: 1, 
                        color: 'primary.light',
                        fontSize: '1.5rem'
                      }} 
                    />
                  ),
                  endAdornment: loading && (
                    <CircularProgress 
                      size={28} 
                      sx={{ 
                        color: (theme) => theme.palette.primary.light,
                        mr: 1.5
                      }} 
                    />
                  ),
                  disableUnderline: true,
                  sx: {
                    borderRadius: 4,
                    background: 'rgba(20, 23, 36, 0.85)',
                    backdropFilter: 'blur(16px)',
                    border: '1px solid rgba(255,255,255,0.07)',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    '& .MuiFilledInput-input': {
                      py: { xs: 2, sm: 2.5, md: 3 },
                      px: 1,
                      fontSize: { xs: '0.9rem', sm: '1rem', md: '1.15rem' },
                      color: 'common.white',
                      fontWeight: 500,
                      '&::placeholder': {
                        color: 'rgba(255,255,255,0.5)',
                        opacity: 1
                      }
                    },
                    '&:hover': {
                      background: 'rgba(25, 28, 43, 0.9)',
                      boxShadow: '0 0 0 1px rgba(114, 137, 218, 0.3)',
                    },
                    '&.Mui-focused': {
                      background: 'rgba(28, 32, 48, 0.95)',
                      boxShadow: (theme) => `0 0 0 2px ${alpha(theme.palette.primary.main, 0.5)}`,
                    }
                  },
                }}
              />
            </Box>
          </motion.div>

          {/* Search History and Filters */}
          <Box sx={{ mt: 2, px: { xs: 0, md: 2 } }}>
            <SearchHistory />
            <Filters />
          </Box>
        </Box>

        {/* Carousel  */}
        {topPicks.length > 0 && (
          <Box 
            component={motion.div}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            sx={{ 
              mb: { xs: 5, sm: 7, md: 12 },
              position: 'relative',
              width: '100vw', // Makes the carousel full width
              left: '50%',
              right: '50%',
              mx: '-50vw', // Centers the carousel
              px: { xs: 0, sm: 0, md: 0 },
              overflow: 'hidden',
              '& .slick-list': {
                overflow: 'visible',
                py: { xs: 3, sm: 4, md: 5 }, 
              },
              '& .slick-track': {
                display: 'flex',
                gap: { xs: 1, md: 2 }
              },
              '& .slick-slide': {
                transition: 'all 0.4s ease',
                opacity: 0.45,
                transform: 'scale(0.85)',
                filter: 'brightness(0.7) blur(2px)',
              },
              '& .slick-center, & .slick-active': {
                opacity: 1,
                transform: 'scale(1)',
                filter: 'brightness(1) blur(0px)',
                zIndex: 5,
              },
              '& .slick-dots': {
                bottom: -40,
                '& li': {
                  mx: 0.5,
                },
                '& li button:before': {
                  fontSize: 0,
                  width: 14,
                  height: 6,
                  borderRadius: 3,
                  background: 'rgba(255,255,255,0.2)',
                  opacity: 1,
                  transition: 'all 0.3s ease',
                },
                '& li.slick-active button:before': {
                  background: (theme) => `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
                  width: 28,
                  height: 6
                }
              },
            // Carousel overlay gradient
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'radial-gradient(ellipse at center, rgba(0,0,0,0) 60%, rgba(0,0,0,0.5) 100%)',
                pointerEvents: 'none',
                zIndex: 8,
              }
            }}
          >
            {/* Section header above the carousel */}
            <Box sx={{ 
              textAlign: 'center', 
              mb: { xs: 4, sm: 5, md: 6 }, 
              px: { xs: 2, sm: 0 },
              position: 'relative',
              zIndex: 9
            }}>
              <SectionHeading 
                text="Curated Excellence" 
                gradientColors="linear-gradient(45deg, #ff6b6b 20%, #ff9a8b 70%, #ffd1ba 100%)" 
              />
            </Box>
            {/* Carousel Slider */}
            <Slider {...sliderSettings}>
              {topPicks.map((movie) => (
                <Box key={movie.id} sx={{ px: { xs: 1, sm: 2, md: 3 } }}>
                  <motion.div 
                    whileHover={{ 
                      scale: 1.03,
                      y: -8
                    }} 
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                  >
                    <Link
                      to={`/movie/${movie.id}`}
                      style={{ textDecoration: 'none' }}
                    >
                      <Box sx={{
                        position: 'relative',
                        borderRadius: { xs: 2, sm: 3, md: 4 },
                        overflow: 'hidden',
                        aspectRatio: '16/9',
                        height: { xs: 220, sm: 280, md: 380, lg: 420 },
                        boxShadow: '0 30px 60px -12px rgba(0,0,0,0.7), 0 18px 36px -18px rgba(0,0,0,0.6)',
                        transition: 'all 0.4s ease',
                        border: '1px solid rgba(255,255,255,0.05)',
                        '&:hover': {
                          boxShadow: (theme) => `0 40px 80px -20px rgba(0,0,0,0.8), 0 0 20px ${alpha(theme.palette.primary.main, 0.4)}`,
                          '& .carousel-overlay': { 
                            opacity: 1,
                            background: 'linear-gradient(to top, rgba(0,0,0,0.98) 0%, rgba(0,0,0,0.8) 25%, rgba(0,0,0,0.4) 60%, rgba(0,0,0,0.1) 80%, transparent 100%)',
                          },
                          '& img': { 
                            transform: 'scale(1.1)',
                            filter: 'brightness(1.15) contrast(1.15)'
                          },
                          '& .movie-title': {
                            transform: 'translateY(-8px)',
                            textShadow: '0 4px 16px rgba(0,0,0,0.7)'
                          },
                          '& .movie-meta': {
                            transform: 'translateY(0)', 
                            opacity: 1
                          }
                        }
                      }}>
                        {/* Movie Backdrop Image */}
                        <Box
                          component="img"
                          src={`https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`}
                          alt={movie.title}
                          sx={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            transition: 'transform 0.8s cubic-bezier(0.2, 0.8, 0.2, 1), filter 0.4s ease',
                            filter: 'brightness(0.9) contrast(1.05)',
                          }}
                        />
                        
                        {/* Overlay Gradient with Movie Info */}
                        <Box className="carousel-overlay" sx={{
                          position: 'absolute',
                          bottom: 0,
                          left: 0,
                          right: 0,
                          p: { xs: 3, sm: 4, md: 5 },
                          background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.7) 40%, rgba(0,0,0,0.2) 80%, transparent 100%)',
                          opacity: 0.95,
                          transition: 'all 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'flex-end',
                          height: '75%',
                          zIndex: 3
                        }}>
                          {/* Movie Title with Animation */}
                          <Typography 
                            variant="h4" 
                            className="movie-title"
                            sx={{
                              fontWeight: 800,
                              fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2.25rem', lg: '2.5rem' },
                              lineHeight: 1.1,
                              mb: { xs: 2, sm: 2.5 },
                              color: 'common.white',
                              textShadow: '0 2px 12px rgba(0,0,0,0.6)',
                              transition: 'transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1), text-shadow 0.4s ease',
                              letterSpacing: '-0.01em'
                            }}
                          >
                            {movie.title}
                          </Typography>
                          
                          {/* Movie Meta Info with Animation */}
                          <Box 
                            className="movie-meta"
                            sx={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              gap: { xs: 2, sm: 3 },
                              flexWrap: 'wrap',
                              transform: { xs: 'translateY(0)', sm: 'translateY(10px)' },
                              opacity: { xs: 1, sm: 0.7 },
                              transition: 'transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.5s ease',
                            }}
                          >
                            {/* Rating Badge */}
                            <Box sx={{
                              display: 'flex',
                              alignItems: 'center',
                              color: '#FFD700',
                              bgcolor: 'rgba(0,0,0,0.6)',
                              px: { xs: 1.5, sm: 2 },
                              py: { xs: 0.75, sm: 1 },
                              borderRadius: 4,
                              backdropFilter: 'blur(10px)',
                              boxShadow: '0 8px 16px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,215,0,0.3)',
                            }}>
                              <Star fontSize="small" sx={{ mr: 1 }} />
                              <Typography variant="body1" sx={{ 
                                fontWeight: 700,
                                fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
                                letterSpacing: '0.05em'
                              }}>
                                {movie.vote_average.toFixed(1)}/10
                              </Typography>
                            </Box>
                            
                            {/* Year Badge */}
                            <Chip
                              label={movie.release_date.split('-')[0]}
                              sx={{
                                bgcolor: 'rgba(20,20,30,0.8)',
                                color: '#fff',
                                fontWeight: 600,
                                backdropFilter: 'blur(10px)',
                                border: '1px solid rgba(255,255,255,0.15)',
                                px: { xs: 0.5, sm: 1 },
                                height: { xs: 28, sm: 32 },
                                fontSize: { xs: '0.85rem', sm: '0.9rem', md: '1rem' },
                                transition: 'all 0.3s ease',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                                '&:hover': {
                                  bgcolor: 'rgba(30,30,45,0.9)',
                                  boxShadow: '0 6px 14px rgba(0,0,0,0.3)',
                                }
                              }}
                            />

                            {/* Overview Preview */}
                            <Typography 
                              variant="body2" 
                              sx={{ 
                                color: 'rgba(255,255,255,0.75)',
                                display: { xs: 'none', md: 'block' },
                                fontSize: { md: '0.9rem', lg: '1rem' },
                                mt: { md: 1.5 },
                                maxWidth: '80%',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                lineHeight: 1.5,
                                textShadow: '0 1px 3px rgba(0,0,0,0.8)'
                              }}
                            >
                              {movie.overview}
                            </Typography>
                          </Box>
                        </Box>

                        {/* overlay effects */}
                        <Box sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          background: 'radial-gradient(circle at center, transparent 30%, rgba(0,0,0,0.4) 140%)',
                          zIndex: 1,
                          pointerEvents: 'none',
                        }} />
                      </Box>
                    </Link>
                  </motion.div>
                </Box>
              ))}
            </Slider>
          </Box>
        )}

        {/* Movie Grid */}
        <Box sx={{ 
          position: 'relative',
          textAlign: 'center',
          mx: 'auto'
        }}>
          <SectionHeading 
            text="The Collection" 
            gradientColors="linear-gradient(45deg, #62c5ff 20%, #6bdcff 50%, #6effde 90%)" 
          />
          
          {/* Loading Spinner */}
          <Grid 
            container 
            spacing={{ xs: 2, sm: 3, md: 4, lg: 6 }}
            sx={{
              justifyContent: 'center', 
              mx: 'auto', 
              width: '100%',
              px: { xs: 1, sm: 2, md: 3 },
            }}
          >
            {movies.map((movie, index) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={movie.id}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.5 }}
                  whileHover={{ y: -12, transition: { duration: 0.3 } }}
                >
                  <MovieCard movie={movie} user={user} />
                </motion.div>
              </Grid>
            ))}
          </Grid>

          {/* Load More Button*/}
          {!loading && movies.length > 0 && page <= totalPages && (
            <Box 
              sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                mt: { xs: 4, sm: 6, md: 10 } 
              }}
            >
              <Button
                variant="contained"
                onClick={() => fetchMovies(debouncedSearch, page)}
                disabled={loading}
                component={motion.button}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}  
                sx={{
                  px: { xs: 4, sm: 6, md: 8 },
                  py: { xs: 1.25, sm: 1.5, md: 2 },
                  fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
                  fontWeight: 700,
                  letterSpacing: '0.02em',
                  background: (theme) => `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${alpha(theme.palette.primary.light, 0.9)} 90%)`,
                  borderRadius: 3,
                  boxShadow: (theme) => `0 8px 28px -4px ${alpha(theme.palette.primary.main, 0.4)}, 0 4px 12px rgba(0, 0, 0, 0.25)`,
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: (theme) => `0 12px 36px ${alpha(theme.palette.primary.main, 0.45)}, 0 8px 16px rgba(0, 0, 0, 0.3)`,
                    background: (theme) => `linear-gradient(45deg, ${theme.palette.primary.main} 20%, ${theme.palette.primary.light} 100%)`,
                  },
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  position: 'relative',
                  overflow: 'hidden',
                  border: '1px solid rgba(255,255,255,0.1)',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: '-100%',
                    width: '200%',
                    height: '100%',
                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                    transition: 'left 0.7s ease',
                    zIndex: 1,
                  },
                  '&:hover::after': {
                    left: '100%'
                  },
                  '&.Mui-disabled': {
                    background: 'rgba(80, 80, 100, 0.3)',
                    color: 'rgba(255, 255, 255, 0.5)',
                  }
                }}
              >
                Explore More
              </Button>
            </Box>
          )}
          
          {/* Empty state message */}
          {!loading && movies.length === 0 && (
            <Box 
              sx={{ 
                textAlign: 'center', 
                py: { xs: 6, sm: 8 },
                px: { xs: 2, sm: 2 },
                borderRadius: 4,
                background: 'rgba(20, 23, 36, 0.4)',
                backdropFilter: 'blur(10px)',
                maxWidth: 'md',
                mx: 'auto',
                border: '1px solid rgba(255,255,255,0.05)',
              }}
            >
              <Typography 
                variant="h5" 
                sx={{ 
                  mb: 2,
                  fontWeight: 600,
                  color: 'rgba(255,255,255,0.8)',
                  fontSize: { xs: '1.25rem', sm: '1.5rem' }
                }}
              >
                No movies found matching your criteria
              </Typography>
              <Typography 
                variant="body1" 
                sx={{ 
                  color: 'rgba(255,255,255,0.6)',
                  maxWidth: 500,
                  mx: 'auto',
                  fontSize: { xs: '0.9rem', sm: '1rem' }
                }}
              >
                Try adjusting your search terms or filters to discover more films
              </Typography>
            </Box>
          )}
          
          {/* Loading state */}
          {loading && (
            <Box 
              sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center',
                flexDirection: 'column',
                py: { xs: 6, sm: 8 } 
              }}
            >
              <CircularProgress 
                size={48} 
                thickness={4}
                sx={{ 
                  color: 'primary.main',
                  mb: 3
                }} 
              />
              <Typography 
                variant="body1" 
                sx={{ 
                  color: 'rgba(255,255,255,0.7)',
                  fontWeight: 500
                }}
              >
                Discovering cinematic treasures...
              </Typography>
            </Box>
          )}
        </Box>
      </Container>
    </Box>
  );
}
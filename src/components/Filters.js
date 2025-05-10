import { useState, useEffect } from 'react';
import {  Box,FormControl,InputLabel, Select, 
  MenuItem, Typography,Chip,Fade,Paper,IconButton,Collapse,Button,useTheme
} from '@mui/material';
import { 
  FilterAlt, 
  MovieFilter, 
  CalendarToday, 
  Star,
  ExpandMore,
  ExpandLess
} from '@mui/icons-material';
import { useMovies } from '../contexts';
import axios from 'axios';
import { motion } from 'framer-motion';

export const Filters = () => {
  const { filters, setFilters, fetchMovies } = useMovies(); 
  const [genres, setGenres] = useState([]);
  const theme = useTheme();
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);
  const [expanded, setExpanded] = useState(false);
  
  // Get the current year for year filter
  const currentYear = new Date().getFullYear();
  
  // API constants
  const API_KEY = process.env.REACT_APP_TMDB_API_KEY;
  const BASE_URL = process.env.REACT_APP_TMDB_BASE_URL;
  
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/genre/movie/list?api_key=${API_KEY}`
        );
        setGenres(response.data.genres);
      } catch (error) {
        console.error('Error fetching genres:', error);
      }
    };
    fetchGenres();
  }, []);
  
  useEffect(() => {
    // Count active filters (x empty values)
    const count = Object.values(filters).filter(value => value !== "").length;
    setActiveFiltersCount(count);
  }, [filters]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => {
      const updatedFilters = { ...prev, [name]: value };
      fetchMovies("", 1, updatedFilters); // Automatically fetch movies with updated filters
      return updatedFilters;
    });
  };

  // Clear all active filters and fetch movies without any filters applied
  const clearFilters = () => {
    const clearedFilters = {
      genre: "",
      year: "",
      rating: ""
    };
    setFilters(clearedFilters); // Reset the filters state
    fetchMovies("", 1, clearedFilters); // Fetch movies with cleared filters
  };
  
  // Toggle expanded state for the filter section
  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  // Animations for filter items
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  // Variants for individual filter item animations
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <Paper
      elevation={3}
      sx={{
        borderRadius: 3,
        overflow: 'hidden',
        background: theme.palette.mode === 'dark' 
          ? 'linear-gradient(to right, rgba(15, 32, 39, 0.95), rgba(32, 58, 67, 0.95))'
          : 'linear-gradient(to right, rgba(224, 234, 252, 0.95), rgba(207, 222, 243, 0.95))',
        backdropFilter: 'blur(10px)',
        mb: 4,
        transition: 'all 0.3s ease',
        '&:hover': {
          boxShadow: theme.palette.mode === 'dark' 
            ? '0 8px 16px rgba(0,0,0,0.4)' 
            : '0 8px 16px rgba(0,0,0,0.1)',
        }
      }}
    >
      {/* Filter header/button */}
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          p: 2,
          cursor: 'pointer',
          backgroundColor: theme.palette.mode === 'dark' 
            ? 'rgba(0,0,0,0.2)' 
            : 'rgba(255,255,255,0.3)',
        }}
        onClick={toggleExpanded}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <FilterAlt 
            sx={{ 
              mr: 1, 
              color: theme.palette.primary.main,
              fontSize: 24
            }} 
          />
          <Typography variant="h6" fontWeight="600">
            Filter Movies
          </Typography>
          
          {activeFiltersCount > 0 && (
            <Fade in={activeFiltersCount > 0}>
              <Chip
                label={`${activeFiltersCount} active`}
                color="primary"
                size="small"
                sx={{ 
                  ml: 2,
                  fontWeight: 500,
                }}
              />
            </Fade>
          )}
        </Box>
        
        {/* Expand/Collapse button */}
        <IconButton
          sx={{ 
            color: theme.palette.primary.main,
            transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.3s'
          }}
          onClick={(e) => {
            e.stopPropagation();
            toggleExpanded();
          }}
        >
          {expanded ? <ExpandLess /> : <ExpandMore />}
        </IconButton>
      </Box>
      
      {/* Collapsible filter content */}
      <Collapse in={expanded} timeout="auto">
        <Box sx={{ p: 3 }}>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={expanded ? "visible" : "hidden"}
          >
            <Box 
              sx={{ 
                display: 'flex', 
                gap: 2, 
                flexWrap: 'wrap',
                alignItems: 'center',
                mb: 3
              }}
            >
              {/* Genre Filter */}
              <motion.div variants={itemVariants} style={{ flex: '1 1 auto', minWidth: '200px' }}>
                <FormControl 
                  fullWidth
                  sx={{ 
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      transition: 'all 0.2s',
                      '&:hover': {
                        boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                      }
                    }
                  }} 
                  size="small"
                >
                  <InputLabel>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <MovieFilter sx={{ mr: 0.5, fontSize: 18 }} />
                      Genre
                    </Box>
                  </InputLabel>
                  <Select 
                    name="genre" 
                    value={filters.genre} 
                    label="Genre" 
                    onChange={handleChange}
                    MenuProps={{
                      PaperProps: {
                        sx: {
                          maxHeight: 300,
                          borderRadius: 2,
                        }
                      }
                    }}
                  >
                    <MenuItem value="">All Genres</MenuItem>
                    {genres.map(genre => (
                      <MenuItem key={genre.id} value={genre.id}>{genre.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </motion.div>
              
              {/* Year Filter */}
              <motion.div variants={itemVariants} style={{ flex: '1 1 auto', minWidth: '180px' }}>
                <FormControl 
                  fullWidth
                  sx={{ 
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      transition: 'all 0.2s',
                      '&:hover': {
                        boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                      }
                    }
                  }} 
                  size="small"
                >
                  <InputLabel>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <CalendarToday sx={{ mr: 0.5, fontSize: 18 }} />
                      Year
                    </Box>
                  </InputLabel>
                  <Select 
                    name="year" 
                    value={filters.year} 
                    label="Year" 
                    onChange={handleChange}
                    MenuProps={{
                      PaperProps: {
                        sx: {
                          maxHeight: 300,
                          borderRadius: 2,
                        }
                      }
                    }}
                  >
                    <MenuItem value="">All Years</MenuItem>
                    {Array.from({ length: 30 }, (_, i) => currentYear - i).map(year => (
                      <MenuItem key={year} value={year}>{year}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </motion.div>
              
              {/* Rating Filter */}
              <motion.div variants={itemVariants} style={{ flex: '1 1 auto', minWidth: '180px' }}>
                <FormControl 
                  fullWidth
                  sx={{ 
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      transition: 'all 0.2s',
                      '&:hover': {
                        boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                      }
                    }
                  }} 
                  size="small"
                >
                  <InputLabel>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Star sx={{ mr: 0.5, fontSize: 18 }} />
                      Rating
                    </Box>
                  </InputLabel>
                  <Select 
                    name="rating" 
                    value={filters.rating} 
                    label="Rating" 
                    onChange={handleChange}
                    MenuProps={{
                      PaperProps: {
                        sx: {
                          borderRadius: 2,
                        }
                      }
                    }}
                  >
                    <MenuItem value="">All Ratings</MenuItem>
                    {[6, 7, 8, 9].map(rating => (
                      <MenuItem key={rating} value={rating}>{rating}+ Stars</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </motion.div>
            </Box>
            
            {/* Action Buttons */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              {activeFiltersCount > 0 && (
                <Button 
                  variant="outlined" 
                  color="error"
                  size="small"
                  onClick={clearFilters}
                  startIcon={<FilterAlt />}
                  sx={{ 
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 500
                  }}
                >
                  Clear Filters
                </Button>
              )}
            </Box>
          </motion.div>
        </Box>
      </Collapse>
    </Paper>
  );
};
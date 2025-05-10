import { useState } from 'react';
import { 
  Box, 
  Chip, 
  Typography, 
  IconButton, 
  Tooltip, 
  Fade, 
  Button,
  useTheme,
  Collapse,
  Paper
} from '@mui/material';
import { 
  History, 
  DeleteSweep, 
  ExpandMore, 
  ExpandLess,
  Search
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useMovies } from '../contexts';

// This component displays the search history of movies.
// It allows users to click on a search term to fetch movies related to that term.
export const SearchHistory = () => {
  const { searchHistory, fetchMovies, setSearchHistory } = useMovies();
  const [expanded, setExpanded] = useState(true);
  const theme = useTheme();
  
  // Clear search history
  const handleClearHistory = () => {
    setSearchHistory([]);
  };
  
  // Toggle expanded state
  const toggleExpanded = () => {
    setExpanded(!expanded);
  };
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  };
  
  // Animation for each item
  const itemVariants = {
    hidden: { y: 10, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { 
        type: "spring", 
        stiffness: 300,
        damping: 24
      } 
    },
    exit: { 
      scale: 0, 
      opacity: 0,
      transition: { duration: 0.2 } 
    }
  };

  // Render the component
  return (
    <Paper
      elevation={3}
      sx={{
        mt: 3,
        borderRadius: 3,
        overflow: 'hidden',
        background: theme.palette.mode === 'dark' 
          ? 'linear-gradient(to right, rgba(20, 30, 48, 0.95), rgba(36, 59, 85, 0.95))'
          : 'linear-gradient(to right, rgba(224, 234, 252, 0.9), rgba(207, 222, 243, 0.9))',
        backdropFilter: 'blur(10px)',
        mb: 3,
        transition: 'all 0.3s ease',
        '&:hover': {
          boxShadow: theme.palette.mode === 'dark' 
            ? '0 8px 16px rgba(0,0,0,0.4)' 
            : '0 8px 16px rgba(0,0,0,0.1)',
        }
      }}
    >
      {/* Header with toggle */}
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
          <History 
            sx={{ 
              mr: 1, 
              color: theme.palette.secondary.main,
              fontSize: 24
            }} 
          />
          <Typography variant="h6" fontWeight="600" color={theme.palette.mode === 'dark' ? 'white' : 'text.primary'}>
            Search History
          </Typography>
          
          {searchHistory.length > 0 && (
            <Fade in={searchHistory.length > 0}>
              <Chip
                label={`${searchHistory.length} ${searchHistory.length === 1 ? 'item' : 'items'}`}
                color="secondary"
                size="small"
                sx={{ 
                  ml: 2,
                  fontWeight: 500,
                }}
              />
            </Fade>
          )}
        </Box>
        
        {/* Clear history and expand/collapse button */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {searchHistory.length > 0 && (
            <Tooltip title="Clear History">
              <IconButton
                color="error"
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  handleClearHistory();
                }}
                sx={{ 
                  mr: 1,
                  '&:hover': { 
                    backgroundColor: 'rgba(244, 67, 54, 0.08)'
                  }
                }}
              >
                <DeleteSweep />
              </IconButton>
            </Tooltip>
          )}
          
          <IconButton
            sx={{ 
              color: theme.palette.secondary.main,
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
      </Box>
      
      {/* Collapsible content */}
      <Collapse in={expanded} timeout="auto">
        <Box 
          sx={{
            p: 3,
            minHeight: 80,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: searchHistory.length === 0 ? 'center' : 'flex-start',
            alignItems: searchHistory.length === 0 ? 'center' : 'flex-start'
          }}
        >
          {/* Display search history */}
          {searchHistory.length > 0 ? ( 
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              style={{ 
                display: 'flex',
                gap: '12px',
                flexWrap: 'wrap',
                width: '100%'
              }}
            >
              <AnimatePresence>
                {searchHistory.map((term, index) => (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    exit="exit"
                    layout
                  >
                    <Chip
                      icon={<Search fontSize="small" />}
                      label={term}
                      onClick={() => fetchMovies(term)}
                      sx={{
                        bgcolor: theme.palette.mode === 'dark' 
                          ? 'rgba(66, 99, 235, 0.8)' 
                          : 'rgba(66, 99, 235, 0.2)',
                        color: theme.palette.mode === 'dark' ? 'white' : 'primary.dark',
                        fontWeight: 500,
                        px: 0.5,
                        fontSize: '0.9rem',
                        borderRadius: 6,
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          bgcolor: theme.palette.mode === 'dark'
                            ? 'rgba(66, 99, 235, 0.9)'
                            : 'rgba(66, 99, 235, 0.3)',
                          boxShadow: '0 3px 8px rgba(0,0,0,0.15)'
                        },
                      }}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            <Box sx={{ textAlign: 'center', py: 2 }}>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Typography 
                  variant="body1" 
                  color={theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.7)' : 'text.secondary'}
                  sx={{ mb: 2 }}
                >
                  Your search history will appear here
                </Typography>
                
                <Button
                  variant="outlined"
                  color="secondary"
                  startIcon={<Search />}
                  sx={{ 
                    borderRadius: 8,
                    textTransform: 'none',
                    fontWeight: 500,
                    px: 3
                  }}
                  onClick={() => {
                    // This could navigate to search 
                    document.querySelector('input[type="search"]')?.focus();
                  }}
                >
                  Start searching
                </Button>
              </motion.div>
            </Box>
          )}
        </Box>
      </Collapse>
    </Paper>
  );
};
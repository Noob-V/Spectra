import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  AppBar, 
  Toolbar, 
  IconButton, 
  Button, 
  Box, 
  Typography, 
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { 
  Favorite, 
  Brightness4, 
  Brightness7, 
  Movie, 
  Menu as MenuIcon, 
  Close,
  Home,
  Login,
  Logout
} from '@mui/icons-material';
import { useAuth, useTheme } from '../contexts';
import { motion } from 'framer-motion';

// This component represents the navigation bar of the application.
// It includes links to different sections of the app, a theme toggle button, and user authentication options.
export const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const [drawerOpen, setDrawerOpen] = useState(false);
  
  // Function to toggle the mobile drawer
  const toggleDrawer = () => setDrawerOpen(!drawerOpen);

  // Navigation items for the drawer
  const navItems = [
    { text: 'Home', icon: <Home />, path: '/', onClick: null },
    { text: 'Favorites', icon: <Favorite />, path: '/favorites', onClick: null },
    ...(user ? [
      { text: 'Logout', icon: <Logout />, path: null, onClick: () => { logout(); toggleDrawer(); } }
    ] : [
      { text: 'Login', icon: <Login />, path: '/login', onClick: toggleDrawer }
    ])
  ];

  // Function to render the mobile drawer
  const renderMobileDrawer = () => (
    <Drawer
      anchor="right"
      open={drawerOpen}
      onClose={toggleDrawer}
      PaperProps={{
        sx: {
          width: '80vw',
          maxWidth: 300,
          background: theme.palette.mode === 'dark' 
            ? 'linear-gradient(195deg, #0f0f15 30%, #1a1a24 90%)'
            : 'linear-gradient(195deg, #ffffff 30%, #f8f9ff 90%)',
          backdropFilter: 'blur(12px)',
          boxShadow: 24,
        }
      }} 
    >
      <Box sx={{ p: 2, borderBottom: `1px solid ${theme.palette.divider}` }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ 
            fontWeight: 700,
            background: theme.palette.mode === 'dark'
              ? 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)'
              : 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Spectra
          </Typography>
          <IconButton onClick={toggleDrawer} sx={{ color: 'inherit' }}>
            <Close />
          </IconButton>
        </Box>
        {user && (
          <Typography variant="body2" sx={{ 
            mt: 1,
            color: theme.palette.text.secondary,
            fontWeight: 500
          }}>
            Welcome, {user}
          </Typography>
        )}
      </Box>

      {/* Navigation Items */}
      <List sx={{ p: 2 }}>
        {navItems.map((item) => (
          <ListItem 
            key={item.text} 
            component={item.path ? Link : 'div'}
            to={item.path}
            onClick={item.onClick}
            sx={{
              borderRadius: 2,
              mb: 1,
              transition: 'all 0.2s ease',
              '&:hover': {
                backgroundColor: theme.palette.action.hover,
                transform: 'translateX(4px)'
              }
            }}
          >
            <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText 
              primary={item.text} 
              primaryTypographyProps={{ fontWeight: 500 }}
            />
          </ListItem>
        ))}
        {/* Theme Toggle Button */}
        <ListItem 
          button 
          onClick={toggleTheme}
          sx={{
            borderRadius: 2,
            transition: 'all 0.2s ease',
            '&:hover': {
              backgroundColor: theme.palette.action.hover,
              transform: 'translateX(4px)'
            }
          }}
        >
          <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}>
            {theme.palette.mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
          </ListItemIcon>
          <ListItemText 
            primary={theme.palette.mode === 'dark' ? 'Light Mode' : 'Dark Mode'} 
            primaryTypographyProps={{ fontWeight: 500 }}
          />
        </ListItem>
      </List>
    </Drawer>
  );
  // Main Navbar component
  return (
    <AppBar 
      position="sticky" 
      elevation={0}
      sx={{
        background: theme.palette.mode === 'dark'
          ? 'linear-gradient(195deg, #0f0f15 30%, #1a1a24 90%)'
          : 'linear-gradient(195deg, #ffffff 30%, #f8f9ff 90%)',
        backdropFilter: 'blur(12px)',
        borderBottom: `1px solid ${theme.palette.divider}`,
        boxShadow: '0 8px 32px rgba(0,0,0,0.05)'
      }}
    >
      <Toolbar 
        sx={{ 
          px: { xs: 2, sm: 4, lg: 6 },
          py: 1,
          minHeight: { xs: 56, sm: 64 },
          justifyContent: 'space-between'
        }}
      >
        {/* Left Section */}
        <Box component={Link} to="/" sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          textDecoration: 'none',
          gap: 1.5
        }}>
          <motion.div whileHover={{ rotate: -15, scale: 1.1 }}>
            <IconButton sx={{ 
              p: 1,
              color: theme.palette.mode === 'dark' ? '#ff7b7b' : '#e91e63',
              background: theme.palette.mode === 'dark'
                ? 'rgba(255,123,123,0.1)'
                : 'rgba(233,30,99,0.1)',
              borderRadius: 2
            }}>
              <Movie fontSize={isMobile ? "medium" : "large"} />
            </IconButton>
          </motion.div>
          
          <Typography
            variant="h6"
            sx={{
              fontWeight: 800,
              background: theme.palette.mode === 'dark'
                ? 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)'
                : 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '0.5px',
              fontFamily: '"Space Grotesk", sans-serif',
              display: { xs: 'none', sm: 'block' }
            }}
          >
            Spectra
          </Typography>
        </Box>

        {/* Desktop Navigation */}
        {!isMobile && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <IconButton 
                  onClick={toggleTheme}
                  sx={{ 
                    color: theme.palette.mode === 'dark' ? '#ffd54f' : '#ff9800',
                    borderRadius: 2,
                    p: 1.5,
                    background: theme.palette.mode === 'dark'
                      ? 'rgba(255,213,79,0.1)'
                      : 'rgba(255,152,0,0.1)'
                  }}
                >
                  {theme.palette.mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
                </IconButton>
              </motion.div>
              
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <IconButton 
                  component={Link} 
                  to="/favorites"
                  sx={{ 
                    color: theme.palette.mode === 'dark' ? '#ff7b7b' : '#e91e63',
                    borderRadius: 2,
                    p: 1.5,
                    background: theme.palette.mode === 'dark'
                      ? 'rgba(255,123,123,0.1)'
                      : 'rgba(233,30,99,0.1)'
                  }}
                >
                  <Favorite />
                </IconButton>
              </motion.div>
            </Box>

            {/* User Authentication */}      
            {user ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                {!isTablet && (
                  <Typography 
                    variant="body2"
                    sx={{
                      fontWeight: 500,
                      color: theme.palette.text.secondary,
                      whiteSpace: 'nowrap'
                    }}
                  >
                    Welcome, {user}
                  </Typography>
                )}
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    onClick={logout}
                    variant="contained"
                    size="small"
                    sx={{
                      background: theme.palette.mode === 'dark'
                        ? 'linear-gradient(45deg, #ff6b6b 30%, #ff8e53 90%)'
                        : 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                      color: '#fff',
                      borderRadius: 2,
                      px: 3,
                      py: 1,
                      fontWeight: 600,
                      boxShadow: 'none',
                      '&:hover': {
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                      }
                    }}
                  >
                    Logout
                  </Button>
                </motion.div>
              </Box>
            ) : (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  component={Link}
                  to="/login"
                  variant="contained"
                  size="small"
                  sx={{
                    background: theme.palette.mode === 'dark'
                      ? 'linear-gradient(45deg, #8E2DE2 30%, #4A00E0 90%)'
                      : 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                    color: '#fff',
                    borderRadius: 2,
                    px: 3,
                    py: 1,
                    fontWeight: 600,
                    boxShadow: 'none',
                    '&:hover': {
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                    }
                  }}
                >
                  Login
                </Button>
              </motion.div>
            )}
          </Box>
        )}

        {/* Mobile Menu Button */}
        {isMobile && (
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <IconButton 
              onClick={toggleDrawer}
              sx={{ 
                color: 'inherit',
                borderRadius: 2,
                background: theme.palette.action.hover
              }}
            >
              <MenuIcon />
            </IconButton>
          </motion.div>
        )}
      </Toolbar>
      
      {renderMobileDrawer()}
    </AppBar>
  );
};
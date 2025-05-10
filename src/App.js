import { Routes, Route } from 'react-router-dom';
import { useTheme } from './contexts';
import { Home, MovieDetails, Favorites, Login } from './pages';
import { Navbar, ErrorSnackbar } from './components';
import { AnimatePresence } from 'framer-motion';
import { CssBaseline, Box } from '@mui/material';

function App() {
  const { theme } = useTheme();

  return (
    <Box sx={{ backgroundColor: 'background.default', minHeight: '100vh' }}>
      <CssBaseline />
      <Navbar />
      <ErrorSnackbar />
      <AnimatePresence mode='wait'>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/movie/:id" element={<MovieDetails />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </AnimatePresence>
    </Box>
  );
}

export default App;
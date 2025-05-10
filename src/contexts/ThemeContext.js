import { createContext, useContext, useMemo, useState } from 'react';
import { createTheme } from '@mui/material/styles';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [mode, setMode] = useState(localStorage.getItem('themeMode') || 'dark');
  
  const toggleTheme = () => {
    setMode(prev => {
      const newMode = prev === 'light' ? 'dark' : 'light';
      localStorage.setItem('themeMode', newMode);
      return newMode;
    });
  };

  const theme = useMemo(() => createTheme({
    palette: {
      mode,
      primary: { main: mode === 'dark' ? '#90caf9' : '#1976d2' },
      secondary: { main: '#ff4081' },
      background: { default: mode === 'dark' ? '#121212' : '#f5f5f5' }
    },
    transitions: { duration: { enteringScreen: 300, leavingScreen: 300 } }
  }), [mode]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, mode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);

// This code defines a ThemeContext that provides a theme and a toggle function to switch between light and dark modes.
// The theme is created using Material-UI's createTheme function, and the mode is stored in localStorage for persistence.

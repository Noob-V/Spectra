import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Container, 
  TextField, 
  Button, 
  Typography, 
  Box, 
  Paper, 
  IconButton,
  InputAdornment,
  Divider,
  useTheme,
  alpha
} from '@mui/material';
import { 
  LockOutlined, 
  PersonOutline, 
  Visibility, 
  VisibilityOff, 
  Movie,
  ErrorOutline
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts';

// This component handles user login.
// It includes a form for username and password, and handles authentication.
export const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();

  // Handle form submission
  // It checks if the username and password are provided, and if they are valid.
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Please fill in all fields');
      return;
    }
    if (login(username, password)) {
      navigate('/');
    } else {
      setError('Invalid credentials');
    }
  };

  // Handle password visibility toggle
  // It toggles the state of showPassword to show or hide the password.
  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.2
      }
    }
  };

  // Animation for each item
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  // Background gradient based on theme
  const bgGradient = theme.palette.mode === 'dark'
    ? 'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)'
    : 'linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%)';

  // Logo gradient based on theme  
  const logoGradient = theme.palette.mode === 'dark'
    ? 'linear-gradient(to right, #FF8E53, #FE6B8B)'
    : 'linear-gradient(to right, #2196F3, #21CBF3)';

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: bgGradient,
        py: 8
      }}
    >
      <Container maxWidth="sm">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <Paper
            elevation={6}
            sx={{
              p: 5,
              borderRadius: 3,
              background: alpha(theme.palette.background.paper, 0.8),
              backdropFilter: 'blur(10px)',
              boxShadow: theme.palette.mode === 'dark'
                ? '0 8px 32px rgba(0, 0, 0, 0.3)'
                : '0 8px 32px rgba(31, 38, 135, 0.15)'
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                mb: 4
              }}
            >
              <motion.div variants={itemVariants}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 2
                  }}
                >
                  <Box
                    sx={{
                      background: logoGradient,
                      width: 56,
                      height: 56,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
                    }}
                  >
                    <Movie sx={{ fontSize: 30, color: 'white' }} />
                  </Box>
                </Box>

                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 700,
                    textAlign: 'center',
                    background: logoGradient,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}
                >
                  Welcome Back
                </Typography>

                <Typography
                  color="text.secondary"
                  sx={{ textAlign: 'center', mt: 1, mb: 3 }}
                >
                  Sign in to access your movie collection
                </Typography>
              </motion.div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      p: 2,
                      mb: 3,
                      borderRadius: 2,
                      backgroundColor: alpha(theme.palette.error.main, 0.1),
                    }}
                  >
                    <ErrorOutline color="error" fontSize="small" />  
                    <Typography color="error" variant="body2">
                      {error}
                    </Typography>
                  </Box>
                </motion.div>
              )}
              {/* Username Field */}
              <motion.div variants={itemVariants} style={{ width: '100%' }}>
                <Box
                  component="form"
                  onSubmit={handleSubmit}
                  sx={{ width: '100%' }}
                >
                  <TextField
                    fullWidth
                    margin="normal"
                    label="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonOutline color="action" />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      mb: 3,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        '&:hover fieldset': {
                          borderColor: theme.palette.primary.main,
                        },
                      },
                    }}
                  />
                    {/* Password Field */}
                  <TextField
                    fullWidth
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockOutlined color="action" />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={handleTogglePasswordVisibility}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      mb: 1,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        '&:hover fieldset': {
                          borderColor: theme.palette.primary.main,
                        },
                      },
                    }}
                  />

                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'flex-end',
                      mb: 3,
                    }}
                  >
                    <Button
                      component={Link}
                      to="/forgot-password"
                      color="primary"
                      sx={{
                        textTransform: 'none',
                        fontWeight: 500,
                        fontSize: '0.875rem',
                      }}
                    >
                      Forgot password?
                    </Button>
                  </Box>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      fullWidth
                      variant="contained"
                      type="submit"
                      size="large"
                      sx={{
                        py: 1.5,
                        borderRadius: 2,
                        fontWeight: 600,
                        textTransform: 'none',
                        fontSize: '1rem',
                        boxShadow: theme.palette.mode === 'dark'
                          ? '0 4px 12px rgba(0, 0, 0, 0.4)'
                          : '0 4px 12px rgba(33, 150, 243, 0.2)',
                        background: logoGradient,
                        '&:hover': {
                          background: theme.palette.mode === 'dark'
                            ? 'linear-gradient(to right, #FF9D6C, #FF88A5)'
                            : 'linear-gradient(to right, #42A5F5, #64D8F5)'
                        }
                      }}
                    >
                      Sign In
                    </Button>
                  </motion.div>
                </Box>
              </motion.div>

              <motion.div variants={itemVariants} style={{ width: '100%' }}>
                <Box sx={{ mt: 4, textAlign: 'center' }}>
                  <Divider sx={{ mb: 2 }}>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ px: 1 }}
                    >
                      Don't have an account?
                    </Typography> 
                  </Divider>
                  <Button
                    component={Link}
                    to="/register"
                    fullWidth
                    variant="outlined"
                    sx={{
                      borderRadius: 2,
                      py: 1.5,
                      textTransform: 'none',
                      fontWeight: 600,
                      borderWidth: '1.5px',
                    }}
                  >
                    Create Account
                  </Button>
                </Box>
              </motion.div>
            </Box>
          </Paper>
        {/* Footer Section */}
          <Typography
            variant="body2"
            color={theme.palette.mode === 'dark' ? 'grey.400' : 'grey.700'}
            sx={{ textAlign: 'center', mt: 4 }}
          >
            © {new Date().getFullYear()} Spectra By V. All rights reserved.
          </Typography>
        </motion.div>
      </Container>
    </Box>
  );
};
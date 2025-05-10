import { Snackbar, Alert } from '@mui/material';
import { useMovies } from '../contexts';

export const ErrorSnackbar = () => {
  const { error, setError } = useMovies();

  const handleClose = () => setError(null);

  return (
    <Snackbar
      open={!!error}
      autoHideDuration={6000}  // The Snackbar automatically hides after 6 seconds, you can also manually close it
      onClose={handleClose} // here is the code for manually closing
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <Alert onClose={handleClose} severity="error">
        {error}
      </Alert>
    </Snackbar>
  );
};

// This component displays a temporary error notification using a Material-UI Snackbar.
// It listens to the 'error' state from the useMovies context and shows the error message.

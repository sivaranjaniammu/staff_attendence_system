import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{
      height: '80vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      p: 3
    }}>
      <Typography variant="h1" color="primary" sx={{ fontWeight: 900, fontSize: '6rem' }}>
        404
      </Typography>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
        Page Not Found
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 4, maxWidth: '450px' }}>
        The page you are looking for does not exist, or has been relocated to another directory.
      </Typography>
      <Button variant="contained" onClick={() => navigate('/')} sx={{ borderRadius: '8px' }}>
        Return Dashboard
      </Button>
    </Box>
  );
};

export default NotFound;

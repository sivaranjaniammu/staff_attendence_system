import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Forbidden = () => {
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
      <Typography variant="h1" color="error" sx={{ fontWeight: 900, fontSize: '6rem' }}>
        403
      </Typography>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
        Access Denied
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 4, maxWidth: '450px' }}>
        You do not have the required permissions to view this secure panel.
      </Typography>
      <Button variant="contained" onClick={() => navigate('/')} sx={{ borderRadius: '8px' }}>
        Return Dashboard
      </Button>
    </Box>
  );
};

export default Forbidden;

import React from 'react';
import { Box, Typography } from '@mui/material';

const ProfileDetails = () => {
  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
        Personal Profile
      </Typography>
      <Typography variant="body1" color="text.secondary">
        [Developer 2 Module: Manage personal profile information, details, contact cards]
      </Typography>
    </Box>
  );
};

export default ProfileDetails;

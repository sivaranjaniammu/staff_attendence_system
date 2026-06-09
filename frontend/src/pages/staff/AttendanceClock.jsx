import React from 'react';
import { Box, Typography } from '@mui/material';

const AttendanceClock = () => {
  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
        Attendance Clock-In
      </Typography>
      <Typography variant="body1" color="text.secondary">
        [Developer 2 Module: Punch in/out stamps, coordinates, QR authentication, facial scans]
      </Typography>
    </Box>
  );
};

export default AttendanceClock;

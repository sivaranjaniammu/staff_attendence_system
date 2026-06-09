import React from 'react';
import { Box, Typography } from '@mui/material';

const StaffList = () => {
  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
        Staff Directory
      </Typography>
      <Typography variant="body1" color="text.secondary">
        [Developer 1 Module: CRUD Staff Profiles, assigns departments, roles, shift schedules]
      </Typography>
    </Box>
  );
};

export default StaffList;

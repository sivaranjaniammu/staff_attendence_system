import React from 'react';
import { Box, Typography } from '@mui/material';

const LeavesList = () => {
  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
        All Leave Requests
      </Typography>
      <Typography variant="body1" color="text.secondary">
        [Developer 2 Module: Review staff leave applications, approve, reject, log comments]
      </Typography>
    </Box>
  );
};

export default LeavesList;

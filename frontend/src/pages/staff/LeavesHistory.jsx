import React from 'react';
import { Box, Typography } from '@mui/material';

const LeavesHistory = () => {
  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
        Leave Applications
      </Typography>
      <Typography variant="body1" color="text.secondary">
        [Developer 2 Module: Staff apply for leaves, track approval logs, view balances]
      </Typography>
    </Box>
  );
};

export default LeavesHistory;

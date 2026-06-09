import React from 'react';
import { Box, Typography, Grid, Card, CardContent, Button } from '@mui/material';
import { Schedule as ClockIcon } from '@mui/icons-material';

const StaffDashboard = () => {
  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Staff Dashboard
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Keep track of your schedule, clock stamps, and leave requests.
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<ClockIcon />} sx={{ py: 1, px: 2 }}>
          Clock In / Out
        </Button>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Today's Clock Record
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 600, mt: 1 }}>
                Checked In: 09:02 AM
              </Typography>
              <Typography variant="body2" color="success.main" sx={{ mt: 0.5, fontWeight: 500 }}>
                Status: On Time
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Monthly Attendance Rate
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 700, mt: 1 }}>
                96.4%
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Target attendance: 95%
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Remaining Leaves
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 700, mt: 1 }}>
                12 Days
              </Typography>
              <Typography variant="caption" color="text.secondary">
                8 Casual, 4 Earned
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default StaffDashboard;

import React from 'react';
import { Box, Typography, Grid, Card, CardContent } from '@mui/material';

const AdminDashboard = () => {
  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Admin Dashboard
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Welcome to the Staff Attendance Management Control Panel.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Total Staff
              </Typography>
              <Typography variant="h5" component="div" sx={{ fontWeight: 700 }}>
                150
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Present Today
              </Typography>
              <Typography variant="h5" component="div" sx={{ fontWeight: 700, color: 'success.main' }}>
                142
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Absent Today
              </Typography>
              <Typography variant="h5" component="div" sx={{ fontWeight: 700, color: 'error.main' }}>
                5
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Pending Leaves
              </Typography>
              <Typography variant="h5" component="div" sx={{ fontWeight: 700, color: 'warning.main' }}>
                3
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminDashboard;

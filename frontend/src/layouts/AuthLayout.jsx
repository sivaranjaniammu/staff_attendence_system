import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box, Container, Card, Typography } from '@mui/material';

const AuthLayout = () => {
  return (
    <Box sx={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      p: 2
    }}>
      <Container maxWidth="xs">
        <Card sx={{
          p: 4,
          borderRadius: 4,
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
          backdropFilter: 'blur(4px)',
          border: '1px solid rgba(255, 255, 255, 0.18)',
          backgroundColor: (theme) => theme.palette.mode === 'light' 
            ? 'rgba(255, 255, 255, 0.9)' 
            : 'rgba(30, 41, 59, 0.9)'
        }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
            <Typography variant="h4" color="primary" sx={{ fontWeight: 800, letterSpacing: '-0.5px' }}>
              AttendEase
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, fontWeight: 500 }}>
              Staff Attendance Portal
            </Typography>
          </Box>
          <Outlet />
        </Card>
      </Container>
    </Box>
  );
};

export default AuthLayout;

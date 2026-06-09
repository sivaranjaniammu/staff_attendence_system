import React, { useContext } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  Box, AppBar, Toolbar, Typography, Button, IconButton, 
  Container, useTheme
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Schedule as ClockIcon,
  EventAvailable as LeavesIcon,
  AccountCircle as ProfileIcon,
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
  ExitToApp as LogoutIcon
} from '@mui/icons-material';
import { useAuth } from '../hooks/useAuth';
import { ThemeModeContext } from '../context/ThemeContext';

const StaffLayout = () => {
  const { user, logout } = useAuth();
  const { toggleTheme, mode } = useContext(ThemeModeContext);
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();

  const navItems = [
    { label: 'Dashboard', path: '/staff/dashboard', icon: <DashboardIcon sx={{ mr: 0.5 }} /> },
    { label: 'Attendance', path: '/staff/attendance', icon: <ClockIcon sx={{ mr: 0.5 }} /> },
    { label: 'Leaves', path: '/staff/leaves', icon: <LeavesIcon sx={{ mr: 0.5 }} /> },
    { label: 'Profile', path: '/staff/profile', icon: <ProfileIcon sx={{ mr: 0.5 }} /> }
  ];

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: 'background.default' }}>
      <AppBar position="sticky">
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
            <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: '0.5px', color: 'primary.main', cursor: 'pointer' }} onClick={() => navigate('/staff/dashboard')}>
              Attendance System
            </Typography>

            <Box sx={{ display: { xs: 'none', sm: 'flex' }, gap: 1 }}>
              {navItems.map((item) => {
                const active = location.pathname === item.path;
                return (
                  <Button
                    key={item.label}
                    onClick={() => navigate(item.path)}
                    startIcon={item.icon}
                    sx={{
                      borderRadius: '8px',
                      color: active ? 'primary.main' : 'text.primary',
                      backgroundColor: active ? 'rgba(99, 102, 241, 0.08)' : 'transparent',
                      '&:hover': {
                        backgroundColor: 'rgba(99, 102, 241, 0.04)'
                      }
                    }}
                  >
                    {item.label}
                  </Button>
                );
              })}
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <IconButton color="inherit" onClick={toggleTheme}>
                {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
              </IconButton>
              
              <Typography variant="subtitle2" sx={{ display: { xs: 'none', md: 'block' }, fontWeight: 600, color: 'text.secondary' }}>
                {user?.name}
              </Typography>
              
              <Button 
                variant="outlined" 
                color="error" 
                size="small" 
                startIcon={<LogoutIcon />}
                onClick={logout}
                sx={{ borderRadius: '8px' }}
              >
                Logout
              </Button>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Nav Bar */}
      <Box sx={{ display: { xs: 'flex', sm: 'none' }, justifyContent: 'space-around', borderBottom: '1px solid', borderColor: 'divider', bgcolor: 'background.paper', p: 1 }}>
        {navItems.map((item) => {
          const active = location.pathname === item.path;
          return (
            <IconButton
              key={item.label}
              onClick={() => navigate(item.path)}
              color={active ? 'primary' : 'default'}
              sx={{ borderRadius: '8px' }}
            >
              {item.icon}
            </IconButton>
          );
        })}
      </Box>

      <Container component="main" maxWidth="lg" sx={{ flexGrow: 1, py: 4, display: 'flex', flexDirection: 'column' }}>
        <Outlet />
      </Container>
    </Box>
  );
};

export default StaffLayout;

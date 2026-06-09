import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  IconButton,
  Tooltip,
  useTheme
} from '@mui/material';
import {
  People as PeopleIcon,
  CheckCircle as PresentIcon,
  Cancel as AbsentIcon,
  EventBusy as LeaveIcon,
  HourglassEmpty as PendingIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import dashboardService from '../../services/dashboardService';

const AdminDashboard = () => {
  const theme = useTheme();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await dashboardService.getStats();
      if (response && response.success && response.data) {
        setStats(response.data.stats);
      } else {
        throw new Error('Failed to retrieve statistics');
      }
    } catch (err) {
      console.error('Error fetching dashboard statistics:', err);
      setError(err.message || 'Error connecting to the server. Please verify database connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const cardItems = [
    {
      title: 'Total Staff',
      value: stats?.totalStaff ?? 0,
      icon: <PeopleIcon sx={{ fontSize: 40, color: theme.palette.primary.main }} />,
      color: theme.palette.primary.main,
      bg: 'rgba(99, 102, 241, 0.04)'
    },
    {
      title: 'Present Today',
      value: stats?.presentToday ?? 0,
      icon: <PresentIcon sx={{ fontSize: 40, color: theme.palette.success.main }} />,
      color: theme.palette.success.main,
      bg: 'rgba(34, 197, 94, 0.04)'
    },
    {
      title: 'Absent Today',
      value: stats?.absentToday ?? 0,
      icon: <AbsentIcon sx={{ fontSize: 40, color: theme.palette.error.main }} />,
      color: theme.palette.error.main,
      bg: 'rgba(239, 68, 68, 0.04)'
    },
    {
      title: 'On Leave',
      value: stats?.onLeave ?? 0,
      icon: <LeaveIcon sx={{ fontSize: 40, color: theme.palette.warning.main }} />,
      color: theme.palette.warning.main,
      bg: 'rgba(245, 158, 11, 0.04)'
    },
    {
      title: 'Pending Leaves',
      value: stats?.pendingLeaves ?? 0,
      icon: <PendingIcon sx={{ fontSize: 40, color: theme.palette.secondary.main }} />,
      color: theme.palette.secondary.main,
      bg: 'rgba(168, 85, 247, 0.04)'
    }
  ];

  return (
    <Box className="fade-in">
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Admin Dashboard
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Welcome to the Staff Attendance Management Control Panel.
          </Typography>
        </Box>
        <Tooltip title="Refresh Statistics">
          <IconButton 
            onClick={fetchStats} 
            disabled={loading} 
            sx={{ 
              bgcolor: 'background.paper', 
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
              border: '1px solid',
              borderColor: 'divider'
            }}
          >
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 4, borderRadius: '12px' }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 8 }}>
          <CircularProgress size={50} thickness={4} />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {cardItems.map((item, idx) => (
            <Grid item xs={12} sm={6} md={4} lg={2.4} key={idx}>
              <Card 
                sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  position: 'relative',
                  overflow: 'hidden',
                  background: item.bg,
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: `0 12px 24px -10px ${item.color}33`,
                    borderColor: item.color
                  }
                }}
              >
                <CardContent sx={{ p: 3, '&:last-child': { pb: 3 } }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Typography color="text.secondary" variant="subtitle2" sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      {item.title}
                    </Typography>
                    {item.icon}
                  </Box>
                  <Typography variant="h3" sx={{ fontWeight: 800, color: 'text.primary', mb: 0.5 }}>
                    {item.value}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default AdminDashboard;

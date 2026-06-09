import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  Divider,
  CircularProgress,
  Alert,
  IconButton,
  Tooltip,
  Paper,
  Stack,
  useTheme
} from '@mui/material';
import {
  Badge as BadgeIcon,
  Email as EmailIcon,
  Business as BusinessIcon,
  Phone as PhoneIcon,
  CalendarToday as DateIcon,
  Refresh as RefreshIcon,
  Person as PersonIcon,
  Work as WorkIcon
} from '@mui/icons-material';
import api from '../../services/api';

const ProfileDetails = () => {
  const theme = useTheme();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await api.get('/auth/profile');
      if (response && response.success && response.data) {
        setProfile(response.data.profile);
      } else {
        throw new Error('Failed to retrieve profile data.');
      }
    } catch (err) {
      console.error('Error fetching employee profile details:', err);
      setError(err.message || 'Failed to load profile details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const getInitials = (firstName, lastName) => {
    if (!firstName && !lastName) return 'EP';
    return `${(firstName || '').charAt(0)}${(lastName || '').charAt(0)}`.toUpperCase();
  };

  const detailsList = profile ? [
    {
      label: 'Employee Code',
      value: profile.staffProfile?.employee_code || '—',
      icon: <BadgeIcon color="primary" sx={{ fontSize: 24 }} />
    },
    {
      label: 'Email Address',
      value: profile.email || '—',
      icon: <EmailIcon color="primary" sx={{ fontSize: 24 }} />
    },
    {
      label: 'Phone Number',
      value: profile.staffProfile?.phone_number || 'Not provided',
      icon: <PhoneIcon color="primary" sx={{ fontSize: 24 }} />
    },
    {
      label: 'Designation',
      value: profile.staffProfile?.designation || 'Staff',
      icon: <WorkIcon color="primary" sx={{ fontSize: 24 }} />
    },
    {
      label: 'Joining Date',
      value: profile.staffProfile?.joining_date || '—',
      icon: <DateIcon color="primary" sx={{ fontSize: 24 }} />
    }
  ] : [];

  return (
    <Box className="fade-in">
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Personal Profile
          </Typography>
          <Typography variant="body2" color="text.secondary">
            View your employment metadata and account coordinates.
          </Typography>
        </Box>
        <Tooltip title="Refresh profile">
          <IconButton 
            onClick={fetchProfile} 
            disabled={loading}
            sx={{ border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}
          >
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: '12px' }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : profile ? (
        <Grid container spacing={4}>
          {/* Left Column: Premium Summary Avatar Profile Card */}
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', p: 3, textAlign: 'center' }}>
              <Avatar 
                sx={{ 
                  width: 100, 
                  height: 100, 
                  bgcolor: theme.palette.primary.main,
                  fontSize: '36px',
                  fontWeight: 700,
                  boxShadow: '0 4px 14px rgba(99, 102, 241, 0.25)',
                  mb: 2
                }}
              >
                {getInitials(profile.staffProfile?.first_name, profile.staffProfile?.last_name)}
              </Avatar>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
                {profile.staffProfile 
                  ? `${profile.staffProfile.first_name} ${profile.staffProfile.last_name}` 
                  : 'Employee Profile'}
              </Typography>
              <Typography variant="body2" color="primary.main" sx={{ fontWeight: 600, mb: 3, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                {profile.staffProfile?.designation || 'Staff Member'}
              </Typography>

              <Divider sx={{ width: '100%', mb: 3 }} />

              <Stack direction="row" spacing={1} alignItems="center" sx={{ width: '100%', justifyContent: 'center', color: 'text.secondary' }}>
                <BusinessIcon />
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  Corporate Portal Access
                </Typography>
              </Stack>
              <Typography variant="caption" color="text.disabled" sx={{ mt: 3 }}>
                For profile updates or corrections, please contact the Human Resources department.
              </Typography>
            </Card>
          </Grid>

          {/* Right Column: Key Metrics employment info list */}
          <Grid item xs={12} md={8}>
            <Card sx={{ height: '100%', p: 1 }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
                  Employment Details
                </Typography>
                
                <Grid container spacing={3}>
                  {detailsList.map((item, index) => (
                    <Grid item xs={12} sm={6} key={index}>
                      <Paper 
                        variant="outlined" 
                        sx={{ 
                          p: 2, 
                          borderRadius: '12px',
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: 2,
                          border: '1px solid',
                          borderColor: 'divider',
                          bgcolor: 'background.default'
                        }}
                      >
                        <Box sx={{ p: 1, bgcolor: 'action.hover', borderRadius: '8px', display: 'flex' }}>
                          {item.icon}
                        </Box>
                        <Box>
                          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500, display: 'block' }}>
                            {item.label}
                          </Typography>
                          <Typography variant="body1" sx={{ fontWeight: 700, color: 'text.primary' }}>
                            {item.value}
                          </Typography>
                        </Box>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      ) : (
        <Paper sx={{ p: 4, textAlign: 'center', color: 'text.secondary' }}>
          No profile record returned.
        </Paper>
      )}
    </Box>
  );
};

export default ProfileDetails;

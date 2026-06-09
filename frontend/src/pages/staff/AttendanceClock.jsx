import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Grid,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Snackbar,
  Alert,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  LocationOn as LocationIcon,
  PlayArrow as CheckInIcon,
  Stop as CheckOutIcon,
  Refresh as RefreshIcon,
  Schedule as ClockIcon
} from '@mui/icons-material';
import attendanceService from '../../services/attendanceService';

const AttendanceClock = () => {
  const [todayRecord, setTodayRecord] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');

  // Ticking local time state
  const [currentTime, setCurrentTime] = useState(new Date());

  // Geolocation parameters
  const [coords, setCoords] = useState({ latitude: null, longitude: null });
  const [locationStatus, setLocationStatus] = useState('Checking location access...');

  // Notification Toast alert
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Request browser geolocation on mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoords({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
          setLocationStatus('GPS Coordinates acquired successfully');
        },
        (err) => {
          console.warn('Geolocation blocked or failed:', err.message);
          setLocationStatus('Location access blocked. Checking in with IP Address only.');
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    } else {
      setLocationStatus('Geolocation not supported by your browser. Checking in with IP only.');
    }
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');

      // 1. Fetch today's check-in record
      const todayResponse = await attendanceService.getTodayStatus();
      setTodayRecord(todayResponse?.data?.record || null);

      // 2. Fetch attendance history
      const historyResponse = await attendanceService.getHistory({ limit: 10 });
      setHistory(historyResponse?.data?.history || []);
    } catch (err) {
      console.error('Error fetching attendance logs:', err);
      setError(err.message || 'Failed to fetch attendance logs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const showNotification = (message, severity = 'success') => {
    setNotification({ open: true, message, severity });
  };

  const handleCheckIn = async () => {
    try {
      setActionLoading(true);
      const payload = {
        latitude: coords.latitude,
        longitude: coords.longitude,
        deviceInfo: navigator.userAgent,
        method: 'WEB'
      };

      const response = await attendanceService.checkIn(payload);
      if (response && response.success) {
        showNotification('Checked in successfully!');
        fetchData();
      }
    } catch (err) {
      showNotification(err.message || 'Check-in failed.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCheckOut = async () => {
    try {
      setActionLoading(true);
      const payload = {
        latitude: coords.latitude,
        longitude: coords.longitude,
        deviceInfo: navigator.userAgent,
        method: 'WEB'
      };

      const response = await attendanceService.checkOut(payload);
      if (response && response.success) {
        showNotification('Checked out successfully!');
        fetchData();
      }
    } catch (err) {
      showNotification(err.message || 'Check-out failed.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusChip = (status) => {
    switch (status) {
      case 'PRESENT':
        return <Chip label="Present" color="success" size="small" sx={{ fontWeight: 600 }} />;
      case 'LATE':
        return <Chip label="Late" color="warning" size="small" sx={{ fontWeight: 600 }} />;
      case 'HALF_DAY':
        return <Chip label="Half Day" color="secondary" size="small" sx={{ fontWeight: 600 }} />;
      case 'ABSENT':
        return <Chip label="Absent" color="error" size="small" sx={{ fontWeight: 600 }} />;
      case 'ON_LEAVE':
        return <Chip label="On Leave" color="info" size="small" sx={{ fontWeight: 600 }} />;
      default:
        return <Chip label={status} size="small" />;
    }
  };

  const getClockingStatus = () => {
    if (!todayRecord) {
      return { text: 'Not Checked In', color: 'text.secondary', status: 'pending' };
    }
    if (todayRecord.check_in && !todayRecord.check_out) {
      return { text: `Checked In today at ${new Date(todayRecord.check_in).toLocaleTimeString()}`, color: 'success.main', status: 'checked_in' };
    }
    return { text: `Checked Out today at ${new Date(todayRecord.check_out).toLocaleTimeString()}`, color: 'text.disabled', status: 'checked_out' };
  };

  const statusInfo = getClockingStatus();

  return (
    <Box className="fade-in">
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Attendance Clock
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Register daily check-in / check-out timestamps with geolocation stamps.
          </Typography>
        </Box>
        <Tooltip title="Refresh log logs">
          <IconButton 
            onClick={fetchData} 
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

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Left Widget: Live Digital Clock */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', p: 1 }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <ClockIcon sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
              <Typography variant="h3" sx={{ fontWeight: 800, fontFamily: 'monospace', letterSpacing: '2px', mb: 1 }}>
                {currentTime.toLocaleTimeString()}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary" sx={{ fontWeight: 600 }}>
                {currentTime.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </Typography>
              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1 }}>
                <LocationIcon color={coords.latitude ? 'success' : 'action'} />
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                  {locationStatus}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Right Widget: Punch actions buttons */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', p: 1 }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                Status Dashboard
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 600, color: statusInfo.color, mb: 4 }}>
                {statusInfo.text}
              </Typography>

              <Grid container spacing={2} justifyContent="center">
                <Grid item xs={6}>
                  <Button
                    variant="contained"
                    color="success"
                    fullWidth
                    size="large"
                    startIcon={<CheckInIcon />}
                    disabled={loading || actionLoading || statusInfo.status !== 'pending'}
                    onClick={handleCheckIn}
                    sx={{ py: 2, fontWeight: 700, fontSize: '16px' }}
                  >
                    Check In
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    variant="contained"
                    color="error"
                    fullWidth
                    size="large"
                    startIcon={<CheckOutIcon />}
                    disabled={loading || actionLoading || statusInfo.status !== 'checked_in'}
                    onClick={handleCheckOut}
                    sx={{ py: 2, fontWeight: 700, fontSize: '16px' }}
                  >
                    Check Out
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Section Table Header */}
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
        Recent Attendance Logs
      </Typography>

      {/* Attendance History list */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper} sx={{ borderRadius: '16px', border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
          <Table>
            <TableHead sx={{ bgcolor: 'action.hover' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Check In</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Check Out</TableCell>
                <TableCell sx={{ fontWeight: 600 }} align="center">Duration</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Punch Method</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>IP Stamp</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {history.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                    No check-in records logged for this employee profile yet.
                  </TableCell>
                </TableRow>
              ) : (
                history.map((record) => (
                  <TableRow key={record.id} hover>
                    <TableCell sx={{ fontWeight: 600 }}>{record.date}</TableCell>
                    <TableCell>
                      {record.check_in ? new Date(record.check_in).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—'}
                    </TableCell>
                    <TableCell>
                      {record.check_out ? new Date(record.check_out).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—'}
                    </TableCell>
                    <TableCell align="center" sx={{ fontWeight: 700 }}>
                      {record.working_hours ? `${record.working_hours} hrs` : '—'}
                    </TableCell>
                    <TableCell>
                      <Chip label={record.check_in_method || 'WEB'} size="small" variant="outlined" sx={{ fontSize: '11px', fontWeight: 600 }} />
                    </TableCell>
                    <TableCell>{getStatusChip(record.status)}</TableCell>
                    <TableCell sx={{ color: 'text.secondary', fontFamily: 'monospace', fontSize: '12px' }}>
                      {record.check_in_ip || '127.0.0.1'}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Snackbar alerts toast */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={() => setNotification((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setNotification((prev) => ({ ...prev, open: false }))}
          severity={notification.severity}
          sx={{ width: '100%', borderRadius: '8px' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AttendanceClock;

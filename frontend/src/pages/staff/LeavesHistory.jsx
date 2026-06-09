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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  CircularProgress,
  Snackbar,
  Alert,
  Chip,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Add as AddIcon,
  Refresh as RefreshIcon,
  Assignment as LeaveIcon
} from '@mui/icons-material';
import leaveService from '../../services/leaveService';

const LeavesHistory = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Dialog control states
  const [openApply, setOpenApply] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    leaveType: 'CASUAL',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    reason: ''
  });
  const [submitLoading, setSubmitLoading] = useState(false);

  // Notifications Toast states
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });

  const fetchLeaves = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await leaveService.getLeaves();
      if (response && response.success && response.data) {
        setLeaves(response.data.leaves || []);
      } else {
        throw new Error('Failed to retrieve leave history');
      }
    } catch (err) {
      console.error('Error fetching leave logs details:', err);
      setError(err.message || 'Failed to load leave history.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  const handleOpenApply = () => {
    setFormData({
      leaveType: 'CASUAL',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0],
      reason: ''
    });
    setOpenApply(true);
  };

  const handleCloseApply = () => {
    setOpenApply(false);
  };

  const showNotification = (message, severity = 'success') => {
    setNotification({ open: true, message, severity });
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleApplySubmit = async (e) => {
    e.preventDefault();
    if (!formData.startDate || !formData.endDate || !formData.leaveType || !formData.reason) {
      showNotification('Please fill in all required fields.', 'error');
      return;
    }

    if (new Date(formData.endDate) < new Date(formData.startDate)) {
      showNotification('End date cannot be earlier than start date.', 'error');
      return;
    }

    if (formData.reason.trim().length < 10) {
      showNotification('Please provide a reason of at least 10 characters.', 'error');
      return;
    }

    try {
      setSubmitLoading(true);
      const response = await leaveService.applyLeave(formData);
      if (response && response.success) {
        showNotification('Leave application submitted successfully!');
        handleCloseApply();
        fetchLeaves();
      }
    } catch (err) {
      showNotification(err.message || 'Failed to submit leave request.', 'error');
    } finally {
      setSubmitLoading(false);
    }
  };

  const getStatusChip = (status) => {
    switch (status) {
      case 'APPROVED':
        return <Chip label="Approved" color="success" size="small" sx={{ fontWeight: 600 }} />;
      case 'REJECTED':
        return <Chip label="Rejected" color="error" size="small" sx={{ fontWeight: 600 }} />;
      default:
        return <Chip label="Pending" color="warning" size="small" sx={{ fontWeight: 600 }} />;
    }
  };

  const getLeaveTypeChip = (type) => {
    let color = 'default';
    if (type === 'SICK') color = 'error';
    else if (type === 'CASUAL') color = 'primary';
    else if (type === 'EARNED') color = 'info';
    else if (type === 'UNPAID') color = 'warning';

    return <Chip label={type} color={color} variant="outlined" size="small" sx={{ fontWeight: 500 }} />;
  };

  return (
    <Box className="fade-in">
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Leave Applications
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Apply for new leave requests and check your status records.
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Tooltip title="Reload records">
            <IconButton 
              onClick={fetchLeaves} 
              disabled={loading}
              sx={{ border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}
            >
              <RefreshIcon />
            </IconButton>
          </Tooltip>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenApply}
            sx={{ fontWeight: 600 }}
          >
            Apply Leave
          </Button>
        </Box>
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
      ) : (
        <TableContainer component={Paper} sx={{ borderRadius: '16px', border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
          <Table>
            <TableHead sx={{ bgcolor: 'action.hover' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>ID</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Leave Type</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Start Date</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>End Date</TableCell>
                <TableCell sx={{ fontWeight: 600 }} align="center">Applied Days</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Reason / Description</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Manager Remarks</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {leaves.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                    You have not submitted any leave requests yet.
                  </TableCell>
                </TableRow>
              ) : (
                leaves.map((leave) => (
                  <TableRow key={leave.id} hover>
                    <TableCell sx={{ color: 'text.secondary', fontWeight: 500 }}>{leave.id}</TableCell>
                    <TableCell>{getLeaveTypeChip(leave.leave_type)}</TableCell>
                    <TableCell sx={{ fontWeight: 500 }}>{leave.start_date}</TableCell>
                    <TableCell sx={{ fontWeight: 500 }}>{leave.end_date}</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 700 }}>{leave.applied_days}</TableCell>
                    <TableCell sx={{ maxWidth: '250px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      <Tooltip title={leave.reason}>
                        <span>{leave.reason}</span>
                      </Tooltip>
                    </TableCell>
                    <TableCell>{getStatusChip(leave.status)}</TableCell>
                    <TableCell sx={{ fontStyle: 'italic', color: 'text.secondary' }}>
                      {leave.remarks || '—'}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Dialog: Apply for Leave Form */}
      <Dialog open={openApply} onClose={handleCloseApply} fullWidth maxWidth="sm" PaperProps={{ sx: { borderRadius: '16px' } }}>
        <DialogTitle sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
          <LeaveIcon color="primary" />
          Apply for Leave Request
        </DialogTitle>
        <form onSubmit={handleApplySubmit}>
          <DialogContent sx={{ pt: 1 }}>
            <TextField
              select
              name="leaveType"
              label="Leave Type Category"
              fullWidth
              required
              value={formData.leaveType}
              onChange={handleFormChange}
              sx={{ mb: 2 }}
            >
              <MenuItem value="CASUAL">Casual Leave</MenuItem>
              <MenuItem value="SICK">Sick Leave</MenuItem>
              <MenuItem value="EARNED">Earned Leave</MenuItem>
              <MenuItem value="MATERNITY">Maternity Leave</MenuItem>
              <MenuItem value="PATERNITY">Paternity Leave</MenuItem>
              <MenuItem value="UNPAID">Unpaid / Loss of Pay</MenuItem>
            </TextField>
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <TextField
                name="startDate"
                label="Start Date"
                type="date"
                fullWidth
                required
                value={formData.startDate}
                onChange={handleFormChange}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                name="endDate"
                label="End Date"
                type="date"
                fullWidth
                required
                value={formData.endDate}
                onChange={handleFormChange}
                InputLabelProps={{ shrink: true }}
                inputProps={{ min: formData.startDate }}
              />
            </Box>
            <TextField
              name="reason"
              label="Reason / Comments"
              fullWidth
              required
              multiline
              rows={3}
              value={formData.reason}
              onChange={handleFormChange}
              placeholder="Please describe why you are requesting leave (minimum 10 characters)..."
              helperText="Note: Weekends (Saturday/Sunday) are automatically excluded from the calculated applied days count."
            />
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={handleCloseApply} disabled={submitLoading}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={submitLoading}>
              {submitLoading ? <CircularProgress size={24} /> : 'Submit Request'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Alerts Snackbar toast */}
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

export default LeavesHistory;

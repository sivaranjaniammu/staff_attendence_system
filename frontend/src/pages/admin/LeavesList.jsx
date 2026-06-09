import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Snackbar,
  Alert,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Check as ApproveIcon,
  Close as RejectIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import leaveService from '../../services/leaveService';

const LeavesList = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Review Dialog states
  const [openReview, setOpenReview] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [actionType, setActionType] = useState('APPROVED'); // 'APPROVED' | 'REJECTED'
  const [remarks, setRemarks] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);

  // Notification status
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });

  const fetchLeaves = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await leaveService.getLeaves();
      if (response && response.success && response.data) {
        setLeaves(response.data.leaves || []);
      } else {
        throw new Error('Failed to retrieve leave requests');
      }
    } catch (err) {
      console.error('Error fetching leave requests:', err);
      setError(err.message || 'Failed to load leave requests.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  const handleOpenReview = (leave, action) => {
    setSelectedLeave(leave);
    setActionType(action);
    setRemarks('');
    setOpenReview(true);
  };

  const handleCloseReview = () => {
    setOpenReview(false);
    setSelectedLeave(null);
    setRemarks('');
  };

  const showNotification = (message, severity = 'success') => {
    setNotification({ open: true, message, severity });
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!selectedLeave) return;

    try {
      setSubmitLoading(true);
      const response = await leaveService.updateLeaveStatus(selectedLeave.id, actionType, remarks);
      if (response && response.success) {
        showNotification(`Leave request successfully ${actionType.toLowerCase()}!`);
        handleCloseReview();
        fetchLeaves();
      }
    } catch (err) {
      showNotification(err.message || 'Failed to update leave request status.', 'error');
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
            Leave Requests Management
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Review and manage staff leave applications and review history logs.
          </Typography>
        </Box>
        <Tooltip title="Reload records">
          <IconButton 
            onClick={fetchLeaves} 
            disabled={loading}
            sx={{ border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}
          >
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ borderRadius: '12px' }}>
          {error}
        </Alert>
      ) : (
        <TableContainer component={Paper} sx={{ borderRadius: '16px', border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
          <Table>
            <TableHead sx={{ bgcolor: 'action.hover' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Employee</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Leave Type</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Duration</TableCell>
                <TableCell sx={{ fontWeight: 600 }} align="center">Days</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Reason</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Reviewer Remarks</TableCell>
                <TableCell sx={{ fontWeight: 600 }} align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {leaves.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                    No leave requests found in the system.
                  </TableCell>
                </TableRow>
              ) : (
                leaves.map((leave) => (
                  <TableRow key={leave.id} hover>
                    <TableCell>
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                          {leave.applicant ? `${leave.applicant.first_name} ${leave.applicant.last_name}` : 'Unknown Staff'}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {leave.applicant ? leave.applicant.employee_code : '—'}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{getLeaveTypeChip(leave.leave_type)}</TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {leave.start_date} to {leave.end_date}
                      </Typography>
                    </TableCell>
                    <TableCell align="center" sx={{ fontWeight: 700 }}>
                      {leave.applied_days}
                    </TableCell>
                    <TableCell sx={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      <Tooltip title={leave.reason}>
                        <span>{leave.reason}</span>
                      </Tooltip>
                    </TableCell>
                    <TableCell>{getStatusChip(leave.status)}</TableCell>
                    <TableCell sx={{ color: 'text.secondary', fontStyle: 'italic', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {leave.remarks || '—'}
                    </TableCell>
                    <TableCell align="right">
                      {leave.status === 'PENDING' ? (
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                          <Button
                            variant="contained"
                            color="success"
                            size="small"
                            startIcon={<ApproveIcon />}
                            onClick={() => handleOpenReview(leave, 'APPROVED')}
                            sx={{ py: 0.5, minWidth: '90px' }}
                          >
                            Approve
                          </Button>
                          <Button
                            variant="contained"
                            color="error"
                            size="small"
                            startIcon={<RejectIcon />}
                            onClick={() => handleOpenReview(leave, 'REJECTED')}
                            sx={{ py: 0.5, minWidth: '90px' }}
                          >
                            Reject
                          </Button>
                        </Box>
                      ) : (
                        <Typography variant="caption" color="text.disabled" sx={{ fontWeight: 600 }}>
                          Reviewed
                        </Typography>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Dialog: Approve/Reject Review Input */}
      <Dialog open={openReview} onClose={handleCloseReview} fullWidth maxWidth="xs" PaperProps={{ sx: { borderRadius: '16px' } }}>
        <DialogTitle sx={{ fontWeight: 700 }}>
          {actionType === 'APPROVED' ? 'Approve Leave Request' : 'Reject Leave Request'}
        </DialogTitle>
        <form onSubmit={handleReviewSubmit}>
          <DialogContent>
            <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
              Confirm your review choice for <strong>{selectedLeave?.applicant ? `${selectedLeave.applicant.first_name} ${selectedLeave.applicant.last_name}` : 'this staff'}</strong>.
            </Typography>
            <TextField
              name="remarks"
              label="Manager Remarks / Comments"
              fullWidth
              multiline
              rows={3}
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="E.g., Approved based on medical certificate."
              inputProps={{ maxLength: 255 }}
            />
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={handleCloseReview} disabled={submitLoading}>Cancel</Button>
            <Button
              type="submit"
              variant="contained"
              color={actionType === 'APPROVED' ? 'success' : 'error'}
              disabled={submitLoading}
            >
              {submitLoading ? <CircularProgress size={24} /> : actionType === 'APPROVED' ? 'Confirm Approve' : 'Confirm Reject'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Alert Notifications Toast Snackbar */}
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

export default LeavesList;

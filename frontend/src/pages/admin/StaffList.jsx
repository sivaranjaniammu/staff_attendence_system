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
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  CircularProgress,
  Snackbar,
  Alert,
  Tooltip,
  useTheme,
  Grid,
  Chip
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import staffService from '../../services/staffService';
import departmentService from '../../services/departmentService';

const StaffList = () => {
  const theme = useTheme();
  const [staffList, setStaffList] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Dialog control states
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    designation: '',
    department_id: '',
    phone_number: '',
    joining_date: new Date().toISOString().split('T')[0]
  });
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);

  // Notifications toast alert state
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Fetch departments first for select options
      const deptResponse = await departmentService.getAllDepartments();
      const depts = deptResponse?.data?.departments || [];
      setDepartments(depts);

      // Fetch staff directory
      const response = await staffService.getAllStaff();
      if (response && response.success && response.data) {
        setStaffList(response.data.staffList || []);
      } else {
        throw new Error('Failed to retrieve staff directory');
      }
    } catch (err) {
      console.error('Error fetching staff metrics details:', err);
      setError(err.message || 'Failed to load staff profiles directory.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenCreate = () => {
    setFormData({
      email: '',
      password: '',
      first_name: '',
      last_name: '',
      designation: '',
      department_id: departments[0]?.id || '',
      phone_number: '',
      joining_date: new Date().toISOString().split('T')[0]
    });
    setOpenCreate(true);
  };

  const handleOpenEdit = (staff) => {
    setSelectedStaff(staff);
    setFormData({
      first_name: staff.first_name,
      last_name: staff.last_name,
      designation: staff.designation,
      department_id: staff.department_id || '',
      phone_number: staff.phone_number || '',
      joining_date: staff.joining_date || new Date().toISOString().split('T')[0]
    });
    setOpenEdit(true);
  };

  const handleOpenDelete = (staff) => {
    setSelectedStaff(staff);
    setOpenDelete(true);
  };

  const handleCloseDialogs = () => {
    setOpenCreate(false);
    setOpenEdit(false);
    setOpenDelete(false);
    setSelectedStaff(null);
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

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password || !formData.first_name || !formData.last_name || !formData.designation || !formData.department_id) {
      showNotification('Please fill in all required fields.', 'error');
      return;
    }

    try {
      setSubmitLoading(true);
      const response = await staffService.createStaff(formData);
      if (response && response.success) {
        showNotification('Staff member registered successfully!');
        handleCloseDialogs();
        fetchData();
      }
    } catch (err) {
      showNotification(err.message || 'Failed to onboard staff member.', 'error');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!formData.first_name || !formData.last_name || !formData.designation || !formData.department_id) {
      showNotification('Please fill in all required fields.', 'error');
      return;
    }

    try {
      setSubmitLoading(true);
      // Map update fields
      const updatePayload = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        designation: formData.designation,
        department_id: formData.department_id,
        phone_number: formData.phone_number,
        joining_date: formData.joining_date
      };

      const response = await staffService.updateStaff(selectedStaff.id, updatePayload);
      if (response && response.success) {
        showNotification('Staff profile updated successfully!');
        handleCloseDialogs();
        fetchData();
      }
    } catch (err) {
      showNotification(err.message || 'Failed to update staff details.', 'error');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDeleteSubmit = async () => {
    try {
      setSubmitLoading(true);
      const response = await staffService.deleteStaff(selectedStaff.id);
      if (response && response.success) {
        showNotification('Staff credentials and profile deleted successfully!');
        handleCloseDialogs();
        fetchData();
      }
    } catch (err) {
      showNotification(err.message || 'Failed to delete staff member.', 'error');
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <Box className="fade-in">
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Staff Members Directory
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage organization employees, designations, and system credentials.
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Tooltip title="Reload records">
            <IconButton 
              onClick={fetchData} 
              disabled={loading}
              sx={{ border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}
            >
              <RefreshIcon />
            </IconButton>
          </Tooltip>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenCreate}
            sx={{ fontWeight: 600 }}
          >
            Onboard Staff
          </Button>
        </Box>
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
                <TableCell sx={{ fontWeight: 600 }}>Employee Code</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Name / Designation</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Email Address</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Department</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Phone Number</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Joining Date</TableCell>
                <TableCell sx={{ fontWeight: 600 }} align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {staffList.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                    No staff profiles registered. Click "Onboard Staff" to add members.
                  </TableCell>
                </TableRow>
              ) : (
                staffList.map((staff) => (
                  <TableRow key={staff.id} hover>
                    <TableCell sx={{ fontWeight: 700, color: 'primary.main' }}>
                      {staff.employee_code}
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                          {`${staff.first_name} ${staff.last_name}`}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {staff.designation}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ fontWeight: 500 }}>
                      {staff.userCredentials?.email || '—'}
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={staff.department?.name || 'Unassigned'} 
                        size="small" 
                        variant="outlined"
                        color={staff.department ? 'primary' : 'default'}
                        sx={{ fontWeight: 600 }}
                      />
                    </TableCell>
                    <TableCell>{staff.phone_number || '—'}</TableCell>
                    <TableCell>{staff.joining_date || '—'}</TableCell>
                    <TableCell align="right">
                      <Tooltip title="Edit Staff Profile">
                        <IconButton color="primary" onClick={() => handleOpenEdit(staff)}>
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete Profile">
                        <IconButton color="error" onClick={() => handleOpenDelete(staff)}>
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Dialog: Create Onboard Staff */}
      <Dialog open={openCreate} onClose={handleCloseDialogs} fullWidth maxWidth="sm" PaperProps={{ sx: { borderRadius: '16px' } }}>
        <DialogTitle sx={{ fontWeight: 700 }}>Onboard New Staff Member</DialogTitle>
        <form onSubmit={handleCreateSubmit}>
          <DialogContent sx={{ pt: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="first_name"
                  label="First Name"
                  fullWidth
                  required
                  value={formData.first_name}
                  onChange={handleFormChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="last_name"
                  label="Last Name"
                  fullWidth
                  required
                  value={formData.last_name}
                  onChange={handleFormChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="email"
                  label="Corporate Email Address"
                  type="email"
                  fullWidth
                  required
                  value={formData.email}
                  onChange={handleFormChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="password"
                  label="System Password"
                  type="password"
                  fullWidth
                  required
                  value={formData.password}
                  onChange={handleFormChange}
                  helperText="Must be at least 6 characters."
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="designation"
                  label="Designation / Job Title"
                  fullWidth
                  required
                  value={formData.designation}
                  onChange={handleFormChange}
                  placeholder="E.g. Software Engineer, HR Exec"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  name="department_id"
                  label="Department Assignment"
                  fullWidth
                  required
                  value={formData.department_id}
                  onChange={handleFormChange}
                >
                  {departments.map((dept) => (
                    <MenuItem key={dept.id} value={dept.id}>
                      {dept.name} ({dept.code})
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="phone_number"
                  label="Phone Number"
                  fullWidth
                  value={formData.phone_number}
                  onChange={handleFormChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="joining_date"
                  label="Joining Date"
                  type="date"
                  fullWidth
                  required
                  value={formData.joining_date}
                  onChange={handleFormChange}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={handleCloseDialogs} disabled={submitLoading}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={submitLoading}>
              {submitLoading ? <CircularProgress size={24} /> : 'Register'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Dialog: Edit Staff Profile */}
      <Dialog open={openEdit} onClose={handleCloseDialogs} fullWidth maxWidth="sm" PaperProps={{ sx: { borderRadius: '16px' } }}>
        <DialogTitle sx={{ fontWeight: 700 }}>Edit Staff Profile</DialogTitle>
        <form onSubmit={handleEditSubmit}>
          <DialogContent sx={{ pt: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="first_name"
                  label="First Name"
                  fullWidth
                  required
                  value={formData.first_name}
                  onChange={handleFormChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="last_name"
                  label="Last Name"
                  fullWidth
                  required
                  value={formData.last_name}
                  onChange={handleFormChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="designation"
                  label="Designation"
                  fullWidth
                  required
                  value={formData.designation}
                  onChange={handleFormChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  name="department_id"
                  label="Department"
                  fullWidth
                  required
                  value={formData.department_id}
                  onChange={handleFormChange}
                >
                  {departments.map((dept) => (
                    <MenuItem key={dept.id} value={dept.id}>
                      {dept.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="phone_number"
                  label="Phone Number"
                  fullWidth
                  value={formData.phone_number}
                  onChange={handleFormChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="joining_date"
                  label="Joining Date"
                  type="date"
                  fullWidth
                  required
                  value={formData.joining_date}
                  onChange={handleFormChange}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={handleCloseDialogs} disabled={submitLoading}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={submitLoading}>
              {submitLoading ? <CircularProgress size={24} /> : 'Save Changes'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Dialog: Delete Staff Confirmation */}
      <Dialog open={openDelete} onClose={handleCloseDialogs} PaperProps={{ sx: { borderRadius: '16px' } }}>
        <DialogTitle sx={{ fontWeight: 700 }}>Delete Staff Record</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the profile of <strong>{selectedStaff ? `${selectedStaff.first_name} ${selectedStaff.last_name}` : ''}</strong> ({selectedStaff?.employee_code})?
          </Typography>
          <Typography color="error.main" variant="body2" sx={{ mt: 2, fontWeight: 500 }}>
            Warning: This action will permanently delete their employee profile and all associated system user login credentials from the database.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleCloseDialogs} disabled={submitLoading}>Cancel</Button>
          <Button onClick={handleDeleteSubmit} color="error" variant="contained" disabled={submitLoading}>
            {submitLoading ? <CircularProgress size={24} /> : 'Delete Permanently'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Alerts Snackbar toast notifications */}
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

export default StaffList;

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
  CircularProgress,
  Snackbar,
  Alert,
  Tooltip
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import departmentService from '../../services/departmentService';

const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Dialog states
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  // Form states
  const [formData, setFormData] = useState({ name: '', code: '', description: '' });
  const [selectedDept, setSelectedDept] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);

  // Alert notification state
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await departmentService.getAllDepartments();
      if (response && response.success && response.data) {
        setDepartments(response.data.departments || []);
      } else {
        throw new Error('Failed to retrieve departments');
      }
    } catch (err) {
      console.error('Error fetching departments:', err);
      setError(err.message || 'Failed to load departments.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleOpenCreate = () => {
    setFormData({ name: '', code: '', description: '' });
    setOpenCreate(true);
  };

  const handleOpenEdit = (dept) => {
    setSelectedDept(dept);
    setFormData({ name: dept.name, code: dept.code, description: dept.description || '' });
    setOpenEdit(true);
  };

  const handleOpenDelete = (dept) => {
    setSelectedDept(dept);
    setOpenDelete(true);
  };

  const handleCloseDialogs = () => {
    setOpenCreate(false);
    setOpenEdit(false);
    setOpenDelete(false);
    setSelectedDept(null);
  };

  const showNotification = (message, severity = 'success') => {
    setNotification({ open: true, message, severity });
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'code' ? value.toUpperCase() : value
    }));
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.code) {
      showNotification('Department name and code are required.', 'error');
      return;
    }

    try {
      setSubmitLoading(true);
      const response = await departmentService.createDepartment(formData);
      if (response && response.success) {
        showNotification('Department created successfully!');
        handleCloseDialogs();
        fetchDepartments();
      }
    } catch (err) {
      showNotification(err.message || 'Failed to create department.', 'error');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.code) {
      showNotification('Department name and code are required.', 'error');
      return;
    }

    try {
      setSubmitLoading(true);
      const response = await departmentService.updateDepartment(selectedDept.id, formData);
      if (response && response.success) {
        showNotification('Department updated successfully!');
        handleCloseDialogs();
        fetchDepartments();
      }
    } catch (err) {
      showNotification(err.message || 'Failed to update department.', 'error');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDeleteSubmit = async () => {
    try {
      setSubmitLoading(true);
      const response = await departmentService.deleteDepartment(selectedDept.id);
      if (response && response.success) {
        showNotification('Department deleted successfully!');
        handleCloseDialogs();
        fetchDepartments();
      }
    } catch (err) {
      showNotification(err.message || 'Failed to delete department.', 'error');
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <Box className="fade-in">
      {/* Header controls block */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Departments Management
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage organization structural units, codes, and details.
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Tooltip title="Reload records">
            <IconButton 
              onClick={fetchDepartments} 
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
            Add Department
          </Button>
        </Box>
      </Box>

      {/* Main Content Render */}
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
                <TableCell sx={{ fontWeight: 600 }}>ID</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Code</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Department Name</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Description</TableCell>
                <TableCell sx={{ fontWeight: 600 }} align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {departments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                    No departments added yet. Click "Add Department" to start.
                  </TableCell>
                </TableRow>
              ) : (
                departments.map((dept) => (
                  <TableRow key={dept.id} hover>
                    <TableCell sx={{ color: 'text.secondary', fontWeight: 500 }}>{dept.id}</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: 'primary.main' }}>{dept.code}</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>{dept.name}</TableCell>
                    <TableCell sx={{ color: 'text.secondary', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {dept.description || '—'}
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="Edit Department">
                        <IconButton color="primary" onClick={() => handleOpenEdit(dept)}>
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete Department">
                        <IconButton color="error" onClick={() => handleOpenDelete(dept)}>
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

      {/* Dialog: Create Department */}
      <Dialog open={openCreate} onClose={handleCloseDialogs} fullWidth maxWidth="sm" PaperProps={{ sx: { borderRadius: '16px' } }}>
        <DialogTitle sx={{ fontWeight: 700 }}>Add New Department</DialogTitle>
        <form onSubmit={handleCreateSubmit}>
          <DialogContent sx={{ pt: 1 }}>
            <TextField
              margin="normal"
              name="code"
              label="Department Code"
              fullWidth
              required
              helperText="E.g., HR, IT, SALES (will be auto-uppercased)"
              value={formData.code}
              onChange={handleFormChange}
              inputProps={{ maxLength: 20 }}
            />
            <TextField
              margin="normal"
              name="name"
              label="Department Name"
              fullWidth
              required
              value={formData.name}
              onChange={handleFormChange}
              inputProps={{ maxLength: 100 }}
            />
            <TextField
              margin="normal"
              name="description"
              label="Description"
              fullWidth
              multiline
              rows={3}
              value={formData.description}
              onChange={handleFormChange}
              inputProps={{ maxLength: 500 }}
            />
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={handleCloseDialogs} disabled={submitLoading}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={submitLoading}>
              {submitLoading ? <CircularProgress size={24} /> : 'Save'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Dialog: Edit Department */}
      <Dialog open={openEdit} onClose={handleCloseDialogs} fullWidth maxWidth="sm" PaperProps={{ sx: { borderRadius: '16px' } }}>
        <DialogTitle sx={{ fontWeight: 700 }}>Edit Department</DialogTitle>
        <form onSubmit={handleEditSubmit}>
          <DialogContent sx={{ pt: 1 }}>
            <TextField
              margin="normal"
              name="code"
              label="Department Code"
              fullWidth
              required
              disabled
              value={formData.code}
              onChange={handleFormChange}
            />
            <TextField
              margin="normal"
              name="name"
              label="Department Name"
              fullWidth
              required
              value={formData.name}
              onChange={handleFormChange}
              inputProps={{ maxLength: 100 }}
            />
            <TextField
              margin="normal"
              name="description"
              label="Description"
              fullWidth
              multiline
              rows={3}
              value={formData.description}
              onChange={handleFormChange}
              inputProps={{ maxLength: 500 }}
            />
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={handleCloseDialogs} disabled={submitLoading}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={submitLoading}>
              {submitLoading ? <CircularProgress size={24} /> : 'Update'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Dialog: Delete Department */}
      <Dialog open={openDelete} onClose={handleCloseDialogs} PaperProps={{ sx: { borderRadius: '16px' } }}>
        <DialogTitle sx={{ fontWeight: 700 }}>Delete Department</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the department <strong>{selectedDept?.name}</strong> ({selectedDept?.code})?
          </Typography>
          <Typography color="error.main" variant="body2" sx={{ mt: 2, fontWeight: 500 }}>
            Warning: This action cannot be undone and will fail if there are active staff members assigned to this department.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleCloseDialogs} disabled={submitLoading}>Cancel</Button>
          <Button onClick={handleDeleteSubmit} color="error" variant="contained" disabled={submitLoading}>
            {submitLoading ? <CircularProgress size={24} /> : 'Delete'}
          </Button>
        </DialogActions>
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

export default Departments;

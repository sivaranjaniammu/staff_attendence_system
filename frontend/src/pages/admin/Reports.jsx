import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Tabs, Tab, Grid, Card, CardContent, Button,
  TextField, MenuItem, TableContainer, Table, TableHead, TableRow,
  TableCell, TableBody, Paper, CircularProgress, Alert, Stack
} from '@mui/material';
import {
  PictureAsPdf as PdfIcon,
  GridOn as ExcelIcon,
  Refresh as RefreshIcon,
  Search as SearchIcon
} from '@mui/icons-material';
import reportService from '../../services/reportService';
import api from '../../services/api';

const Reports = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Filters State
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedDept, setSelectedDept] = useState('');
  const [selectedStaff, setSelectedStaff] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  // Dropdown lists
  const [departments, setDepartments] = useState([]);
  const [staffList, setStaffList] = useState([]);

  // Report Data Data Grid
  const [reportData, setReportData] = useState([]);

  // Load departments and staff on mount
  useEffect(() => {
    const fetchDropdowns = async () => {
      try {
        const deptResponse = await api.get('/departments');
        setDepartments(deptResponse.data.departments || []);
        
        // Fetch staff directory (Admin access verified)
        const staffResponse = await api.get('/staff');
        setStaffList(staffResponse.data.staffList || []);
      } catch (err) {
        console.error('Failed to load filters list:', err);
      }
    };
    fetchDropdowns();
  }, []);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setReportData([]);
    setError('');
  };

  const handleGenerateReport = async () => {
    try {
      setLoading(true);
      setError('');
      let response;

      if (activeTab === 0) {
        // Attendance
        response = await reportService.getAttendanceJSON({
          startDate,
          endDate,
          departmentId: selectedDept,
          staffId: selectedStaff
        });
      } else if (activeTab === 1) {
        // Staff
        response = await reportService.getStaffJSON({
          departmentId: selectedDept
        });
      } else {
        // Leaves
        response = await reportService.getLeavesJSON({
          startDate,
          endDate,
          status: selectedStatus
        });
      }

      setReportData(response.data.data || []);
    } catch (err) {
      setError(err.message || 'Failed to generate report details preview.');
      setReportData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleExportPDF = async () => {
    try {
      setLoading(true);
      const params = { startDate, endDate, departmentId: selectedDept, staffId: selectedStaff, status: selectedStatus };
      if (activeTab === 0) await reportService.downloadAttendancePDF(params);
      else if (activeTab === 1) await reportService.downloadStaffPDF(params);
      else await reportService.downloadLeavesPDF(params);
    } catch (err) {
      setError('PDF export failed. Please verify configurations.');
    } finally {
      setLoading(false);
    }
  };

  const handleExportExcel = async () => {
    try {
      setLoading(true);
      const params = { startDate, endDate, departmentId: selectedDept, staffId: selectedStaff, status: selectedStatus };
      if (activeTab === 0) await reportService.downloadAttendanceExcel(params);
      else if (activeTab === 1) await reportService.downloadStaffExcel(params);
      else await reportService.downloadLeavesExcel(params);
    } catch (err) {
      setError('Excel export failed. Please verify configurations.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className="fade-in">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Management Reports
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Analyze corporate attendance metrics, leave applications, and staff directory records.
        </Typography>
      </Box>

      {/* Tabs panels control */}
      <Paper sx={{ mb: 3, borderRadius: '12px' }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
          sx={{ borderBottom: '1px solid', borderColor: 'divider' }}
        >
          <Tab label="Attendance Summary" sx={{ fontWeight: 600 }} />
          <Tab label="Staff Directory" sx={{ fontWeight: 600 }} />
          <Tab label="Leaves Applications" sx={{ fontWeight: 600 }} />
        </Tabs>
      </Paper>

      {/* Filter Panel Cards */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            {activeTab !== 1 && (
              <>
                <Grid item xs={12} sm={3}>
                  <TextField
                    label="From Date"
                    type="date"
                    fullWidth
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <TextField
                    label="To Date"
                    type="date"
                    fullWidth
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
              </>
            )}

            {activeTab !== 2 && (
              <Grid item xs={12} sm={3}>
                <TextField
                  select
                  label="Department"
                  fullWidth
                  value={selectedDept}
                  onChange={(e) => setSelectedDept(e.target.value)}
                >
                  <MenuItem value="">All Departments</MenuItem>
                  {departments.map((dept) => (
                    <MenuItem key={dept.id} value={dept.id}>{dept.name}</MenuItem>
                  ))}
                </TextField>
              </Grid>
            )}

            {activeTab === 0 && (
              <Grid item xs={12} sm={3}>
                <TextField
                  select
                  label="Staff Member"
                  fullWidth
                  value={selectedStaff}
                  onChange={(e) => setSelectedStaff(e.target.value)}
                >
                  <MenuItem value="">All Staff</MenuItem>
                  {staffList.map((s) => (
                    <MenuItem key={s.id} value={s.id}>{`${s.first_name} ${s.last_name}`}</MenuItem>
                  ))}
                </TextField>
              </Grid>
            )}

            {activeTab === 2 && (
              <Grid item xs={12} sm={3}>
                <TextField
                  select
                  label="Leave Status"
                  fullWidth
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                >
                  <MenuItem value="">All Statuses</MenuItem>
                  <MenuItem value="PENDING">Pending</MenuItem>
                  <MenuItem value="APPROVED">Approved</MenuItem>
                  <MenuItem value="REJECTED">Rejected</MenuItem>
                </TextField>
              </Grid>
            )}

            <Grid item xs={12} sm={activeTab === 1 ? 6 : 12} md={activeTab === 1 ? 6 : 12}>
              <Stack direction="row" spacing={2} justifyContent="flex-end">
                <Button
                  variant="outlined"
                  startIcon={<RefreshIcon />}
                  onClick={() => {
                    setSelectedDept('');
                    setSelectedStaff('');
                    setSelectedStatus('');
                    setStartDate(new Date().toISOString().split('T')[0]);
                    setEndDate(new Date().toISOString().split('T')[0]);
                    setReportData([]);
                  }}
                >
                  Reset
                </Button>
                <Button
                  variant="contained"
                  startIcon={<SearchIcon />}
                  disabled={loading}
                  onClick={handleGenerateReport}
                >
                  Generate
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: '8px' }}>
          {error}
        </Alert>
      )}

      {/* Export Options Bar */}
      {reportData.length > 0 && (
        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button
            variant="outlined"
            color="error"
            startIcon={<PdfIcon />}
            disabled={loading}
            onClick={handleExportPDF}
          >
            Export PDF
          </Button>
          <Button
            variant="outlined"
            color="success"
            startIcon={<ExcelIcon />}
            disabled={loading}
            onClick={handleExportExcel}
          >
            Export Excel
          </Button>
        </Box>
      )}

      {/* Table Data Preview Layout */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : reportData.length > 0 ? (
        <TableContainer component={Paper} sx={{ borderRadius: '12px' }}>
          <Table>
            <TableHead sx={{ bgcolor: 'rgba(99, 102, 241, 0.08)' }}>
              <TableRow>
                {activeTab === 0 && (
                  <>
                    <TableCell sx={{ fontWeight: 600 }}>Code</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Department</TableCell>
                    <TableCell sx={{ fontWeight: 600 }} align="center">Present</TableCell>
                    <TableCell sx={{ fontWeight: 600 }} align="center">Absent</TableCell>
                    <TableCell sx={{ fontWeight: 600 }} align="center">Late</TableCell>
                    <TableCell sx={{ fontWeight: 600 }} align="center">Half Day</TableCell>
                    <TableCell sx={{ fontWeight: 600 }} align="right">Hours</TableCell>
                  </>
                )}
                {activeTab === 1 && (
                  <>
                    <TableCell sx={{ fontWeight: 600 }}>Code</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Department</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Designation</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Joining Date</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                  </>
                )}
                {activeTab === 2 && (
                  <>
                    <TableCell sx={{ fontWeight: 600 }}>Code</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Leave Type</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Start Date</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>End Date</TableCell>
                    <TableCell sx={{ fontWeight: 600 }} align="center">Days</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                  </>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {reportData.map((row, index) => (
                <TableRow key={index} hover>
                  {activeTab === 0 && (
                    <>
                      <TableCell sx={{ fontWeight: 500 }}>{row.employee_code}</TableCell>
                      <TableCell>{row.name}</TableCell>
                      <TableCell>{row.department}</TableCell>
                      <TableCell align="center">{row.present}</TableCell>
                      <TableCell align="center">{row.absent}</TableCell>
                      <TableCell align="center">{row.late}</TableCell>
                      <TableCell align="center">{row.halfDay}</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600 }}>{row.totalHours} hrs</TableCell>
                    </>
                  )}
                  {activeTab === 1 && (
                    <>
                      <TableCell sx={{ fontWeight: 500 }}>{row.employee_code}</TableCell>
                      <TableCell>{row.name}</TableCell>
                      <TableCell>{row.department}</TableCell>
                      <TableCell>{row.designation}</TableCell>
                      <TableCell>{row.joining_date}</TableCell>
                      <TableCell sx={{ color: row.status === 'Active' ? 'success.main' : 'text.disabled', fontWeight: 600 }}>
                        {row.status}
                      </TableCell>
                    </>
                  )}
                  {activeTab === 2 && (
                    <>
                      <TableCell sx={{ fontWeight: 500 }}>{row.employee_code}</TableCell>
                      <TableCell>{row.name}</TableCell>
                      <TableCell>{row.leave_type}</TableCell>
                      <TableCell>{row.start_date}</TableCell>
                      <TableCell>{row.end_date}</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 600 }}>{row.applied_days}</TableCell>
                      <TableCell sx={{
                        color: row.status === 'APPROVED' ? 'success.main' : row.status === 'REJECTED' ? 'error.main' : 'warning.main',
                        fontWeight: 600
                      }}>
                        {row.status}
                      </TableCell>
                    </>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Paper sx={{ p: 4, textAlign: 'center', color: 'text.secondary', borderRadius: '12px' }}>
          No records matching the selected filters. Click "Generate" to pull report previews.
        </Paper>
      )}
    </Box>
  );
};

export default Reports;

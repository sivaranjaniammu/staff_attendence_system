import api from './api';

/**
 * Helper to download binary files (blobs) via Axios
 */
const downloadFile = async (endpoint, params, filename) => {
  try {
    const response = await api.get(endpoint, {
      params,
      responseType: 'blob'
    });
    
    // Create download link element in DOM
    const blob = new Blob([response]);
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    
    // Clean up
    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Failed to download report file:', error);
    throw error;
  }
};

/**
 * Frontend Report Services
 */
const reportService = {
  // JSON Previews Data Fetchers
  getAttendanceJSON: (params) => api.get('/reports/attendance', { params }),
  getStaffJSON: (params) => api.get('/reports/staff', { params }),
  getLeavesJSON: (params) => api.get('/reports/leaves', { params }),

  // PDF Download Trigger Actions
  downloadAttendancePDF: (params) => downloadFile('/reports/attendance/pdf', params, 'attendance_report.pdf'),
  downloadStaffPDF: (params) => downloadFile('/reports/staff/pdf', params, 'staff_report.pdf'),
  downloadLeavesPDF: (params) => downloadFile('/reports/leaves/pdf', params, 'leave_report.pdf'),

  // Excel Download Trigger Actions
  downloadAttendanceExcel: (params) => downloadFile('/reports/attendance/excel', params, 'attendance_report.xlsx'),
  downloadStaffExcel: (params) => downloadFile('/reports/staff/excel', params, 'staff_report.xlsx'),
  downloadLeavesExcel: (params) => downloadFile('/reports/leaves/excel', params, 'leave_report.xlsx')
};

export default reportService;

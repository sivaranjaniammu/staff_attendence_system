import api from './api';

/**
 * Frontend Leave Request Services
 */
const leaveService = {
  /**
   * Apply for a new leave request (Staff only)
   * POST /api/leaves
   */
  applyLeave: (data) => api.post('/leaves', data),

  /**
   * Fetch all leave requests (Admin gets all, Staff gets own)
   * GET /api/leaves
   */
  getLeaves: (params) => api.get('/leaves', { params }),

  /**
   * Fetch details of a single leave request
   * GET /api/leaves/:id
   */
  getLeaveById: (id) => api.get(`/leaves/${id}`),

  /**
   * Update status of a leave request (Approve/Reject) (Admin only)
   * PATCH /api/leaves/:id/status
   */
  updateLeaveStatus: (id, status, remarks) => api.patch(`/leaves/${id}/status`, { status, remarks })
};

export default leaveService;

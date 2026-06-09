import api from './api';

/**
 * Frontend Staff CRUD Services
 */
const staffService = {
  /**
   * Fetch all staff members
   * GET /api/staff
   */
  getAllStaff: (params) => api.get('/staff', { params }),

  /**
   * Fetch single staff member details
   * GET /api/staff/:id
   */
  getStaffById: (id) => api.get(`/staff/${id}`),

  /**
   * Create a new staff member profile and credentials
   * POST /api/staff
   */
  createStaff: (data) => api.post('/staff', data),

  /**
   * Update an existing staff profile
   * PUT /api/staff/:id
   */
  updateStaff: (id, data) => api.put(`/staff/${id}`, data),

  /**
   * Delete staff profile and credentials
   * DELETE /api/staff/:id
   */
  deleteStaff: (id) => api.delete(`/staff/${id}`)
};

export default staffService;

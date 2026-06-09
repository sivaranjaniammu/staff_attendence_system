import api from './api';

/**
 * Frontend Department CRUD Services
 */
const departmentService = {
  /**
   * Fetch all departments
   * GET /api/departments
   */
  getAllDepartments: () => api.get('/departments'),

  /**
   * Fetch a single department by id
   * GET /api/departments/:id
   */
  getDepartmentById: (id) => api.get(`/departments/${id}`),

  /**
   * Create a new department
   * POST /api/departments
   */
  createDepartment: (data) => api.post('/departments', data),

  /**
   * Update an existing department
   * PUT /api/departments/:id
   */
  updateDepartment: (id, data) => api.put(`/departments/${id}`, data),

  /**
   * Delete a department by id
   * DELETE /api/departments/:id
   */
  deleteDepartment: (id) => api.delete(`/departments/${id}`)
};

export default departmentService;

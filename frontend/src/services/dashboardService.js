import api from './api';

/**
 * Frontend Dashboard Statistics Services
 */
const dashboardService = {
  /**
   * Fetch daily system aggregate counts for admin charts
   * Endpoint: GET /api/dashboard/stats
   */
  getStats: () => api.get('/dashboard/stats')
};

export default dashboardService;

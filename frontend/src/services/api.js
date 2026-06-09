import axios from 'axios';

// Create Axios Instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Outbound Request Interceptor (Inject auth headers)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Inbound Response Interceptor (Handle errors central)
api.interceptors.response.use(
  (response) => {
    // Return standard success response data
    return response.data;
  },
  (error) => {
    const customError = {
      message: 'Network error occurred or server did not respond',
      statusCode: 500,
      errors: null
    };

    if (error.response) {
      // Server responded with an error code
      customError.message = error.response.data.message || customError.message;
      customError.statusCode = error.response.status;
      customError.errors = error.response.data.errors || null;
      
      // Auto logout/redirect on session expiry
      if (error.response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // Redirect can be handled in router or via custom event dispatching
        window.dispatchEvent(new Event('auth_expired'));
      }
    }
    
    return Promise.reject(customError);
  }
);

export default api;

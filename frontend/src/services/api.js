import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

let store;

// Function to get store - loaded lazily to avoid circular dependencies
const getStore = async () => {
  if (!store) {
    const storeModule = await import('../store');
    store = storeModule.default;
  }
  return store;
};

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
apiClient.interceptors.request.use(
  async (config) => {
    try {
      const storeInstance = await getStore();
      const token = storeInstance.getState().auth.token;

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (e) {
      // Store not available yet
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      try {
        const storeInstance = await getStore();
        const { logout } = await import('../slices/authSlice');
        storeInstance.dispatch(logout());
        window.location.href = '/login';
      } catch (e) {
        // Error handling
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;

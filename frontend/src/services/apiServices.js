import apiClient from './api';

export const authAPI = {
  signup: (data) => apiClient.post('/auth/signup', data),
  login: (data) => apiClient.post('/auth/login', data),
};

export const userAPI = {
  getCurrentUser: () => apiClient.get('/users/me'),
  updateProfile: (data) => apiClient.put('/users/me', data),
  getAllUsers: (params) => apiClient.get('/users', { params }),
};

export const waterUsageAPI = {
  addUsage: (data) => apiClient.post('/water-usage', data),
  getMyUsage: (params) => apiClient.get('/water-usage/my', { params }),
  getAnalytics: (params) => apiClient.get('/water-usage/analytics/my', { params }),
  getAllUsage: (params) => apiClient.get('/water-usage', { params }),
  getSystemAnalytics: () => apiClient.get('/water-usage/analytics/system'),
};

export default {
  authAPI,
  userAPI,
  waterUsageAPI,
};

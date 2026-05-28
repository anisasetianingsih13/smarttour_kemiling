import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_GATEWAY_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Otomatis sisipkan token ke setiap request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('cms_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Jika token expired / 401, redirect ke login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('cms_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

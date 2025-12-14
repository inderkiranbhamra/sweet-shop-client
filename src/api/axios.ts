import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api', // Points to your Node.js server
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor: Add Token to every request automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
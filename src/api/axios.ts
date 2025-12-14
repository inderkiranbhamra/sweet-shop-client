import axios from 'axios';

const api = axios.create({
  baseURL: 'https://sweet-shop-api.vercel.app/api', // Points to your Node.js server
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
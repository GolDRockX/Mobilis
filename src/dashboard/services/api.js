import axios from 'axios';

// In local dev: VITE_API_URL is unset, so baseURL stays '/api' and Vite's proxy
// forwards it to localhost:5001 exactly as before — nothing changes locally.
// In production (Vercel): set VITE_API_URL to your deployed Render backend URL,
// e.g. https://mobilis-backend.onrender.com/api
const baseURL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({ baseURL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default api;

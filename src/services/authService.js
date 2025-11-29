// authService.js
import api from './api';

export const authService = {
  login: async ({ username, password }) => {
    // Dùng URL đầy đủ '/api/auth/admin/login'
    const { data } = await api.post('/api/auth/admin/login', { username, password });
    localStorage.setItem('token', data.token);
    localStorage.setItem('role', 'admin');
    return data.token;
  }
};

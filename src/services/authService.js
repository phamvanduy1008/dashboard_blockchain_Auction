import api from './api';

export const authService = {
  login: async ({ username, password }) => {
    const { data } = await api.post('/admin/login_admin', { username, password });
    localStorage.setItem('token', data.token);
    localStorage.setItem('role', 'ADMIN');
    return data.token;
  }
};

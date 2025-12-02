import api from './api'; 

export const userService = {
  // GET /api/admin/users
  getUsers: async ({ page = 1, limit = 20, q = '', status, role } = {}) => {
    const params = { page, limit, q, status, role };
    const { data } = await api.get('/admin/users', { params });
    return data;
  },

  // GET /api/admin/users/:id
  getUser: async (userId) => {
    const { data } = await api.get(`/admin/users/${userId}`);
    return data;
  },

  // PUT /api/admin/users/:id
  updateUser: async (userId, updates) => {
    const { data } = await api.put(`/admin/users/${userId}`, updates);
    return data;
  },

  // POST /api/admin/users/:id/reset-password
  resetPassword: async (userId, newPassword) => {
    const { data } = await api.post(`/admin/users/${userId}/reset-password`, { new_password: newPassword });
    return data;
  },

  // PATCH /api/admin/users/:id/status
  setStatus: async (userId, status) => {
    const { data } = await api.patch(`/admin/users/${userId}/status`, { status });
    return data;
  },

  // PATCH /api/admin/users/:id/role
  setRole: async (userId, role) => {
    const { data } = await api.patch(`/admin/users/${userId}/role`, { role });
    return data;
  },

  // GET /api/admin/users/:id/history
  getHistory: async (userId, { type = 'all', page = 1, limit = 20 } = {}) => {
    const params = { type, page, limit };
    const { data } = await api.get(`/admin/users/${userId}/history`, { params });
    return data;
  }
};
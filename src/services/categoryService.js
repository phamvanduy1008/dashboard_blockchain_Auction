import api from './api';

export const categoryService = {
	getAll: async () => {
		try {
			const { data } = await api.get('/categories');
			return data?.data ?? [];
		} catch (error) {
			console.error("Lỗi khi lấy danh mục:", error);
			throw error;
		}
	},

	create: async (payload) => {
		try {
			const { data } = await api.post('/categories', payload);
			return data?.data ?? data; 
		} catch (error) {
			console.error("Lỗi khi tạo danh mục:", error);
			throw error;
		}
	},
	 update: async (id, payload) => {
    try {
      const { data } = await api.patch(`/categories/${id}`, payload);
      return data.data;	
    } catch (error) {
      console.error('Lỗi cập nhật danh mục:', error.response ? error.response.data : error.message);
      throw error;
    }
  },

 	 remove: async (id) => {
    try {
      await api.delete(`/categories/${id}`);
      return { success: true, message: 'Xóa danh mục thành công' };
    } catch (error) {
      console.error('Lỗi xóa danh mục:', error.response ? error.response.data : error.message);
      throw error;
    }
  },
};

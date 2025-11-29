import api from './api';

export const productService = {
	getAll: async () => {
		try {
			const { data } = await api.get('/products');
			return data?.data ?? [];
		} catch (error) {
			console.error('Lỗi khi lấy sản phẩm:', error);
			throw error;
		}
	},

	create: async (payload) => {
		try {
			const { data } = await api.post('/products', payload);
			return data?.data ?? data;
		} catch (error) {
			console.error('Lỗi khi tạo sản phẩm:', error);
			throw error;
		}
	},

	update: async (_id, payload) => {
	try {
		const { data } = await api.patch(`/products/${_id}`, payload);
		return data.data;
	} catch (error) {
		console.error('Lỗi khi cập nhật sản phẩm:', error.response?.data || error.message);
		throw error;
	}
	},

	delete: async (id) => {
		try {
			await api.delete(`/products/${id}`);
			return { success: true, message: 'Xóa sản phẩm thành công' };
		} catch (error) {
			console.error('Lỗi khi xóa sản phẩm:', error.response?.data || error.message);
			throw error;
		}
	},
};

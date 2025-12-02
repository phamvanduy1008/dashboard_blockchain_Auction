import api from './api';

export const auctionService = {
	listAuctions: async ({ status, page = 1, limit = 20 } = {}) => {
		const params = { page, limit };
		if (status) params.status = status;
		const { data } = await api.get('/admin/auctions', { params });
		return data;
	},

	getAuctionById: async (id) => {
		const { data } = await api.get(`/admin/auctions/${id}`);
		return data;
	},

	approveAuction: async (id) => {
		const { data } = await api.post(`/admin/auctions/${id}/approve`);
		return data;
	},

	rejectAuction: async (id, reason) => {
		const { data } = await api.post(`/admin/auctions/${id}/reject`, { reason });
		return data;
	},

	deployAuction: async (id) => {
		const { data } = await api.post(`/admin/auctions/${id}/deploy`);
		return data;
	},

	startAuction: async (id) => {
		const { data } = await api.post(`/admin/auctions/${id}/start`);
		return data;
	},

	endAuction: async (id) => {
		const { data } = await api.post(`/admin/auctions/${id}/end`);
		return data;
	},

	settleAuction: async (id) => {
		const { data } = await api.post(`/admin/auctions/${id}/settle`);
		return data;
	},
//Newly added methods for dashboard stats
	getDashboardStats: async () => {
		const { data } = await api.get('/admin/dashboard/stats');
		return data;
	},

	getVolumeByMonth: async ({ year = new Date().getFullYear() } = {}) => {
		const { data } = await api.get(`/admin/dashboard/volume-by-month?year=${year}`);
		return data;
	},

	getAuctionStatusCounts: async () => {
		const { data } = await api.get('/admin/dashboard/status-counts');
		return data;
	},

	getTopBidders: async ({ limit = 5 } = {}) => {
		const { data } = await api.get(`/admin/dashboard/top-bidders?limit=${limit}`);
		return data;
	}
};

export default auctionService;


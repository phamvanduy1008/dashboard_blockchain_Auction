import { motion } from "framer-motion";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { useState, useEffect } from "react";
import { auctionService } from "../../services/auctionService"; 

const AuctionStatusChart = () => {
	const [statusData, setStatusData] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchStatusData = async () => {
			try {
				setLoading(true);
				const rawData = await auctionService.getAuctionStatusCounts();
				
				const statusMap = {
					'PENDING_APPROVAL': { name: "Pending", color: "#F59E0B" },
					'APPROVED': { name: "Approved", color: "#3B82F6" },
					'REJECTED': { name: "Rejected", color: "#EF4444" },
					'DEPLOYING': { name: "Deploying", color: "#8B5CF6" },
					'ACTIVE': { name: "Active", color: "#10B981" },
					'ENDED': { name: "Ended", color: "#6B7280" },
					'SETTLED': { name: "Settled", color: "#6366F1" }
				};
				
				const transformedData = Object.entries(rawData)
					.filter(([_, value]) => value > 0) 
					.map(([status, value]) => {
						const info = statusMap[status] || { 
							name: status.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase()), 
							color: "#6B7280" 
						};
						return { name: info.name, value: parseInt(value), color: info.color };
					})
					.sort((a, b) => b.value - a.value); 
				
				setStatusData(transformedData);
			} catch (err) {
				console.error('Status fetch error:', err);
				setError(err.message || 'Failed to fetch status data');
			} finally {
				setLoading(false);
			}
		};

		fetchStatusData();
	}, []);

	if (loading) {
		return (
			<motion.div
				className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 h-96 flex items-center justify-center'
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.3 }}
			>
				<div className='text-gray-400'>Loading status chart...</div>
			</motion.div>
		);
	}

	if (error) {
		return (
			<motion.div
				className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 h-96 flex items-center justify-center'
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.3 }}
			>
				<div className='text-red-400'>Error: {error}</div>
			</motion.div>
		);
	}

	if (statusData.length === 0) {
		return (
			<motion.div
				className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 h-96 flex items-center justify-center'
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.3 }}
			>
				<div className='text-gray-400'>No status data available</div>
			</motion.div>
		);
	}

	return (
		<motion.div
			className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.3 }}
		>
			<h2 className='text-xl font-semibold mb-4 text-gray-100'>
				Auction Status
			</h2>
			<div className='h-80'>
				<ResponsiveContainer width={"100%"} height={"100%"}>
					<PieChart>
						<Pie
							data={statusData}
							cx={"50%"}
							cy={"50%"}
							innerRadius={60}
							outerRadius={100}
							paddingAngle={5}
							dataKey='value'
							label={({ name, value }) => `${name}: ${value}`}
						>
							{statusData.map((entry, index) => (
								<Cell key={`cell-${index}`} fill={entry.color} />
							))}
						</Pie>
						<Tooltip formatter={(value) => `${value} auctions`} />
						<Legend />
					</PieChart>
				</ResponsiveContainer>
			</div>
		</motion.div>
	);
};

export default AuctionStatusChart;

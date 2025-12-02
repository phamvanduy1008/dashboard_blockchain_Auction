import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { auctionService } from "../../services/auctionService"; 

const VolumeOverviewChart = () => {
	const [volumeData, setVolumeData] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchVolumeData = async () => {
			try {
				setLoading(true);
				const rawData = await auctionService.getVolumeByMonth();
				console.log('Raw volume data:', rawData); // Log raw data for debugging
				
				// Transform if data is object with 'months' key, else assume direct array
				let transformedData = [];
				if (rawData && rawData.months && Array.isArray(rawData.months)) {
					// Map months to chart format: { month: "Jan", volume: 12.4 }
					const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
					transformedData = rawData.months.map((monthObj, index) => ({
						month: monthNames[index] || `Month ${index + 1}`,
						volume: parseFloat(monthObj.total_eth || 0) // Use ETH for chart
					}));
				} else if (Array.isArray(rawData)) {
					transformedData = rawData; // Direct array
				} else {
					throw new Error('Invalid volume data format');
				}
				
				console.log('Transformed volumeData:', transformedData); // Log transformed data
				setVolumeData(transformedData);
			} catch (err) {
				console.error('Volume fetch error:', err);
				setError(err.message || 'Failed to fetch volume data');
			} finally {
				setLoading(false);
			}
		};

		fetchVolumeData();
	}, []);

	if (loading) {
		return (
			<motion.div
				className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 h-96 flex items-center justify-center'
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.2 }}
			>
				<div className='text-gray-400'>Loading volume chart...</div>
			</motion.div>
		);
	}

	if (error) {
		return (
			<motion.div
				className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 h-96 flex items-center justify-center'
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.2 }}
			>
				<div className='text-red-400'>Error: {error}</div>
			</motion.div>
		);
	}

	if (volumeData.length === 0) {
		return (
			<motion.div
				className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 h-96 flex items-center justify-center'
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.2 }}
			>
				<div className='text-gray-400'>No volume data available</div>
			</motion.div>
		);
	}

	return (
		<motion.div
			className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.2 }}
		>
			<h2 className='text-xl font-semibold mb-4 text-gray-100'>
				Monthly Auction Volume (ETH)
			</h2>

			<div className='h-80'>
				<ResponsiveContainer width={"100%"} height={"100%"}>
					<LineChart data={volumeData}>
						<CartesianGrid strokeDasharray='3 3' stroke='#4B5563' />
						<XAxis dataKey={"month"} stroke='#9ca3af' />
						<YAxis stroke='#9ca3af' />
						<Tooltip
							formatter={(value) => `${value} ETH`}
							contentStyle={{ backgroundColor: "rgba(31, 41, 55, 0.8)", borderColor: "#4B5563" }}
							itemStyle={{ color: "#E5E7EB" }}
						/>
						<Line
							type='monotone'
							dataKey='volume'
							stroke='#6366F1'
							strokeWidth={4}
							dot={{ fill: "#6366F1", r: 6 }}
							activeDot={{ r: 8 }}
						/>
					</LineChart>
				</ResponsiveContainer>
			</div>
		</motion.div>
	);
};
export default VolumeOverviewChart
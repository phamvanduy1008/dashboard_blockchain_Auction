import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useState, useEffect } from "react";
import { auctionService } from "../../services/auctionService"; 

const TopBiddersChart = () => {
	const [topBidders, setTopBidders] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchTopBidders = async () => {
			try {
				setLoading(true);
				const rawData = await auctionService.getTopBidders({ limit: 5 });
				console.log('Raw top bidders data:', rawData); // Log raw data for debugging
				
				// Extract top_bidders array and transform to chart format: { name, eth }
				let transformedData = [];
				if (rawData && rawData.top_bidders && Array.isArray(rawData.top_bidders)) {
					transformedData = rawData.top_bidders
						// Remove filter to show all, even zero bids
						.map(bidder => ({
							name: `${bidder.username || bidder.full_name?.split(' ')[0] || 'Unknown'}...`, // Shorten name like "user2..."
							eth: parseFloat(bidder.total_eth || 0) // Use total_eth for chart
						}))
						.slice(0, 5); // Ensure top 5
				} else if (Array.isArray(rawData)) {
					transformedData = rawData.slice(0, 5);
				} else {
					throw new Error('Invalid top bidders data format');
				}
				
				console.log('Transformed topBidders:', transformedData); // Log transformed data
				setTopBidders(transformedData);
			} catch (err) {
				console.error('Top bidders fetch error:', err);
				setError(err.message || 'Failed to fetch top bidders');
			} finally {
				setLoading(false);
			}
		};

		fetchTopBidders();
	}, []);

	if (loading) {
		return (
			<motion.div
				className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 lg:col-span-2 border border-gray-700 h-96 flex items-center justify-center'
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.4 }}
			>
				<div className='text-gray-400'>Loading top bidders chart...</div>
			</motion.div>
		);
	}

	if (error) {
		return (
			<motion.div
				className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 lg:col-span-2 border border-gray-700 h-96 flex items-center justify-center'
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.4 }}
			>
				<div className='text-red-400'>Error: {error}</div>
			</motion.div>
		);
	}

	if (topBidders.length === 0) {
		return (
			<motion.div
				className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 lg:col-span-2 border border-gray-700 h-96 flex items-center justify-center'
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.4 }}
			>
				<div className='text-gray-400'>No top bidders data available</div>
			</motion.div>
		);
	}

	return (
		<motion.div
			className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 lg:col-span-2 border border-gray-700'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.4 }}
		>
			<h2 className='text-xl font-semibold mb-4 text-gray-100'>
				Top 5 Sharks (Total ETH bid)
			</h2>

			<div className='h-80'>
				<ResponsiveContainer>
					<BarChart data={topBidders} layout='horizontal'>
						<CartesianGrid strokeDasharray='3 3' stroke='#4B5563' />
						<XAxis dataKey='name' stroke='#9CA3AF' />
						<YAxis stroke='#9CA3AF' />
						<Tooltip formatter={(value) => `${value} ETH`} />
						<Bar dataKey='eth' fill='#8B5CF6' radius={[8, 8, 0, 0]} />
					</BarChart>
				</ResponsiveContainer>
			</div>
		</motion.div>
	);
};
export default TopBiddersChart;
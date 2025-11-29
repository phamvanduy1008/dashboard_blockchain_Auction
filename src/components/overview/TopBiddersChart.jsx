import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const topBidders = [
	{ name: "0x91ab...cD3f", eth: 48.2 },
	{ name: "0xF4e2...9aB1", eth: 35.7 },
	{ name: "0x8Bc1...eE4d", eth: 29.4 },
	{ name: "0x2fF9...dA22", eth: 22.8 },
	{ name: "0x77aD...1fF0", eth: 19.6 },
];

const TopBiddersChart = () => {
	return (
		<motion.div
			className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 lg:col-span-2 border border-gray-700'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.4 }}
		>
			<h2 className='text-xl font-semibold mb-4 text-gray-100'>
				Top 5 Cá Mập (Tổng ETH đã bid)
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
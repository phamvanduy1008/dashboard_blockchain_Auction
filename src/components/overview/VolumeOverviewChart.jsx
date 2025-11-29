import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";

const volumeData = [
	{ month: "Jul", volume: 12.4 },
	{ month: "Aug", volume: 19.2 },
	{ month: "Sep", volume: 28.7 },
	{ month: "Oct", volume: 35.1 },
	{ month: "Nov", volume: 52.8 },
	{ month: "Dec", volume: 78.3 },
	{ month: "Jan", volume: 94.2 },
];

const VolumeOverviewChart = () => {
	return (
		<motion.div
			className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.2 }}
		>
			<h2 className='text-xl font-semibold mb-4 text-gray-100'>
				Volume Đấu Giá Theo Tháng (ETH)
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
export default VolumeOverviewChart;
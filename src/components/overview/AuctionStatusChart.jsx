import { motion } from "framer-motion";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

const statusData = [
	{ name: "Đang diễn ra", value: 42, color: "#10B981" },
	{ name: "Đã kết thúc", value: 158, color: "#6366F1" },
	{ name: "Chưa có bid", value: 23, color: "#F59E0B" },
];

const AuctionStatusChart = () => {
	return (
		<motion.div
			className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.3 }}
		>
			<h2 className='text-xl font-semibold mb-4 text-gray-100'>
				Trạng Thái Phiên Đấu Giá
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
						<Tooltip formatter={(value) => `${value} phiên`} />
						<Legend />
					</PieChart>
				</ResponsiveContainer>
			</div>
		</motion.div>
	);
};
export default AuctionStatusChart;
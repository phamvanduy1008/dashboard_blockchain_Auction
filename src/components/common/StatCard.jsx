import { motion } from "framer-motion";

const StatCard = ({ name, icon: Icon, value, color }) => {
	return (
		<motion.button
			className='bg-[#1f2937] border border-[#374151] rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-5'
			whileHover={{ y: -4 }}
		>
			<div className='flex items-center gap-2 text-sm text-gray-400 mb-2'>
				{Icon && <Icon size={18} style={{ color }} />}
				<span>{name}</span>
			</div>
			{value && (
				<p className='text-lg font-semibold text-white leading-snug'>
					{value}
				</p>
			)}
		</motion.button>
	);
};

export default StatCard;

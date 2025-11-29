import { BarChart2, Users, Timer, Gavel } from "lucide-react";
import { motion } from "framer-motion";

import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";
import VolumeOverviewChart from "../components/overview/VolumeOverviewChart";
import AuctionStatusChart from "../components/overview/AuctionStatusChart";
import TopBiddersChart from "../components/overview/TopBiddersChart";

const OverviewPage = () => {
	return (
		<div className='flex-1 overflow-auto relative z-10'>
			<Header title='Auction Dashboard Overview' />

			<main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
				{/* STATS - 4 Ô CHÍNH */}
				<motion.div
					className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8'
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 1 }}
				>
					<StatCard 
						name='Total Volume ETH' 
						icon={Gavel} 
						value='247.8 ETH' 
						color='#6366F1' 
					/>
					<StatCard 
						name='Activeưu Auctions' 
						icon={Timer} 
						value='42' 
						color='#10B981' 
					/>
					<StatCard 
						name='Active Bidders' 
						icon={Users} 
						value='189' 
						color='#8B5CF6' 
					/>
					<StatCard 
						name='Avg. Bid Increment' 
						icon={BarChart2} 
						value='+37.8%' 
						color='#F59E0B' 
					/>
				</motion.div>

				{/* CHARTS */}
				<div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
					<VolumeOverviewChart />
					<AuctionStatusChart />
					<TopBiddersChart />
				</div>
			</main>
		</div>
	);
};
export default OverviewPage;
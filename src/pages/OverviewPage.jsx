import { BarChart2, Users, Timer, Gavel } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";
import VolumeOverviewChart from "../components/overview/VolumeOverviewChart";
import AuctionStatusChart from "../components/overview/AuctionStatusChart";
import TopBiddersChart from "../components/overview/TopBiddersChart";
import { auctionService } from "../services/auctionService"; 

const OverviewPage = () => {
	const [stats, setStats] = useState({
		totalVolume: '0 ETH',
		activeAuctions: 0,
		activeBidders: 0,
		avgBidIncrement: '+0%'
	});
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchStats = async () => {
			try {
				setLoading(true);
				const data = await auctionService.getDashboardStats();
				setStats({
					totalVolume: `${data.total_volume_eth} ETH`,
					activeAuctions: data.active_auctions,
					activeBidders: data.num_bidders	,
					avgBidIncrement: `+${data.average_increase_percent}%`
				});
			} catch (err) {
				setError(err.message || 'Failed to fetch dashboard stats');
			} finally {
				setLoading(false);
			}
		};

		fetchStats();
	}, []);

	if (loading) {
		return (
			<div className='flex-1 overflow-auto relative z-10'>
				<Header title='Auction Dashboard Overview' />
				<main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
					<div className='flex justify-center items-center h-64'>
						<div className='text-gray-400'>Loading dashboard...</div>
					</div>
				</main>
			</div>
		);
	}

	if (error) {
		return (
			<div className='flex-1 overflow-auto relative z-10'>
				<Header title='Auction Dashboard Overview' />
				<main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
					<div className='flex justify-center items-center h-64'>
						<div className='text-red-400'>Error: {error}</div>
					</div>
				</main>
			</div>
		);
	}

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
						value={stats.totalVolume} 
						color='#6366F1' 
					/>
					<StatCard 
						name='Active Auctions' 
						icon={Timer} 
						value={stats.activeAuctions} 
						color='#10B981' 
					/>
					<StatCard 
						name='Active Bidders' 
						icon={Users} 
						value={stats.activeBidders} 
						color='#8B5CF6' 
					/>
					<StatCard 
						name='Avg. Bid Increment' 
						icon={BarChart2} 
						value={stats.avgBidIncrement} 
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
import { motion } from "framer-motion";
import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";
import UsersTable from "../components/users/UsersTable";

import { UsersIcon, UserPlus, UserCheck, UserX, Wallet } from "lucide-react";

const usersData = [
	{
		id: "1",
		username: "alice",
		ethAddress: "0xC45fb63d518B45C6a1234567890abcdef123456",
		joinedDate: "2025-03-15",
		auctionsCreated: 12,
		totalBidAmount: "285.7",
		wins: 5,
		status: "active", 
	},
	{
		id: "2",
		username: "bob_whale",
		ethAddress: "0x91ab3f1c2d4e5f67890abcdef1234567890abc",
		joinedDate: "2025-01-20",
		auctionsCreated: 3,
		totalBidAmount: "1240.3",
		wins: 8,
		status: "active",
	},
	{
		id: "3",
		username: "spammer_xxx",
		ethAddress: "0xF4e29aB1cD3f8e2a1b3c4d5e6f789012345678",
		joinedDate: "2025-11-01",
		auctionsCreated: 45,
		totalBidAmount: "12.1",
		wins: 0,
		status: "banned",
	},
];

const UsersPage = () => {
	const stats = {
		totalUsers: usersData.length,
		activeUsers: usersData.filter(u => u.status === "active").length,
		newThisWeek: 24,
		topWhaleBid: "1,240.3 ETH",
	};

	return (
		<div className='flex-1 overflow-auto relative z-10'>
			<Header title='Users Management' />

			<main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
				{/* STATS */}
				<motion.div
					className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8'
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 1 }}
				>
					<StatCard name='Total Users' icon={UsersIcon} value={stats.totalUsers} color='#6366F1' />
					<StatCard name='Active Users' icon={UserCheck} value={stats.activeUsers} color='#10B981' />
					<StatCard name='New This Week' icon={UserPlus} value={stats.newThisWeek} color='#F59E0B' />
					<StatCard name='Top Whale Bid' icon={Wallet} value={`${stats.topWhaleBid} ETH`} color='#8B5CF6' />
				</motion.div>

				<UsersTable users={usersData} />
			</main>
		</div>
	);
};

export default UsersPage;
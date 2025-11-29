import { motion } from "framer-motion";
import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";

import { Gavel, Timer, DollarSign, AlertCircle } from "lucide-react";
import AuctionsTable from "../components/auctions/AuctionsTable";

const auctionsData = [
	{
		id: "1",
		title: "CryptoPunk #7804",
		image: "https://i.seadn.io/gae/bwAJyq4G5zO7z9k9bZ1q9h9t5j1k8o9p0q2w3e4r5t6y7u8i9o0p1q2w3e4r5t6y7u8i9o0p1q2w3e4r5t6y7u8i9o0p1q2w3e4r5t6y7u8i9o0?auto=format&w=512",
		seller: "alice",
		sellerAddress: "0xC45fb63d...518B45C6",
		currentBid: "85.5",
		highestBidder: "0x91ab...cD3f",
		endTime: Date.now() + 1000 * 60 * 27, // còn 27 phút
		ended: false,
		bidHistory: [
			{ bidder: "0x91ab...cD3f", amount: "85.5", time: "2 mins ago" },
			{ bidder: "0x77aD...1fF0", amount: "82.0", time: "5 mins ago" },
		],
	},
	{
		id: "2",
		title: "BAYC #9999",
		image: "https://i.seadn.io/gae/Ju9CkWtV-1Okvf45wo8NegkdC4XT4fKR7i0mnJ9KZkB0Z7x6b7y8v9w0x1y2z3a4b5c6d7e8f9g0h1i2j3k4l5m6n7o8p9q0r1s2t3u4v5w6x7y8z9?auto=format&w=512",
		seller: "vitalik",
		sellerAddress: "0xAb5801a7...D5aB",
		currentBid: "92.1",
		highestBidder: "0xF4e2...9aB1",
		endTime: Date.now() - 1000 * 60 * 60 * 2,
		ended: true,
		bidHistory: [
			{ bidder: "0xF4e2...9aB1", amount: "92.1", time: "2 hours ago" },
		],
	},
];

const AuctionsPage = () => {
	return (
		<div className='flex-1 overflow-auto relative z-10'>
			<Header title='Auctions Management' />

			<main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
				{/* STATS */}
				<motion.div
					className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8'
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 1 }}
				>
					<StatCard name='Total Auctions' icon={Gavel} value='1,843' color='#6366F1' />
					<StatCard name='Active Auctions' icon={Timer} value='68' color='#10B981' />
					<StatCard name='Total Volume' icon={DollarSign} value='2,847.3 ETH' color='#F59E0B' />
					<StatCard name='Ending Soon' icon={AlertCircle} value='12' color='#EF4444' />
				</motion.div>

				<AuctionsTable auctions={auctionsData} />
			</main>
		</div>
	);
};

export default AuctionsPage;
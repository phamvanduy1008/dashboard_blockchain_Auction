import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";

import { Gavel, Timer, DollarSign, AlertCircle } from "lucide-react";
import AuctionsTable from "../components/auctions/AuctionsTable";
import { auctionService } from "../services/auctionService"; 
import { formatDistanceToNow, isValid, parseISO } from "date-fns";

const EXCHANGE_RATE_ETH_TO_VND = 50000000; // 1 ETH = 50,000,000 VND

const formatVnd = (amount) => {
  if (!amount || amount === 0) return "0 ₫";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const vndToEth = (vndAmount) => {
  if (!vndAmount || vndAmount <= 0) return 0;
  return (vndAmount / EXCHANGE_RATE_ETH_TO_VND).toFixed(6);
};

const formatEth = (ethAmount) => {
  if (!ethAmount || ethAmount === 0) return "0 ETH";
  const formatted = parseFloat(ethAmount).toFixed(6).replace(/0+$/, '').replace(/\.$/, '');
  return `${formatted} ETH`;
};

const formatPrice = (priceVnd) => {
  if (!priceVnd || isNaN(parseFloat(priceVnd))) return { vnd: '0 ₫', eth: '0 ETH' };
  const eth = vndToEth(priceVnd);
  return {
    vnd: formatVnd(priceVnd),
    eth: formatEth(eth)
  };
};

const AuctionsPage = () => {
	const [auctions, setAuctions] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchAuctions = async () => {
			try {
				setLoading(true);
				const data = await auctionService.listAuctions({ status: null, page: 1, limit: 100 }); 
				setAuctions(data.auctions || data); 
			} catch (err) {
				setError(err.message || 'Failed to fetch auctions');
			} finally {
				setLoading(false);
			}
		};

		fetchAuctions();
	}, []);

	const getEndDate = (endTime) => {
		if (!endTime) return null;
		let date;
		if (typeof endTime === 'number') {
			date = new Date(endTime);
		} else if (typeof endTime === 'string') {
			date = parseISO(endTime);
			if (!isValid(date)) {
				date = new Date(endTime);
			}
		} else {
			return null;
		}
		return isValid(date) ? date : null;
	};

	const isEnded = (auction) => {
		return auction.status === 'ENDED' || auction.status === 'SETTLED' || getEndDate(auction.end_time)?.getTime() < Date.now();
	};

	const totalAuctions = auctions.length;
	const activeAuctions = auctions.filter(a => !isEnded(a)).length;
	const totalVolumeVnd = auctions.reduce((sum, a) => sum + (parseFloat(a.current_price_vnd) || 0), 0);
	const totalVolumeInfo = formatPrice(totalVolumeVnd);
	const endingSoon = auctions.filter(a => 
		!isEnded(a) && getEndDate(a.end_time) && Date.now() > getEndDate(a.end_time).getTime() - 5 * 60 * 1000
	).length;

	if (loading) {
		return (
			<div className='flex-1 overflow-auto relative z-10'>
				<Header title='Auctions Management' />
				<main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
					<div className='flex justify-center items-center h-64'>
						<div className='text-gray-400'>Loading auctions...</div>
					</div>
				</main>
			</div>
		);
	}

	if (error) {
		return (
			<div className='flex-1 overflow-auto relative z-10'>
				<Header title='Auctions Management' />
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
			<Header title='Auctions Management' />

			<main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
				{/* STATS */}
				<motion.div
					className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8'
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 1 }}
				>
					<StatCard name='Total Auctions' icon={Gavel} value={totalAuctions.toLocaleString()} color='#6366F1' />
					<StatCard name='Active Auctions' icon={Timer} value={activeAuctions} color='#10B981' />
					<StatCard name='Total Volume' icon={DollarSign} value={`${totalVolumeInfo.vnd} ≈ ${totalVolumeInfo.eth}`} color='#F59E0B' />
					<StatCard name='Ending Soon' icon={AlertCircle} value={endingSoon} color='#EF4444' />
				</motion.div>

				<AuctionsTable auctions={auctions} />
			</main>
		</div>
	);
};

export default AuctionsPage;
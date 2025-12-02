import { motion } from "framer-motion";
import { Search, AlertTriangle } from "lucide-react";
import { useState } from "react";
import AuctionDetailModal from "../common/AuctionDetailModal";
import toast from "react-hot-toast";
import { formatDistanceToNow, isValid, parseISO } from "date-fns";
import { auctionService } from "../../services/auctionService"; // Adjust path as needed

// Inline conversion utils for frontend (no ethers dependency)
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

const statusOptions = [
  'PENDING_APPROVAL',
  'APPROVED',
  'REJECTED',
  'ACTIVE',
  'ENDED',
  'SETTLED'
];

const AuctionsTable = ({ auctions }) => {
	const [searchTerm, setSearchTerm] = useState("");
	const [filterStatus, setFilterStatus] = useState("all");
	const [selectedAuction, setSelectedAuction] = useState(null);
	const [isModalOpen, setIsModalOpen] = useState(false);

	console.log("🔍 All auctions (props):", auctions); // This should log now

	// Filter theo search và status
	const filteredAuctions = auctions.filter((auction) => {
		const matchesSearch =
			auction.id?.toString().includes(searchTerm) ||
			auction.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
			(auction.seller?.username || auction.seller?.full_name || auction.seller)?.toLowerCase().includes(searchTerm.toLowerCase());
		
		const matchesStatus = filterStatus === 'all' || auction.status === filterStatus;
		
		return matchesSearch && matchesStatus;
	});

	const openModal = async (auction) => {
		console.log('Opening modal for auction:', auction); // Log the auction from list
		try {
			const fetchedAuction = await auctionService.getAuctionById(auction.id);
			console.log('Fetched auction details:', fetchedAuction); // Log fetched data
			setSelectedAuction(fetchedAuction);
		} catch (err) {
			console.error('Error fetching auction details:', err); // Log error
			toast.error('Failed to fetch auction details');
			setSelectedAuction(auction); // Fallback to list data
		}
		setIsModalOpen(true);
	};

	const closeModal = () => {
		setIsModalOpen(false);
		setSelectedAuction(null);
	};

	const handleForceEnd = async (id) => {
		if (confirm(`Force end auction #${id}?`)) {
			try {
				await auctionService.endAuction(id);
				toast.success(`Auction #${id} đã được admin kết thúc!`);
				closeModal();
				// Optionally refresh data here by calling a refresh prop or global state
			} catch (err) {
				toast.error('Failed to end auction');
			}
		}
	};

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

	const getTimeLeft = (endTime, status) => {
		if (status === 'PENDING_APPROVAL') return 'Pending';
		const endDate = getEndDate(endTime);
		if (!endDate || endDate < new Date()) return "Expired";
		return formatDistanceToNow(endDate, { addSuffix: true });
	};

	const isEnded = (auction) => {
		return auction.status === 'ENDED' || auction.status === 'SETTLED';
	};

	const getStatusBadge = (auction) => {
		const status = auction.status;
		let color = 'bg-gray-600';
		let text = status || 'Unknown';
		let animation = '';

		switch (status) {
			case 'PENDING_APPROVAL':
				color = 'bg-yellow-600';
				text = 'Pending';
				break;
			case 'APPROVED':
				color = 'bg-blue-600';
				text = 'Approved';
				break;
			case 'REJECTED':
				color = 'bg-red-600';
				text = 'Rejected';
				break;
			case 'DEPLOYING':
				color = 'bg-purple-600';
				text = 'Deploying';
				break;
			case 'ACTIVE':
				color = 'bg-green-600';
				text = 'Active';
				const endDate = getEndDate(auction.end_time);
				if (endDate && Date.now() > endDate.getTime() - 5 * 60 * 1000) {
					color = 'bg-red-600';
					text = 'Ending Soon';
					animation = 'animate-pulse';
				}
				break;
			case 'ENDED':
				color = 'bg-gray-600';
				text = 'Ended';
				break;
			case 'SETTLED':
				color = 'bg-indigo-600';
				text = 'Settled';
				break;
		}

		return <span className={`px-3 py-1 text-xs rounded-full ${color} text-white ${animation}`}>{text}</span>;
	};

	const getSellerName = (seller) => {
		if (!seller) return 'Unknown';
		return seller.full_name || seller.username || seller || 'Unknown';
	};

	const formatPrice = (priceVnd) => {
		if (!priceVnd || isNaN(parseFloat(priceVnd))) return { vnd: '0 ₫', eth: '0 ETH' };
		const eth = vndToEth(priceVnd);
		return {
			vnd: formatVnd(priceVnd),
			eth: formatEth(eth)
		};
	};

	return (
		<>
			<motion.div
				className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700'
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.2 }}
			>
				<div className='flex justify-between items-center mb-6'>
					<h2 className='text-xl font-semibold text-gray-100'>All Auctions</h2>
					<div className='flex items-center gap-4'>
						<div className='relative'>
							<input
								type='text'
								placeholder='Search by ID, title, seller...'
								className='bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-64'
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
							/>
							<Search className='absolute left-3 top-2.5 text-gray-400' size={18} />
						</div>
						<select 
							value={filterStatus} 
							onChange={e => setFilterStatus(e.target.value)}
							className='bg-gray-700 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500'
						>
							<option value='all'>All Status</option>
							{statusOptions.map(status => (
								<option key={status} value={status}>
									{status.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}
								</option>
							))}
						</select>
					</div>
				</div>

				<div className='overflow-x-auto'>
					<table className='min-w-full divide-y divide-gray-700'>
						<thead>
							<tr>
								<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>Item</th>
								<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>Seller</th>
								<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>Current Price</th>
								<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>Time Left</th>
								<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>Status</th>
								<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>Actions</th>
							</tr>
						</thead>
						<tbody className='divide-y divide-gray-700'>
							{filteredAuctions.length === 0 ? (
								<tr>
									<td colSpan={6} className='px-6 py-4 text-center text-gray-400'>
										No auctions found.
									</td>
								</tr>
							) : (
								filteredAuctions.map((auction) => {
									const priceInfo = formatPrice(auction.current_price_vnd);
									console.log(`Price for auction ${auction.id}:`, priceInfo); // Additional log for price
									return (
										<motion.tr
											key={auction.id}
											className='hover:bg-gray-700 transition cursor-pointer'
											initial={{ opacity: 0 }}
											animate={{ opacity: 1 }}
											onClick={() => openModal(auction)}
										>
											<td className='px-6 py-4'>
												<div className='flex items-center gap-3'>
													<img 
														src={auction.images?.[0] || `https://via.placeholder.com/40?text=${encodeURIComponent(auction.title.substring(0,1))}`} 
														alt={auction.title} 
														className='w-10 h-10 rounded-lg object-cover border border-gray-600' 
													/>
													<div>
														<div className='font-medium text-white'>{auction.title}</div>
													</div>
												</div>
											</td>
											<td className='px-6 py-4 text-sm text-gray-300'>
												<div>{getSellerName(auction.seller)}</div>
												{auction.sellerAddress && <code className='text-xs text-gray-500 block'>{auction.sellerAddress}</code>}
											</td>
											<td className='px-6 py-4 text-sm font-bold'>
												<div className='space-y-1'>
													<div className='text-green-400'>{priceInfo.vnd}</div>
													<div className='text-orange-400 text-xs'>{priceInfo.eth}</div>
												</div>
											</td>
											<td className='px-6 py-4 text-sm text-gray-300'>
												{getTimeLeft(auction.end_time, auction.status)}
											</td>
											<td className='px-6 py-4 text-sm'>{getStatusBadge(auction)}</td>
											<td className='px-6 py-4 text-sm'>
												{!isEnded(auction) && (
													<button
														onClick={(e) => {
															e.stopPropagation(); // Prevent row click
															handleForceEnd(auction.id);
														}}
														className='text-red-400 hover:text-red-300'
														title='Force End'
													>
														<AlertTriangle size={20} />
													</button>
												)}
											</td>
										</motion.tr>
									);
								})
							)}
						</tbody>
					</table>
				</div>
			</motion.div>

			<AuctionDetailModal
				auction={selectedAuction}
				isOpen={isModalOpen}
				onClose={closeModal}
				onForceEnd={handleForceEnd}
			/>
		</>
	);
};

export default AuctionsTable;
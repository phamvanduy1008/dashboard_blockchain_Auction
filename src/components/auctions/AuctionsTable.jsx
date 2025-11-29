import { motion } from "framer-motion";
import { Search, Eye, AlertTriangle } from "lucide-react";
import { useState } from "react";
import AuctionDetailModal from "../common/AuctionDetailModal";
import toast from "react-hot-toast";
import { formatDistanceToNow } from "date-fns";

const AuctionsTable = ({ auctions }) => {
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedAuction, setSelectedAuction] = useState(null);
	const [isModalOpen, setIsModalOpen] = useState(false);

	// Filter theo search
	const filteredAuctions = auctions.filter((auction) =>
		auction.id.includes(searchTerm) ||
		auction.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
		auction.seller.toLowerCase().includes(searchTerm.toLowerCase())
	);

	const openModal = (auction) => {
		setSelectedAuction(auction);
		setIsModalOpen(true);
	};

	const closeModal = () => {
		setIsModalOpen(false);
		setSelectedAuction(null);
	};

	const handleForceEnd = (id) => {
		if (confirm(`Force end auction #${id}?`)) {
			toast.success(`Auction #${id} đã được admin kết thúc!`);
			closeModal();
			// TODO: gọi API thật
		}
	};

	const getTimeLeft = (endTime) => {
		if (new Date(endTime) < new Date()) return "Đã kết thúc";
		return formatDistanceToNow(endTime, { addSuffix: true });
	};

	const getStatusBadge = (auction) => {
		if (auction.ended)
			return <span className='px-3 py-1 text-xs rounded-full bg-gray-600 text-gray-200'>Ended</span>;
		if (Date.now() > auction.endTime - 5 * 60 * 1000)
			return <span className='px-3 py-1 text-xs rounded-full bg-red-600 text-white animate-pulse'>Ending Soon</span>;
		return <span className='px-3 py-1 text-xs rounded-full bg-green-600 text-white'>Active</span>;
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
				</div>

				<div className='overflow-x-auto'>
					<table className='min-w-full divide-y divide-gray-700'>
						<thead>
							<tr>
								<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>Item</th>
								<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>Seller</th>
								<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>Current Bid</th>
								<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>Time Left</th>
								<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>Status</th>
								<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>Actions</th>
							</tr>
						</thead>
						<tbody className='divide-y divide-gray-700'>
							{filteredAuctions.map((auction) => (
								<motion.tr
									key={auction.id}
									className='hover:bg-gray-700 transition'
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
								>
									<td className='px-6 py-4'>
										<div className='flex items-center gap-3'>
											<img src={auction.image} alt={auction.title} className='w-10 h-10 rounded-lg object-cover border border-gray-600' />
											<div>
												<div className='font-medium text-white'>#{auction.id}</div>
												<div className='text-xs text-gray-400 truncate max-w-40'>{auction.title}</div>
											</div>
										</div>
									</td>
									<td className='px-6 py-4 text-sm text-gray-300'>
										<div>{auction.seller}</div>
										<code className='text-xs text-gray-500'>{auction.sellerAddress}</code>
									</td>
									<td className='px-6 py-4 text-sm font-bold text-indigo-400'>
										{auction.currentBid} ETH
									</td>
									<td className='px-6 py-4 text-sm text-gray-300'>
										{getTimeLeft(auction.endTime)}
									</td>
									<td className='px-6 py-4 text-sm'>{getStatusBadge(auction)}</td>
									<td className='px-6 py-4 text-sm'>
										<button
											onClick={() => openModal(auction)}
											className='text-blue-400 hover:text-blue-300 mr-4'
											title='View Details'
										>
											<Eye size={20} />
										</button>
										{!auction.ended && (
											<button
												onClick={() => handleForceEnd(auction.id)}
												className='text-red-400 hover:text-red-300'
												title='Force End'
											>
												<AlertTriangle size={20} />
											</button>
										)}
									</td>
								</motion.tr>
							))}
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
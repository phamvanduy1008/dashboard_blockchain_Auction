import { motion } from "framer-motion";
import { X, Gavel, User, Trophy, Clock, AlertTriangle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const AuctionDetailModal = ({ auction, isOpen, onClose, onForceEnd }) => {
	if (!isOpen || !auction) return null;

	const timeLeft = auction.ended
		? "Đã kết thúc"
		: formatDistanceToNow(auction.endTime, { addSuffix: true });

	const isEndingSoon = !auction.ended && Date.now() > auction.endTime - 5 * 60 * 1000;

	return (
		<motion.div
			className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm px-4'
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			onClick={onClose}
		>
			<motion.div
				className='bg-gray-800 border border-gray-700 rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto'
				initial={{ scale: 0.9, y: 50 }}
				animate={{ scale: 1, y: 0 }}
				exit={{ scale: 0.9, y: 50 }}
				transition={{ type: "spring", damping: 25, stiffness: 300 }}
				onClick={(e) => e.stopPropagation()}
			>
				{/* Header */}
				<div className='flex justify-between items-start p-6 border-b border-gray-700'>
					<div>
						<h2 className='text-2xl font-bold text-white flex items-center gap-3'>
							<Gavel className='w-8 h-8 text-indigo-400' />
							Auction #{auction.id}
						</h2>
						<p className='text-lg text-gray-300 mt-1'>{auction.title}</p>
					</div>
					<button
						onClick={onClose}
						className='text-gray-400 hover:text-white transition text-3xl leading-none'
					>
						×
					</button>
				</div>

				<div className='p-6'>
					<div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
						{/* Ảnh NFT */}
						<div>
							<img
								src={auction.image || "/api/placeholder/600/600"}
								alt={auction.title}
								className='w-full rounded-xl shadow-xl border border-gray-700 object-cover'
							/>
						</div>

						{/* Thông tin chi tiết */}
						<div className='space-y-6'>
							{/* Current Bid */}
							<div className=' bg-opacity-50 rounded-xl p-6 border border-indigo-700'>
								<p className='text-gray-400 text-sm'>Current Highest Bid</p>
								<div className='text-4xl font-bold text-white flex items-center gap-3 mt-2'>
									<Gavel className='w-10 h-10 text-indigo-400' />
									{auction.currentBid} ETH
								</div>
								{auction.highestBidder && (
									<p className='text-green-400 text-sm mt-2 flex items-center gap-2'>
										<Trophy className='w-5 h-5' />
										by {auction.highestBidder}
									</p>
								)}
							</div>

							{/* Time Left */}
							<div className='flex items-center justify-between bg-gray-900 rounded-xl p-5 border border-gray-700'>
								<div className='flex items-center gap-3'>
									<Clock className={`w-6 h-6 ${isEndingSoon ? "text-red-500 animate-pulse" : "text-gray-400"}`} />
									<span className='text-gray-400'>Time Left</span>
								</div>
								<span className={`font-bold text-lg ${isEndingSoon ? "text-red-500 animate-pulse" : "text-white"}`}>
									{timeLeft}
								</span>
							</div>

							{/* Seller Info */}
							<div className='bg-gray-900 rounded-xl p-5 border border-gray-700'>
								<div className='flex items-center gap-3 text-gray-300'>
									<User className='w-5 h-5' />
									<span>Seller</span>
								</div>
								<p className='font-medium text-white mt-1'>{auction.seller}</p>
								<code className='text-xs bg-gray-800 px-3 py-1 rounded mt-2 block'>
									{auction.sellerAddress}
								</code>
							</div>

							{/* Force End Button */}
							{!auction.ended && (
								<button
									onClick={() => onForceEnd(auction.id)}
									className='w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-xl transition flex items-center justify-center gap-3 text-lg'
								>
									<AlertTriangle className='w-6 h-6' />
									Force End Auction (Admin)
								</button>
							)}

							{auction.ended && (
								<div className='w-full bg-green-900 bg-opacity-30 border border-green-700 rounded-xl p-6 text-center'>
									<Trophy className='w-16 h-16 text-yellow-500 mx-auto mb-3' />
									<p className='text-2xl font-bold text-green-400'>Auction Ended</p>
									<p className='text-green-300 mt-2'>
										Winner: <span className='font-mono'>{auction.highestBidder}</span>
									</p>
								</div>
							)}
						</div>
					</div>

					{/* Bid History */}
					<div className='mt-10'>
						<h3 className='text-xl font-semibold text-white mb-4'>Bid History</h3>
						<div className='bg-gray-900 rounded-xl border border-gray-700 overflow-hidden'>
							{auction.bidHistory && auction.bidHistory.length > 0 ? (
								<table className='w-full'>
									<thead className='bg-gray-800'>
										<tr>
											<th className='px-6 py-3 text-left text-xs font-medium text-gray-400'>Bidder</th>
											<th className='px-6 py-3 text-left text-xs font-medium text-gray-400'>Amount</th>
											<th className='px-6 py-3 text-left text-xs font-medium text-gray-400'>Time</th>
										</tr>
									</thead>
									<tbody className='divide-y divide-gray-700'>
										{auction.bidHistory.map((bid, i) => (
											<tr key={i} className='hover:bg-gray-800 transition'>
												<td className='px-6 py-4 text-sm text-gray-300'>{bid.bidder}</td>
												<td className='px-6 py-4 text-sm font-bold text-indigo-400'>{bid.amount} ETH</td>
												<td className='px-6 py-4 text-sm text-gray-500'>{bid.time || "Just now"}</td>
											</tr>
										))}
									</tbody>
								</table>
							) : (
								<p className='text-center text-gray-500 py-10'>No bids yet</p>
							)}
						</div>
					</div>
				</div>
			</motion.div>
		</motion.div>
	);
};

export default AuctionDetailModal;
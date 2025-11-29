import { motion } from "framer-motion";
import { X, ExternalLink, Copy } from "lucide-react";
import toast from "react-hot-toast";
import { format } from "date-fns";

const EventDetailModal = ({ event, isOpen, onClose }) => {
	if (!isOpen || !event) return null;

	const copyToClipboard = (text) => {
		navigator.clipboard.writeText(text);
		toast.success("Copied!");
	};

	return (
		<motion.div
			className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm px-4 overflow-y-auto'
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			onClick={onClose}
		>
			<motion.div
				className='bg-gray-800 border border-gray-700 rounded-2xl shadow-2xl max-w-4xl w-full my-8'
				initial={{ scale: 0.9, y: 50 }}
				animate={{ scale: 1, y: 0 }}
				exit={{ scale: 0.9, y: 50 }}
				onClick={(e) => e.stopPropagation()}
			>
				{/* Header */}
				<div className='flex justify-between items-center p-6 border-b border-gray-700'>
					<div className='flex items-center gap-4'>
						<span className={`px-4 py-2 rounded-full text-sm font-bold ${
							event.event === "NewBid" ? "bg-indigo-900 text-indigo-300" :
							event.event === "AuctionCreated" ? "bg-green-900 text-green-300" :
							event.event === "AuctionEnded" ? "bg-purple-900 text-purple-300" :
							"bg-orange-900 text-orange-300"
						}`}>
							{event.event}
						</span>
						<h2 className='text-2xl font-bold text-white'>Event Details</h2>
					</div>
					<button onClick={onClose} className='text-gray-400 hover:text-white text-4xl leading-none'>
						&times;
					</button>
				</div>

				<div className='p-6 space-y-6'>
					{/* Tx Hash */}
					<div className='bg-gray-900 rounded-xl p-5 border border-gray-700'>
						<div className='flex justify-between items-center'>
							<div>
								<p className='text-gray-400 text-sm'>Transaction Hash</p>
								<code className='text-lg font-mono text-indigo-400 break-all'>{event.txHash}</code>
							</div>
							<div className='flex gap-2'>
								<button onClick={() => copyToClipboard(event.txHash)} className='p-2 bg-gray-800 rounded hover:bg-gray-700'>
									<Copy size={18} />
								</button>
								<a href={`https://sepolia.etherscan.io/tx/${event.txHash}`} target='_blank' rel='noopener noreferrer'
									className='p-2 bg-gray-800 rounded hover:bg-gray-700'>
									<ExternalLink size={18} className='text-blue-400' />
								</a>
							</div>
						</div>
					</div>

					{/* Info Grid */}
					<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
						<div className='bg-gray-900 rounded-xl p-5 border border-gray-700'>
							<p className='text-gray-400 text-sm'>Auction ID</p>
							<p className='text-3xl font-bold text-white'>#{event.auctionId}</p>
						</div>
						<div className='bg-gray-900 rounded-xl p-5 border border-gray-700'>
							<p className='text-gray-400 text-sm'>From</p>
							<code className='text-sm font-mono text-green-400'>{event.from}</code>
						</div>
						{event.amount && (
							<div className='bg-gray-900 rounded-xl p-5 border border-gray-700'>
								<p className='text-gray-400 text-sm'>Amount</p>
								<p className='text-3xl font-bold text-indigo-400'>{event.amount} ETH</p>
							</div>
						)}
						<div className='bg-gray-900 rounded-xl p-5 border border-gray-700'>
							<p className='text-gray-400 text-sm'>Block</p>
							<p className='text-xl font-bold text-white'>#{event.block}</p>
						</div>
						<div className='bg-gray-900 rounded-xl p-5 border border-gray-700 col-span-2'>
							<p className='text-gray-400 text-sm'>Timestamp</p>
							<p className='text-lg text-gray-300'>
								{format(event.time, "dd MMM yyyy 'at' HH:mm:ss")}
							</p>
						</div>
					</div>

					{/* Raw Data */}
					<div className='bg-gray-900 rounded-xl p-5 border border-gray-700'>
						<h3 className='text-lg font-semibold text-white mb-3'>Raw Event Data</h3>
						<pre className='text-xs text-gray-300 bg-black/50 p-4 rounded-lg overflow-x-auto'>
							{JSON.stringify(event, null, 2)}
						</pre>
					</div>
				</div>
			</motion.div>
		</motion.div>
	);
};

export default EventDetailModal;
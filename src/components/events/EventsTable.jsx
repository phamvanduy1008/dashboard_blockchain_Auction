import { motion } from "framer-motion";
import { Search, ExternalLink, Eye } from "lucide-react";
import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import EventDetailModal from "./EventDetailModal"; 
const SAMPLE_EVENTS = [
	{
		id: 1,
		event: "NewBid",
		auctionId: "42",
		from: "0x91ab...cD3f",
		amount: "85.5",
		txHash: "0xabc123...def456",
		block: 1567,
		time: Date.now() - 1000 * 12,
	},
	{
		id: 2,
		event: "AuctionCreated",
		auctionId: "43",
		from: "0xC45f...b63d",
		amount: "1.0",
		txHash: "0x987654...3210fe",
		block: 1565,
		time: Date.now() - 1000 * 60 * 5,
	},
	{
		id: 3,
		event: "AuctionEnded",
		auctionId: "41",
		from: "0xF4e2...9aB1",
		amount: "92.1",
		txHash: "0x111222...333444",
		block: 1560,
		time: Date.now() - 1000 * 60 * 30,
	},
];

const eventColors = {
	NewBid: "bg-indigo-900 text-indigo-300 border-indigo-700",
	AuctionCreated: "bg-green-900 text-green-300 border-green-700",
	AuctionEnded: "bg-purple-900 text-purple-300 border-purple-700",
	Withdraw: "bg-orange-900 text-orange-300 border-orange-700",
};

const EventsTable = () => {
	const [searchTerm, setSearchTerm] = useState("");
	const [filterEvent, setFilterEvent] = useState("all");
	const [selectedEvent, setSelectedEvent] = useState(null);
	const [isModalOpen, setIsModalOpen] = useState(false);

	const openModal = (event) => {
		setSelectedEvent(event);
		setIsModalOpen(true);
	};

	const filtered = SAMPLE_EVENTS.filter(e => {
		const matchesSearch = e.auctionId.includes(searchTerm) ||
			e.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
			e.txHash.toLowerCase().includes(searchTerm.toLowerCase());
		const matchesFilter = filterEvent === "all" || e.event === filterEvent;
		return matchesSearch && matchesFilter;
	});

	return (
		<>
			<motion.div className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700'
				initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
				
				{/* Header + Filter giữ nguyên */}
				<div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6'>
					<h2 className='text-xl font-semibold text-gray-100'>On-Chain Events</h2>
					<div className='flex gap-3'>
						<select value={filterEvent} onChange={e => setFilterEvent(e.target.value)}
							className='bg-gray-700 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500'>
							<option value='all'>All Events</option>
							<option value='NewBid'>NewBid</option>
							<option value='AuctionCreated'>AuctionCreated</option>
							<option value='AuctionEnded'>AuctionEnded</option>
						</select>
						<div className='relative'>
							<input type='text' placeholder='Search auction ID, address, tx...'
								className='bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-blue-500 w-64'
								value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
							<Search className='absolute left-3 top-2.5 text-gray-400' size={18} />
						</div>
					</div>
				</div>

				<div className='overflow-x-auto'>
					<table className='min-w-full divide-y divide-gray-700'>
						<thead>
							<tr>
								<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase'>Event</th>
								<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase'>Auction ID</th>
								<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase'>From</th>
								<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase'>Amount</th>
								<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase'>Tx Hash</th>
								<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase'>Block</th>
								<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase'>Time</th>
								<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase'>Action</th>
							</tr>
						</thead>
						<tbody className='divide-y divide-gray-700'>
							{filtered.map((e) => (
								<motion.tr key={e.id} className='hover:bg-gray-700 transition'>
									<td className='px-6 py-4'>
										<span className={`px-3 py-1 rounded-full text-xs font-semibold border ${eventColors[e.event] || "bg-gray-900 text-gray-300"}`}>
											{e.event}
										</span>
									</td>
									<td className='px-6 py-4 text-sm text-white font-mono'>#{e.auctionId}</td>
									<td className='px-6 py-4 text-xs text-gray-400 font-mono'>{e.from}</td>
									<td className='px-6 py-4 text-sm font-bold text-indigo-400'>
										{e.amount ? `${e.amount} ETH` : "-"}
									</td>
									<td className='px-6 py-4'>
										<a href={`https://sepolia.etherscan.io/tx/${e.txHash}`} target='_blank' rel='noopener noreferrer'
											className='text-xs text-blue-400 hover:text-blue-300 font-mono flex items-center gap-1'>
											{e.txHash.slice(0, 10)}...{e.txHash.slice(-8)}
											<ExternalLink size={14} />
										</a>
									</td>
									<td className='px-6 py-4 text-sm text-gray-400'>{e.block}</td>
									<td className='px-6 py-4 text-sm text-gray-300'>
										{formatDistanceToNow(e.time, { addSuffix: true })}
									</td>
									<td className='px-6 py-4'>
										<button onClick={() => openModal(e)} className='text-blue-400 hover:text-blue-300'>
											<Eye size={20} />
										</button>
									</td>
								</motion.tr>
							))}
						</tbody>
					</table>
				</div>
			</motion.div>

			{/* MODAL CHI TIẾT */}
			<EventDetailModal
				event={selectedEvent}
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
			/>
		</>
	);
};

export default EventsTable;
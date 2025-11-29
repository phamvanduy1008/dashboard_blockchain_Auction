import { motion } from "framer-motion";
import Header from "../components/common/Header";
import { ScrollText, Clock, Gavel, ArrowUpCircle } from "lucide-react";
import EventsTable from "../components/events/EventsTable";

const EventsPage = () => {
	return (
		<div className='flex-1 overflow-auto relative z-10'>
			<Header title='Smart Contract Events Log' />

			<main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
				{/* Mini Stats */}
				<motion.div className='grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8'>
					<div className='bg-gray-800 bg-opacity-50 backdrop-blur-md rounded-xl p-6 border border-gray-700 flex items-center gap-4'>
						<div className='p-3 bg-indigo-900 bg-opacity-50 rounded-lg'>
							<Gavel className='w-8 h-8 text-indigo-400' />
						</div>
						<div>
							<p className='text-gray-400 text-sm'>Total Events</p>
							<p className='text-2xl font-bold text-white'>8,421</p>
						</div>
					</div>
					<div className='bg-gray-800 bg-opacity-50 backdrop-blur-md rounded-xl p-6 border border-gray-700 flex items-center gap-4'>
						<div className='p-3 bg-green-900 bg-opacity-50 rounded-lg'>
							<ArrowUpCircle className='w-8 h-8 text-green-400' />
						</div>
						<div>
							<p className='text-gray-400 text-sm'>Bids Today</p>
							<p className='text-2xl font-bold text-white'>342</p>
						</div>
					</div>
					<div className='bg-gray-800 bg-opacity-50 backdrop-blur-md rounded-xl p-6 border border-gray-700 flex items-center gap-4'>
						<div className='p-3 bg-purple-900 bg-opacity-50 rounded-lg'>
							<Clock className='w-8 h-8 text-purple-400' />
						</div>
						<div>
							<p className='text-gray-400 text-sm'>Last Event</p>
							<p className='text-lg font-bold text-white'>12s ago</p>
						</div>
					</div>
				</motion.div>

				<EventsTable />
			</main>
		</div>
	);
};

export default EventsPage;
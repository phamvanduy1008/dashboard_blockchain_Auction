import { motion } from "framer-motion";
import { Search, Eye, Ban, CheckCircle } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

const UserDetailModal = ({ user, isOpen, onClose }) => {
	if (!isOpen || !user) return null;

	return (
		<motion.div
			className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm'
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			onClick={onClose}
		>
			<motion.div
				className='bg-gray-800 border border-gray-700 rounded-2xl shadow-2xl max-w-2xl w-full mx-4 p-8'
				initial={{ scale: 0.9, y: 50 }}
				animate={{ scale: 1, y: 0 }}
				onClick={(e) => e.stopPropagation()}
			>
				<h2 className='text-2xl font-bold text-white mb-6'>User Profile</h2>
				<div className='space-y-5'>
					<div className='flex items-center gap-4'>
						<div className='w-20 h-20 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center text-3xl font-bold text-white'>
							{user.username[0].toUpperCase()}
						</div>
						<div>
							<p className='text-xl font-semibold text-white'>{user.username}</p>
							<code className='text-sm text-gray-400'>{user.ethAddress}</code>
						</div>
					</div>

					<div className='grid grid-cols-2 gap-6 bg-gray-900 rounded-xl p-6'>
						<div>
							<p className='text-gray-400'>Auctions Created</p>
							<p className='text-2xl font-bold text-indigo-400'>{user.auctionsCreated}</p>
						</div>
						<div>
							<p className='text-gray-400'>Total Bid Amount</p>
							<p className='text-2xl font-bold text-green-400'>{user.totalBidAmount} ETH</p>
						</div>
						<div>
							<p className='text-gray-400'>Wins</p>
							<p className='text-2xl font-bold text-yellow-400'>{user.wins}</p>
						</div>
						<div>
							<p className='text-gray-400'>Joined Date</p>
							<p className='text-lg text-gray-300'>{new Date(user.joinedDate).toLocaleDateString()}</p>
						</div>
					</div>

					<div className='flex justify-end gap-3'>
						<button onClick={onClose} className='px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg text-white transition'>
							Close
						</button>
					</div>
				</div>
			</motion.div>
		</motion.div>
	);
};

const UsersTable = ({ users }) => {
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedUser, setSelectedUser] = useState(null);
	const [isModalOpen, setIsModalOpen] = useState(false);

	const filteredUsers = users.filter(user =>
		user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
		user.ethAddress.toLowerCase().includes(searchTerm.toLowerCase())
	);

	const handleBanToggle = (userId, currentStatus) => {
		const action = currentStatus === "banned" ? "unban" : "ban";
		if (confirm(`Bạn có chắc muốn ${action} user này?`)) {
			toast.success(`User đã được ${action === "ban" ? "cấm" : "gỡ cấm"} thành công!`);
			// TODO: gọi API ban/unban
		}
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
					<h2 className='text-xl font-semibold text-gray-100'>All Users</h2>
					<div className='relative'>
						<input
							type='text'
							placeholder='Search by username or address...'
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
								<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>User</th>
								<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>Address</th>
								<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>Auctions</th>
								<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>Total Bid</th>
								<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>Wins</th>
								<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>Status</th>
								<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>Actions</th>
							</tr>
						</thead>
						<tbody className='divide-y divide-gray-700'>
							{filteredUsers.map((user) => (
								<motion.tr key={user.id} className='hover:bg-gray-700 transition'>
									<td className='px-6 py-4'>
										<div className='flex items-center gap-3'>
											<div className='w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold'>
												{user.username[0].toUpperCase()}
											</div>
											<div className='font-medium text-white'>{user.username}</div>
										</div>
									</td>
									<td className='px-6 py-4'>
										<code className='text-xs text-gray-400 font-mono'>
											{user.ethAddress.slice(0, 8)}...{user.ethAddress.slice(-6)}
										</code>
									</td>
									<td className='px-6 py-4 text-sm text-gray-300'>{user.auctionsCreated}</td>
									<td className='px-6 py-4 text-sm font-semibold text-indigo-400'>{user.totalBidAmount} ETH</td>
									<td className='px-6 py-4 text-sm font-bold text-yellow-400'>{user.wins}</td>
									<td className='px-6 py-4'>
										<span className={`px-3 py-1 rounded-full text-xs font-medium ${user.status === "active" ? "bg-green-900 text-green-300" : "bg-red-900 text-red-300"}`}>
											{user.status === "active" ? "Active" : "Banned"}
										</span>
									</td>
									<td className='px-6 py-4 text-sm'>
										<button
											onClick={() => {
												setSelectedUser(user);
												setIsModalOpen(true);
											}}
											className='text-blue-400 hover:text-blue-300 mr-3'
										>
											<Eye size={18} />
										</button>
										<button
											onClick={() => handleBanToggle(user.id, user.status)}
											className={user.status === "banned" ? "text-green-400 hover:text-green-300" : "text-red-400 hover:text-red-300"}
										>
											{user.status === "banned" ? <CheckCircle size={18} /> : <Ban size={18} />}
										</button>
									</td>
								</motion.tr>
							))}
						</tbody>
					</table>
				</div>
			</motion.div>

			<UserDetailModal
				user={selectedUser}
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
			/>
		</>
	);
};

export default UsersTable;
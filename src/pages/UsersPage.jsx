import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";
import UsersTable from "../components/users/UsersTable";
import { UsersIcon, UserPlus, UserCheck, UserX, Wallet } from "lucide-react";
import { userService } from "../services/userService"; // Adjust path as needed
import toast from "react-hot-toast"; 

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const [totalCount, setTotalCount] = useState(0); // For totalUsers from API if provided

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await userService.getUsers({ page: 1, limit: 100 }); 
        console.log("response:", response);
        
        // FIX: Since userService returns data directly, use response.users and response.total
        const apiUsers = response.users || response.data || [];
        const apiTotal = response.total || apiUsers.length;

        // COMPLETE MAPPING: Include ALL fields from API to match table/modal
        const mappedUsers = apiUsers.map(user => ({
          id: user.id || user._id,
          username: user.username || 'Unknown',
          full_name: user.full_name || '',
          email: user.email || 'N/A',  // ← ADD: Email from API
          ethAddress: user.wallet_address || '0x000...000',  // Map wallet_address to ethAddress
          balance_eth: user.balance_eth || 0,
          balance_vnd: user.balance_vnd || 0,
          formatted_balance: user.formatted_balance || new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(user.balance_vnd || 0),  // ← ADD & FORMAT: VND
          role: user.role || 'USER',  // ← ADD: Role
          status: user.status === 'ACTIVE' ? 'active' : (user.status === 'BANNED' ? 'banned' : 'active'),  // ← ADD & MAP: Status for FE display
          joinedDate: user.created_at || new Date().toISOString().split('T')[0],  // Map created_at
          momo_phone: user.momo_phone || '',  // ← ADD: For modal
          // auctionsCreated, totalBidAmount, wins: Keep as 0 if no API field, or fetch separately
          auctionsCreated: 0,
          totalBidAmount: '0',
          wins: 0,
        }));

        console.log("Mapped users:", mappedUsers);  // Debug: Check mapping

        setUsers(mappedUsers);
        setTotalCount(apiTotal);
        toast.success('Users loaded successfully!');
      } catch (error) {
        console.error("Error fetching users:", error);
        if (error.response?.status === 401) {
          toast.error("Unauthorized. Please log in as admin.");
        } else {
          toast.error("Failed to load users. Please try again.");
        }
        setUsers([]); // Clear on error
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [refreshKey]);

  // Dynamic stats calculation based on current date (make dynamic, not hardcode)
  const today = new Date();  // Current date: Nov 30, 2025
  const oneWeekAgo = new Date(today);
  oneWeekAgo.setDate(today.getDate() - 7);  // Nov 23, 2025

  const newThisWeek = users.filter(u => new Date(u.joinedDate) > oneWeekAgo).length;

  const topWhaleBid = users.reduce((max, u) => {
    const bid = parseFloat(u.totalBidAmount || 0);
    return Math.max(max, bid);
  }, 0);

  const stats = {
    totalUsers: totalCount || users.length, // Prefer API total
    activeUsers: users.filter(u => u.status === "active").length,
    newThisWeek,
    topWhaleBid: `${topWhaleBid.toLocaleString('en-US', { minimumFractionDigits: 1 })}`,
  };

  const handleRefresh = () => setRefreshKey(prev => prev + 1);

  if (loading) {
    return (
      <div className='flex-1 overflow-auto relative z-10 flex items-center justify-center min-h-screen'>
        <div className='text-white text-lg'>Loading users...</div>
      </div>
    );
  }

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
        <UsersTable users={users} onRefresh={handleRefresh} />
        {users.length === 0 && !loading && (
          <motion.div
            className='mt-4 p-4 bg-gray-900 border border-gray-700 rounded-lg text-gray-400 text-sm text-center'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            No users found. Refresh to retry.
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default UsersPage;
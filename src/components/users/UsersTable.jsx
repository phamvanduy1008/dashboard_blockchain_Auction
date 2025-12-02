import { motion } from "framer-motion";
import { Search, Eye, Ban, CheckCircle, Mail, DollarSign, UserCog, Edit2, Save, X, Key } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { userService } from "../../services/userService";

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
              {user.username[0]?.toUpperCase() || '?'}
            </div>
            <div>
              <p className='text-xl font-semibold text-white'>{user.full_name || user.username}</p>
              <code className='text-sm text-gray-400 break-all'>{user.ethAddress}</code>
            </div>
          </div>
          <div className='grid grid-cols-2 gap-6 bg-gray-900 rounded-xl p-6'>
            <div className='flex flex-col items-center'>
              <Mail className='w-6 h-6 text-gray-400 mb-1' />
              <p className='text-sm text-gray-400'>Email</p>
              <p className='text-lg font-semibold text-white'>{user.email || 'N/A'}</p>
            </div>
            <div className='flex flex-col items-center'>
              <DollarSign className='w-6 h-6 text-gray-400 mb-1' />
              <p className='text-sm text-gray-400'>Balance</p>
              <p className='text-lg font-semibold text-green-400'>{user.formatted_balance || '0 VND'}</p>
            </div>
            <div className='flex flex-col items-center'>
              <UserCog className='w-6 h-6 text-gray-400 mb-1' />
              <p className='text-sm text-gray-400'>Role</p>
              <p className='text-lg font-semibold text-indigo-400'>{user.role || 'USER'}</p>
            </div>
            <div className='flex flex-col items-center'>
              <p className='text-sm text-gray-400'>Joined</p>
              <p className='text-lg text-gray-300'>{new Date(user.joinedDate).toLocaleDateString()}</p>
            </div>
          </div>
          {user.momo_phone && (
            <div className='p-4 bg-blue-900/20 rounded-lg'>
              <p className='text-sm text-blue-300'>MoMo Phone: <code className='font-mono'>{user.momo_phone}</code></p>
            </div>
          )}
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

// Edit User Modal
const EditUserModal = ({ user, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    momo_phone: '',
    role: 'USER'
  });

  useEffect(() => {
    if (user) {
      setFormData({
        full_name: user.full_name || '',
        email: user.email || '',
        momo_phone: user.momo_phone || '',
        role: user.role || 'USER'
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updates = {};
    if (formData.full_name !== (user.full_name || '')) updates.full_name = formData.full_name;
    if (formData.email !== (user.email || '')) updates.email = formData.email.toLowerCase().trim();
    if (formData.momo_phone !== (user.momo_phone || '')) updates.momo_phone = formData.momo_phone;
    if (formData.role !== (user.role || 'USER')) {
      try {
        await userService.setRole(user.id, formData.role);
        toast.success(`Role updated to ${formData.role}!`);
      } catch (error) {
        console.error('Error updating role:', error);
        toast.error('Failed to update role.');
        return;
      }
    }
    if (Object.keys(updates).length > 0) {
      try {
        await userService.updateUser(user.id, updates);
        toast.success('User info updated!');
      } catch (error) {
        console.error('Error updating user:', error);
        toast.error('Failed to update user info.');
        return;
      }
    }
    onSave();
    onClose();
  };

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
        className='bg-gray-800 border border-gray-700 rounded-xl shadow-2xl max-w-md w-full mx-4 p-6'
        initial={{ scale: 0.9, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className='flex items-center justify-between mb-4'>
          <h2 className='text-xl font-bold text-white'>Edit User: {user.username}</h2>
          <button onClick={onClose} className='text-gray-400 hover:text-white'>
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <label className='block text-sm font-medium text-gray-300 mb-1'>Full Name</label>
            <input
              type='text'
              name='full_name'
              value={formData.full_name}
              onChange={handleChange}
              className='w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500'
              required
            />
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-300 mb-1'>Email</label>
            <input
              type='email'
              name='email'
              value={formData.email}
              onChange={handleChange}
              className='w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500'
              required
            />
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-300 mb-1'>MoMo Phone</label>
            <input
              type='tel'
              name='momo_phone'
              value={formData.momo_phone}
              onChange={handleChange}
              className='w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500'
              placeholder='e.g., 0123456789'
            />
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-300 mb-1'>Role</label>
            <select
              name='role'
              value={formData.role}
              onChange={handleChange}
              className='w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500'
            >
              <option value='USER'>USER</option>
              <option value='MANAGER'>MANAGER</option>
             
            </select>
          </div>
          <div className='flex justify-end gap-3 pt-4'>
            <button
              type='button'
              onClick={onClose}
              className='px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white transition'
            >
              Cancel
            </button>
            <button
              type='submit'
              className='px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-white transition flex items-center gap-2'
            >
              <Save size={16} />
              Save Changes
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

const UsersTable = ({ users, onRefresh }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const filteredUsers = users.filter(user =>
    user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.ethAddress?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleBanToggle = async (userId, currentStatus) => {
    const newStatus = currentStatus === "banned" ? "ACTIVE" : "BANNED";
    const action = newStatus === "BANNED" ? "ban" : "unban";
    if (confirm(`Bạn có chắc muốn ${action} user này?`)) {
      try {
        await userService.setStatus(userId, newStatus);
        toast.success(`User đã được ${action === "ban" ? "cấm" : "gỡ cấm"} thành công!`);
        if (onRefresh) onRefresh();
      } catch (error) {
        console.error("Error updating status:", error);
        toast.error(`Failed to ${action} user.`);
      }
    }
  };

  const handleResetPassword = async (userId, username) => {
    const newPassword = prompt(`Nhập mật khẩu mới cho user ${username} (ít nhất 8 ký tự):`);
    if (!newPassword || newPassword.length < 8) {
      toast.error('Mật khẩu mới phải ít nhất 8 ký tự!');
      return;
    }
    if (confirm(`Bạn có chắc muốn reset mật khẩu cho ${username} thành "${newPassword}"?`)) {
      try {
        await userService.resetPassword(userId, newPassword);
        toast.success(`Mật khẩu cho ${username} đã được reset thành công!`);
        if (onRefresh) onRefresh();
      } catch (error) {
        console.error("Error resetting password:", error);
        toast.error('Failed to reset password. Please try again.');
      }
    }
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setIsEditOpen(true);
  };

  const handleSaveEdit = () => {
    if (onRefresh) onRefresh();
  };

  useEffect(() => {
    users.forEach(user => {
      if (!user.formatted_balance) {
        user.formatted_balance = new Intl.NumberFormat('vi-VN', { 
          style: 'currency', 
          currency: 'VND' 
        }).format(user.balance_vnd || 0);
      }
      console.log(`Balance VND for ${user.username}:`, user.balance_vnd, `Formatted:`, user.formatted_balance);
    });
  }, [users]);

  const handleViewDetails = async (user) => {
    try {
      const fullUser = await userService.getUser(user.id);
      setSelectedUser({ ...user, ...fullUser });
    } catch (error) {
      console.error("Error fetching user details:", error);
      setSelectedUser(user);
    }
    setIsModalOpen(true);
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
          <h2 className='text-xl font-semibold text-gray-100'>All Users ({filteredUsers.length})</h2>
          <div className='relative'>
            <input
              type='text'
              placeholder='Search by username, email, or address...'
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
                <th className='px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>User</th>
                <th className='px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>Email</th>
                <th className='px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>Wallet Address</th>
                <th className='px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>Balance (VND)</th>
                <th className='px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>Role</th>
                <th className='px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>Status</th>
                <th className='px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>Actions</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-700'>
              {filteredUsers.map((user) => (
                <motion.tr key={user.id} className='hover:bg-gray-700 transition'>
                  <td className='px-4 py-4'>
                    <div className='flex items-center gap-3'>
                      <div className='w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold'>
                        {user.username[0]?.toUpperCase() || '?'}
                      </div>
                      <div>
                        <div className='font-medium text-white'>{user.username}</div>
                        <div className='text-sm text-gray-400'>{user.full_name || ''}</div>
                      </div>
                    </div>
                  </td>
                  <td className='px-4 py-4 text-sm text-gray-300'>{user.email}</td>
                  <td className='px-4 py-4'>
                    <code className='text-xs text-gray-400 font-mono'>
                      {user.ethAddress?.slice(0, 8)}...{user.ethAddress?.slice(-6)}
                    </code>
                  </td>
                  <td className='px-4 py-4 text-sm font-semibold text-green-400'>
                    {user.formatted_balance}
                  </td>
                  <td className='px-4 py-4 text-sm text-indigo-400'>{user.role}</td>
                  <td className='px-4 py-4'>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      user.status === "active" ? "bg-green-900 text-green-300" : "bg-red-900 text-red-300"
                    }`}>
                      {user.status === "active" ? "Active" : "Banned"}
                    </span>
                  </td>
                  <td className='px-4 py-4 text-sm'>
                    <button
                      onClick={() => handleViewDetails(user)}
                      className='text-blue-400 hover:text-blue-300 mr-3'
                      title="View Details"
                    >
                      <Eye size={18} />
                    </button>
                    <button
                      onClick={() => handleEditUser(user)}
                      className='text-yellow-400 hover:text-yellow-300 mr-3'
                      title="Edit User"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => handleResetPassword(user.id, user.username)}
                      className='text-orange-400 hover:text-orange-300 mr-3'
                      title="Reset Password"
                    >
                      <Key size={18} />
                    </button>
                    <button
                      onClick={() => handleBanToggle(user.id, user.status)}
                      className={user.status === "active" ? "text-red-400 hover:text-red-300" : "text-green-400 hover:text-green-300"}
                      title={user.status === "active" ? "Ban" : "Unban"}
                    >
                      {user.status === "active" ? <Ban size={18} /> : <CheckCircle size={18} />}
                    </button>
                  </td>
                </motion.tr>
              ))}
              {filteredUsers.length === 0 && (
                <motion.tr>
                  <td colSpan={7} className='px-4 py-4 text-center text-gray-400'>
                    No users found.
                  </td>
                </motion.tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
      <UserDetailModal
        user={selectedUser}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
      <EditUserModal
        user={editingUser}
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        onSave={handleSaveEdit}
      />
    </>
  );
};

export default UsersTable;
import { motion } from "framer-motion";

const DangerZone = ({ logout }) => {
  return (
    <motion.div
      className="bg-red-900 bg-opacity-50 backdrop-filter backdrop-blur-lg shadow-lg rounded-xl p-4 border border-red-700 mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <button
        onClick={logout}
        className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition duration-200"
      >
        Logout Account
      </button>
    </motion.div>
  );
};

export default DangerZone;
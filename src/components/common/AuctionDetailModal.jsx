import { motion } from "framer-motion";
import {
  X,
  Gavel,
  User,
  Trophy,
  Clock,
  AlertTriangle,
  DollarSign,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { formatDistanceToNow, isValid, parseISO } from "date-fns";
import toast from "react-hot-toast";
import { useState } from "react";
import { auctionService } from "../../services/auctionService";

const EXCHANGE_RATE_ETH_TO_VND = 50000000;

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
  const formatted = parseFloat(ethAmount)
    .toFixed(6)
    .replace(/0+$/, "")
    .replace(/\.$/, "");
  return `${formatted} ETH`;
};

const formatPrice = (priceVnd) => {
  if (!priceVnd || isNaN(parseFloat(priceVnd)))
    return { vnd: "0 ₫", eth: "0 ETH" };
  const eth = vndToEth(priceVnd);
  return {
    vnd: formatVnd(priceVnd),
    eth: formatEth(eth),
  };
};

const SuccessPopup = ({ type, message, onClose }) => {
  const isApprove = type === "approve";
  return (
    <motion.div
      className="fixed inset-0 z-60 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-gray-800 border border-gray-700 rounded-2xl shadow-2xl max-w-md w-full p-6"
        initial={{ scale: 0.9, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 50 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-center mb-4">
          {isApprove ? (
            <CheckCircle className="w-12 h-12 text-green-400" />
          ) : (
            <XCircle className="w-12 h-12 text-red-400" />
          )}
        </div>
        <h3 className="text-xl font-bold text-white text-center mb-2">
          {isApprove ? "Auction Approved!" : "Auction Rejected!"}
        </h3>
        <p className="text-gray-300 text-center mb-6">{message}</p>
        <button
          onClick={onClose}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition"
        >
          OK, Close
        </button>
      </motion.div>
    </motion.div>
  );
};

const AuctionDetailModal = ({
  auction: modalData,
  isOpen,
  onClose,
  onForceEnd,
}) => {
  if (!isOpen || !modalData) {
    console.log("Modal closed or no auction data:", modalData);
    return null;
  }

  const [showSuccess, setShowSuccess] = useState(false);
  const [successType, setSuccessType] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  console.log("AuctionDetailData:", modalData);

  const auction = modalData.auction || modalData;
  const bids = modalData.bids || [];
  console.log("Bids data:", bids);

  const getEndDate = (dateStr) => {
    if (!dateStr) return null;
    let date;
    if (typeof dateStr === "number") {
      date = new Date(dateStr);
    } else if (typeof dateStr === "string") {
      date = parseISO(dateStr);
      if (!isValid(date)) {
        date = new Date(dateStr);
      }
    } else {
      return null;
    }
    return isValid(date) ? date : null;
  };

  const endDate = getEndDate(auction.end_time);
  const startDate = getEndDate(auction.start_time);

  const isEnded = auction.status === "ENDED" || auction.status === "SETTLED";
  const timeLeft =
    auction.status === "PENDING_APPROVAL"
      ? "Not started yet"
      : isEnded || !endDate || endDate < new Date()
      ? "Auction expired"
      : formatDistanceToNow(endDate, { addSuffix: true });

  const isEndingSoon =
    auction.status === "ACTIVE" &&
    endDate &&
    !isEnded &&
    Date.now() > endDate.getTime() - 5 * 60 * 1000;

  // Get seller name from seller_id or seller
  const sellerObj = auction.seller_id || auction.seller;
  const sellerName =
    sellerObj?.full_name || sellerObj?.username || "Unknown Seller";

  // Highest bidder handling (fix: use highest_bidder which is null or object)
  const highestBidderObj = auction.highest_bidder_id || auction.highest_bidder;
  const highestBidderName =
    highestBidderObj?.username || highestBidderObj?.full_name || "Anonymous";

  // Status badge color and text
  const getStatusDisplay = (status) => {
    const statusMap = {
      PENDING_APPROVAL: { color: "bg-yellow-600", text: "Pending Approval" },
      APPROVED: { color: "bg-blue-600", text: "Approved" },
      REJECTED: { color: "bg-red-600", text: "Rejected" },
      DEPLOYING: { color: "bg-purple-600", text: "Deploying" },
      ACTIVE: { color: "bg-green-600", text: "Active" },
      ENDED: { color: "bg-gray-600", text: "Ended" },
      SETTLED: { color: "bg-indigo-600", text: "Settled" },
    };
    return (
      statusMap[status] || { color: "bg-gray-600", text: status || "Unknown" }
    );
  };

  const statusInfo = getStatusDisplay(auction.status);

  // Action handlers
  const handleApprove = async () => {
    try {
      await auctionService.approveAuction(auction.id);
      setSuccessType("approve");
      setSuccessMessage(
        `Auction "${auction.title}" has been approved successfully!`
      );
      setShowSuccess(true);
    } catch (err) {
      console.error("Approve error:", err);
      toast.error("Failed to approve auction");
    }
  };

  const handleReject = async (reason) => {
    console.log("Rejecting auction with reason:", reason); // Log reason
    if (!reason?.trim()) {
      toast.error("Please provide a reason");
      return;
    }
    try {
      await auctionService.rejectAuction(auction.id, reason);
      setSuccessType("reject");
      setSuccessMessage(
        `Auction "${auction.title}" has been rejected. Reason: ${reason}`
      );
      setShowSuccess(true);
    } catch (err) {
      console.error("Reject error:", err); // Log error
      toast.error("Failed to reject auction");
    }
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    onClose();
  };

  const handleDeploy = async () => {
    console.log("Deploying auction:", auction.id); // Log before deploy
    try {
      await auctionService.deployAuction(auction.id);
      toast.success("Auction deployed!");
      onClose();
    } catch (err) {
      console.error("Deploy error:", err); // Log error
      toast.error("Failed to deploy auction");
    }
  };

  const handleStart = async () => {
    console.log("Starting auction:", auction.id); // Log before start
    try {
      await auctionService.startAuction(auction.id);
      toast.success("Auction started!");
      onClose();
    } catch (err) {
      console.error("Start error:", err); // Log error
      toast.error("Failed to start auction");
    }
  };

  const handleSettle = async () => {
    console.log("Settling auction:", auction.id); // Log before settle
    try {
      await auctionService.settleAuction(auction.id);
      toast.success("Auction settled!");
      onClose();
    } catch (err) {
      console.error("Settle error:", err); // Log error
      toast.error("Failed to settle auction");
    }
  };

  const canApprove = auction.status === "PENDING_APPROVAL";
  const canReject = auction.status === "PENDING_APPROVAL";
  const canDeploy = auction.status === "APPROVED";
  const canStart = auction.status === "DEPLOYING";
  const canEnd = auction.status === "ACTIVE" && !isEnded;
  const canSettle = auction.status === "ENDED";
  console.log("Action permissions:", {
    canApprove,
    canReject,
    canDeploy,
    canStart,
    canEnd,
    canSettle,
  }); // Log permissions

  const currentPriceInfo = formatPrice(auction.current_price_vnd);
  const startPriceInfo = formatPrice(auction.start_price_vnd);
  console.log("Formatted prices:", {
    start: startPriceInfo,
    current: currentPriceInfo,
  }); // Log formatted prices

  return (
    <>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="bg-gray-800 border border-gray-700 rounded-2xl shadow-2xl max-w-6xl w-full max-h-[95vh] overflow-y-auto"
          initial={{ scale: 0.9, y: 50 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 50 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header - Improved with better spacing */}
          <div className="flex justify-between items-start p-6 border-b border-gray-700 sticky top-0 bg-gray-800/95 backdrop-blur-sm z-10">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3 mb-2">
                <Gavel className="w-8 h-8 text-indigo-400" />
                Auction #{auction.id} - {auction.title}
              </h2>
              <div className="flex items-center gap-4">
                <span
                  className={`px-4 py-2 text-sm rounded-full ${statusInfo.color} text-white font-medium shadow-lg`}
                >
                  {statusInfo.text}
                </span>
                <span className="text-gray-400 text-sm">
                  {timeLeft}{" "}
                  {isEndingSoon && (
                    <span className="text-red-500 animate-pulse ml-1">
                      ⚡ Ending Soon
                    </span>
                  )}
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition p-2 rounded-lg hover:bg-gray-700 ml-4"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="p-6">
            {/* Main Content Grid - Improved layout: Image full-width on mobile, side-by-side on desktop */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Item Image - Larger and centered */}
              <div className="lg:row-span-2">
                <div className="relative">
                  <img
                    src={
                      auction.images?.[0] ||
                      `https://via.placeholder.com/600x600?text=${encodeURIComponent(
                        auction.title.substring(0, 1)
                      )}`
                    }
                    alt={auction.title}
                    className="w-full h-80 lg:h-[500px] rounded-2xl shadow-2xl border border-gray-700 object-cover"
                  />
                  {auction.images && auction.images.length > 1 && (
                    <div className="absolute bottom-3 right-3 flex gap-1 bg-black/50 rounded-lg p-1">
                      {auction.images.slice(1, 4).map((img, idx) => (
                        <img
                          key={idx}
                          src={img}
                          alt="Thumbnail"
                          className="w-12 h-12 rounded object-cover cursor-pointer opacity-70 hover:opacity-100"
                        />
                      ))}
                      {auction.images.length > 4 && (
                        <div className="w-12 h-12 bg-gray-800 rounded flex items-center justify-center text-xs text-gray-500">
                          +{auction.images.length - 4}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Key Metrics Cards - Compact and visually grouped */}
              <div className="space-y-4 lg:col-span-1">
                {/* Current Price Card - Prominent */}
                <div className="bg-gradient-to-br from-indigo-900/20 to-purple-900/20 rounded-2xl p-6 border border-indigo-500/30 shadow-lg">
                  <p className="text-indigo-300 text-sm uppercase tracking-wide mb-3 flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    Current Price
                  </p>
                  <div className="space-y-2">
                    <div className="text-3xl lg:text-4xl font-bold text-white flex items-center gap-2">
                      {currentPriceInfo.vnd}
                    </div>
                    <div className="text-indigo-300 text-sm flex items-center gap-2">
                      ≈ {currentPriceInfo.eth}
                    </div>
                  </div>
                  {highestBidderObj ? (
                    <p className="text-green-400 text-sm mt-4 flex items-center gap-2 bg-green-900/20 rounded-lg p-2">
                      <Trophy className="w-4 h-4" />
                      Leading: {highestBidderName}
                    </p>
                  ) : (
                    <p className="text-gray-500 text-sm mt-4 italic">
                      No bids yet
                    </p>
                  )}
                </div>

                {/* Start Price Card - Smaller */}
                {auction.start_price_vnd && (
                  <div className="bg-gradient-to-br from-gray-900/30 to-gray-800/30 rounded-2xl p-4 border border-gray-600/50">
                    <p className="text-gray-400 text-xs uppercase tracking-wide mb-2">
                      Starting Price
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="text-lg font-semibold text-white">
                        {startPriceInfo.vnd}
                      </div>
                      <div className="text-gray-500 text-xs">
                        ≈ {startPriceInfo.eth}
                      </div>
                    </div>
                  </div>
                )}

                {/* Time Cards - Stacked horizontally on desktop */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* End Time */}
                  <div
                    className={`p-4 rounded-2xl border ${
                      isEndingSoon
                        ? "border-red-500/50 bg-red-900/20"
                        : "border-gray-600/50 bg-gray-900/30"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Clock
                        className={`w-4 h-4 ${
                          isEndingSoon ? "text-red-400" : "text-gray-400"
                        }`}
                      />
                      <span className="text-xs uppercase tracking-wide text-gray-400">
                        Ends In
                      </span>
                    </div>
                    <p
                      className={`font-bold text-lg ${
                        isEndingSoon
                          ? "text-red-400 animate-pulse"
                          : "text-white"
                      }`}
                    >
                      {timeLeft}
                    </p>
                    {endDate && (
                      <p className="text-xs text-gray-500 mt-1">
                        {endDate.toLocaleString("vi-VN", {
                          timeZone: "Asia/Ho_Chi_Minh",
                        })}
                      </p>
                    )}
                  </div>

                  {/* Start Time */}
                  {auction.start_time && (
                    <div className="p-4 rounded-2xl border border-gray-600/50 bg-gray-900/30">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className="text-xs uppercase tracking-wide text-gray-400">
                          Started
                        </span>
                      </div>
                      <p className="font-bold text-lg text-white">
                        {startDate.toLocaleString("vi-VN", {
                          timeZone: "Asia/Ho_Chi_Minh",
                        })}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Seller Info - Full width, cleaner */}
            <div className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 rounded-2xl p-6 border border-gray-700/50 mb-8">
              <p className="text-gray-400 text-sm uppercase tracking-wide mb-4 flex items-center gap-2">
                <User className="w-4 h-4" />
                Seller Information
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-gray-400" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-white text-lg">
                    {sellerName}
                  </p>
                  {sellerObj?.id && (
                    <code className="text-xs bg-gray-700 px-3 py-1 rounded-full text-gray-300 block mt-1">
                      ID: {sellerObj.id}
                    </code>
                  )}
                  {auction.sellerAddress && (
                    <code className="text-xs bg-gray-700 px-3 py-1 rounded-full text-gray-300 block mt-1 truncate max-w-[200px]">
                      {auction.sellerAddress}
                    </code>
                  )}
                </div>
              </div>
            </div>

            {/* Actions Section - Improved: Grouped in a card, better spacing */}
            {(canApprove ||
              canReject ||
              canDeploy ||
              canStart ||
              canEnd ||
              canSettle) && (
              <div className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 rounded-2xl p-6 border border-gray-700/50 mb-8">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Gavel className="w-5 h-5 text-indigo-400" />
                  Admin Actions
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {canApprove && (
                    <button
                      onClick={handleApprove}
                      className="bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl transition flex items-center justify-center gap-2 shadow-lg"
                    >
                      <Gavel className="w-4 h-4" />
                      Approve
                    </button>
                  )}
                  {canReject && (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Rejection reason..."
                        className="flex-1 px-3 py-3 bg-gray-700 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 placeholder-gray-400"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleReject(e.target.value);
                          }
                        }}
                      />
                      <button
                        onClick={() => {
                          const reasonInput = document.querySelector(
                            'input[placeholder="Rejection reason..."]'
                          );
                          handleReject(reasonInput?.value);
                        }}
                        className="px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition flex items-center gap-1 shadow-lg"
                      >
                        <AlertTriangle className="w-4 h-4" />
                        Reject
                      </button>
                    </div>
                  )}
                  {canDeploy && (
                    <button
                      onClick={handleDeploy}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition flex items-center justify-center gap-2 shadow-lg"
                    >
                      Deploy Contract
                    </button>
                  )}
                  {canStart && (
                    <button
                      onClick={handleStart}
                      className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 rounded-xl transition flex items-center justify-center gap-2 shadow-lg"
                    >
                      Start Auction
                    </button>
                  )}
                  {canEnd && (
                    <button
                      onClick={() => onForceEnd(auction.id)}
                      className="bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-xl transition flex items-center justify-center gap-2 shadow-lg"
                    >
                      <AlertTriangle className="w-4 h-4" />
                      Force End
                    </button>
                  )}
                  {canSettle && (
                    <button
                      onClick={handleSettle}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl transition flex items-center justify-center gap-2 shadow-lg"
                    >
                      Settle & Transfer
                    </button>
                  )}
                </div>
              </div>
            )}

            {isEnded && (
              <motion.div
                className="w-full bg-gradient-to-r from-green-900/40 to-emerald-900/40 border border-green-500/30 rounded-2xl p-6 text-center mb-8 shadow-xl"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-4 animate-bounce" />
                <h3 className="text-2xl font-bold text-green-300 mb-2">
                  Auction Successfully Completed!
                </h3>
                {highestBidderObj && (
                  <p className="text-green-200">
                    🏆 Winner:{" "}
                    <span className="font-mono bg-green-800/50 px-2 py-1 rounded">
                      {highestBidderName}
                    </span>
                  </p>
                )}
              </motion.div>
            )}

            <div>
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                📊 Bid History
                <span className="text-gray-500 text-sm">
                  ({bids.length} total bids)
                </span>
              </h3>
              {/* Bid History */}
              {bids.length > 0 && (
                <div className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 rounded-2xl p-6 border border-gray-700/50 mb-8">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-yellow-400" />
                    Bid History
                  </h3>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-gray-700/30 text-gray-300 text-sm">
                          <th className="py-3 px-4">User</th>
                          <th className="py-3 px-4">Amount (VND)</th>
                          <th className="py-3 px-4">Amount (ETH)</th>
                          <th className="py-3 px-4">Status</th>
                          <th className="py-3 px-4">Time</th>
                        </tr>
                      </thead>

                      <tbody>
                        {bids.map((bid, index) => {
                          const price = formatPrice(bid.amount_vnd);

                          return (
                            <tr
                              key={index}
                              className="border-b border-gray-700/50"
                            >
                              <td className="py-3 px-4 text-white">
                                {bid.user_id?.full_name ||
                                  bid.user_id?.username ||
                                  "Unknown"}
                              </td>

                              <td className="py-3 px-4 text-indigo-300 font-semibold">
                                {price.vnd}
                              </td>

                              <td className="py-3 px-4 text-indigo-400">
                                {price.eth}
                              </td>

                              <td className="py-3 px-4">
                                {bid.status === "WINNING" ? (
                                  <span className="text-green-400 font-medium">
                                    Winning
                                  </span>
                                ) : (
                                  <span className="text-gray-400">
                                    {bid.status}
                                  </span>
                                )}
                              </td>

                              <td className="py-3 px-4 text-gray-400">
                                {new Date(bid.createdAt).toLocaleString(
                                  "vi-VN"
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>

      {showSuccess && (
        <SuccessPopup
          type={successType}
          message={successMessage}
          onClose={handleSuccessClose}
        />
      )}
    </>
  );
};

export default AuctionDetailModal;

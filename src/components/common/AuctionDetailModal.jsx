import { motion, AnimatePresence } from "framer-motion";
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
  Loader2,
  Shield,
  FileText,
  Hash,
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

const SuccessPopup = ({ type, message, details, onClose }) => {
  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm px-4"
      style={{ zIndex: 9999 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-gray-800 border border-gray-700 rounded-2xl shadow-2xl max-w-md w-full p-8"
        initial={{ scale: 0.8, y: 60, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.8, y: 60, opacity: 0 }}
        transition={{ type: "spring", damping: 20, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-center mb-5">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", damping: 12, stiffness: 200, delay: 0.2 }}
          >
            {type === "approve" ? (
              <div className="w-20 h-20 rounded-full bg-green-900/40 border-2 border-green-500/50 flex items-center justify-center">
                <CheckCircle className="w-12 h-12 text-green-400" />
              </div>
            ) : type === "forceEnd" ? (
              <div className="w-20 h-20 rounded-full bg-orange-900/40 border-2 border-orange-500/50 flex items-center justify-center">
                <AlertTriangle className="w-12 h-12 text-orange-400" />
              </div>
            ) : (
              <div className="w-20 h-20 rounded-full bg-red-900/40 border-2 border-red-500/50 flex items-center justify-center">
                <XCircle className="w-12 h-12 text-red-400" />
              </div>
            )}
          </motion.div>
        </div>

        <motion.h3
          className="text-2xl font-bold text-white text-center mb-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {type === "approve" ? "✅ Auction Approved!" : type === "forceEnd" ? "🛑 Auction Force Ended!" : "❌ Auction Rejected!"}
        </motion.h3>
        <motion.p
          className="text-gray-300 text-center mb-5"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {message}
        </motion.p>

        {details && (
          <motion.div
            className="bg-gray-900/60 rounded-xl p-4 mb-5 border border-gray-700/50 space-y-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <p className="text-xs text-indigo-300 uppercase tracking-wider font-semibold flex items-center gap-2">
              <Shield className="w-3 h-3" /> Blockchain Details
            </p>
            {details.contract_address && (
              <div className="flex items-start gap-2">
                <FileText className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs text-gray-400">Contract Address</p>
                  <code className="text-xs text-green-300 break-all">{details.contract_address}</code>
                </div>
              </div>
            )}
            {details.blockchain_id && (
              <div className="flex items-start gap-2">
                <Hash className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs text-gray-400">Blockchain ID</p>
                  <code className="text-xs text-blue-300 break-all">{details.blockchain_id}</code>
                </div>
              </div>
            )}
            {details.tx_hash && (
              <div className="flex items-start gap-2">
                <Hash className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs text-gray-400">Transaction Hash</p>
                  <code className="text-xs text-orange-300 break-all">{details.tx_hash}</code>
                </div>
              </div>
            )}
          </motion.div>
        )}

        <motion.button
          onClick={onClose}
          className={`w-full font-bold py-3 rounded-xl transition shadow-lg text-white ${
            type === "approve"
              ? "bg-green-600 hover:bg-green-700"
              : type === "forceEnd"
              ? "bg-orange-600 hover:bg-orange-700"
              : "bg-red-600 hover:bg-red-700"
          }`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          OK, Close
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

const ConfirmApprovePopup = ({ auctionTitle, onConfirm, onCancel, isLoading }) => (
  <motion.div
    className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm px-4"
    style={{ zIndex: 9999 }}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    onClick={onCancel}
  >
    <motion.div
      className="bg-gray-800 border border-gray-700 rounded-2xl shadow-2xl max-w-md w-full p-8"
      initial={{ scale: 0.9, y: 30 }}
      animate={{ scale: 1, y: 0 }}
      exit={{ scale: 0.9, y: 30 }}
      transition={{ type: "spring", damping: 25, stiffness: 300 }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center justify-center mb-5">
        <div className="w-16 h-16 rounded-full bg-yellow-900/40 border-2 border-yellow-500/50 flex items-center justify-center">
          <Gavel className="w-8 h-8 text-yellow-400" />
        </div>
      </div>
      <h3 className="text-xl font-bold text-white text-center mb-2">
        Confirm Approval
      </h3>
      <p className="text-gray-300 text-center mb-2">
        Are you sure you want to approve this auction?
      </p>
      <p className="text-yellow-300 text-center text-sm mb-6 bg-yellow-900/20 rounded-lg p-3 border border-yellow-700/30">
        ⚠️ This will deploy a smart contract on the blockchain and cannot be undone.
      </p>
      <p className="text-white text-center font-semibold mb-6">
        "{auctionTitle}"
      </p>
      <div className="flex gap-3">
        <button
          onClick={onCancel}
          disabled={isLoading}
          className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 rounded-xl transition disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          disabled={isLoading}
          className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl transition flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Deploying...
            </>
          ) : (
            <>
              <CheckCircle className="w-5 h-5" />
              Yes, Approve
            </>
          )}
        </button>
      </div>
    </motion.div>
  </motion.div>
);

const ConfirmForceEndPopup = ({ auctionTitle, onConfirm, onCancel, isLoading }) => (
  <motion.div
    className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm px-4"
    style={{ zIndex: 9999 }}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    onClick={onCancel}
  >
    <motion.div
      className="bg-gray-800 border border-gray-700 rounded-2xl shadow-2xl max-w-md w-full p-8"
      initial={{ scale: 0.9, y: 30 }}
      animate={{ scale: 1, y: 0 }}
      exit={{ scale: 0.9, y: 30 }}
      transition={{ type: "spring", damping: 25, stiffness: 300 }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center justify-center mb-5">
        <div className="w-16 h-16 rounded-full bg-red-900/40 border-2 border-red-500/50 flex items-center justify-center">
          <AlertTriangle className="w-8 h-8 text-red-400" />
        </div>
      </div>
      <h3 className="text-xl font-bold text-white text-center mb-2">
        Force End Auction
      </h3>
      <p className="text-gray-300 text-center mb-2">
        Are you sure you want to force end this auction?
      </p>
      <p className="text-red-300 text-center text-sm mb-6 bg-red-900/20 rounded-lg p-3 border border-red-700/30">
        🚨 This will end the auction on-chain immediately. All active bids will be finalized and this action cannot be undone.
      </p>
      <p className="text-white text-center font-semibold mb-6">
        "{auctionTitle}"
      </p>
      <div className="flex gap-3">
        <button
          onClick={onCancel}
          disabled={isLoading}
          className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 rounded-xl transition disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          disabled={isLoading}
          className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl transition flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Ending...
            </>
          ) : (
            <>
              <AlertTriangle className="w-5 h-5" />
              Yes, Force End
            </>
          )}
        </button>
      </div>
    </motion.div>
  </motion.div>
);

const AuctionDetailModal = ({
  auction: modalData,
  isOpen,
  onClose,
  onActionComplete,
}) => {
  const [showSuccess, setShowSuccess] = useState(false);
  const [successType, setSuccessType] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [successDetails, setSuccessDetails] = useState(null);
  const [showConfirmApprove, setShowConfirmApprove] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [showConfirmForceEnd, setShowConfirmForceEnd] = useState(false);
  const [isForceEnding, setIsForceEnding] = useState(false);

  if (!isOpen || !modalData) {
    return null;
  }

  const auction = modalData.auction || modalData;
  const bids = modalData.bids || [];

  const isRejected = auction.status === "REJECTED";
  const isAdminEnded = auction.status === "ADMIN_ENDED";
  const isEnded = auction.status === "ENDED" || auction.status === "SETTLED" || isAdminEnded;
  const hasBids = bids.length > 0;

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

  const timeLeft =
    auction.status === "PENDING_APPROVAL"
      ? "Not started yet"
      : isRejected
      ? "Rejected by admin"
      : isAdminEnded
      ? "Force ended by admin"
      : isEnded || !endDate || endDate < new Date()
      ? "Auction expired"
      : formatDistanceToNow(endDate, { addSuffix: true });

  const isEndingSoon =
    auction.status === "ACTIVE" &&
    endDate &&
    !isEnded &&
    Date.now() > endDate.getTime() - 5 * 60 * 1000;

  const sellerObj = auction.seller_id || auction.seller;
  const sellerName =
    sellerObj?.full_name || sellerObj?.username || "Unknown Seller";

  const highestBidderObj = auction.highest_bidder_id || auction.highest_bidder;
  const highestBidderName =
    highestBidderObj?.username || highestBidderObj?.full_name || "Anonymous";

  const getStatusDisplay = (status) => {
    const statusMap = {
      PENDING_APPROVAL: { color: "bg-yellow-600", text: "Pending Approval" },
      APPROVED: { color: "bg-blue-600", text: "Approved" },
      REJECTED: { color: "bg-red-600", text: "Rejected" },
      DEPLOYING: { color: "bg-purple-600", text: "Deploying" },
      ACTIVE: { color: "bg-green-600", text: "Active" },
      ENDED: { color: "bg-gray-600", text: "Ended" },
      ADMIN_ENDED: { color: "bg-amber-600", text: "Admin Ended" },
      SETTLED: { color: "bg-indigo-600", text: "Settled" },
    };
    return statusMap[status] || { color: "bg-gray-600", text: status || "Unknown" };
  };

  const statusInfo = getStatusDisplay(auction.status);

  const canApprove = auction.status === "PENDING_APPROVAL";
  const canReject = auction.status === "PENDING_APPROVAL";
  const canDeploy = auction.status === "APPROVED";
  const canStart = auction.status === "DEPLOYING";
  const canEnd = auction.status === "ACTIVE" && !isEnded;
  const canSettle = (auction.status === "ENDED" || auction.status === "ADMIN_ENDED") && hasBids;

  const showAdminActions = !isEnded && (canApprove || canReject || canDeploy || canStart || canEnd);

  const handleApproveClick = () => setShowConfirmApprove(true);

   // Actually approve after confirmation
  const handleApproveConfirm = async () => {
    setIsApproving(true);
    try {
      const result = await auctionService.approveAuction(auction.id);

      // Kiểm tra xem đã deploy blockchain thành công chưa
      if (!result || !result.contract_address || !result.blockchain_id) {
        throw new Error("Deploy failed - No contract address returned from server");
      }

      setShowConfirmApprove(false);
      setSuccessType("approve");
      setSuccessMessage(
        `Auction "${auction.title}" has been approved and deployed to blockchain!`
      );
      setSuccessDetails({
        contract_address: result.contract_address,
        blockchain_id: result.blockchain_id,
        metadata_hash: result.metadata_hash,
      });

      await onActionComplete?.();
      setShowSuccess(true);

    } catch (err) {
      console.error("Approve error:", err);
      setShowConfirmApprove(false);
      
      const errMsg = 
        err?.response?.data?.error || 
        err?.response?.data?.details || 
        err?.message || 
        "Failed to approve auction";

      toast.error(errMsg);
    } finally {
      setIsApproving(false);
    }
  };
  const handleReject = async (reason) => {
    if (!reason?.trim()) {
      toast.error("Please provide a rejection reason");
      return;
    }
    setIsRejecting(true);
    try {
      await auctionService.rejectAuction(auction.id, reason);
      setSuccessType("reject");
      setSuccessMessage(`Auction "${auction.title}" has been rejected.\nReason: ${reason}`);
      setSuccessDetails(null);
      await onActionComplete?.();
      setShowSuccess(true);
    } catch (err) {
      toast.error(err?.response?.data?.error || "Failed to reject auction");
    } finally {
      setIsRejecting(false);
    }
  };

  const handleForceEndConfirm = async () => {
    setIsForceEnding(true);
    try {
      const result = await auctionService.endAuction(auction.id);
      setShowConfirmForceEnd(false);
      setSuccessType("forceEnd");
      setSuccessMessage(`Auction "${auction.title}" has been force ended on-chain!`);
      setSuccessDetails({ tx_hash: result?.tx_hash });
      await onActionComplete?.();
      setShowSuccess(true);
    } catch (err) {
      toast.error(err?.response?.data?.error || "Failed to force end auction");
    } finally {
      setIsForceEnding(false);
    }
  };

  const handleDeploy = async () => {
    try {
      await auctionService.deployAuction(auction.id);
      toast.success("Auction deployed!");
      await onActionComplete?.();
      onClose();
    } catch (err) {
      toast.error("Failed to deploy auction");
    }
  };

  const handleStart = async () => {
    try {
      await auctionService.startAuction(auction.id);
      toast.success("Auction started!");
      await onActionComplete?.();
      onClose();
    } catch (err) {
      toast.error("Failed to start auction");
    }
  };

  const handleSettle = async () => {
    try {
      await auctionService.settleAuction(auction.id);
      toast.success("Auction settled!");
      await onActionComplete?.();
      onClose();
    } catch (err) {
      toast.error("Failed to settle auction");
    }
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    setSuccessDetails(null);
    onClose();
  };

  const currentPriceInfo = formatPrice(auction.current_price_vnd);
  const startPriceInfo = formatPrice(auction.start_price_vnd);

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
          <div className="flex justify-between items-start p-6 border-b border-gray-700 sticky top-0 bg-gray-800/95 backdrop-blur-sm z-10">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3 mb-2">
                <Gavel className="w-8 h-8 text-indigo-400" />
                Auction #{auction.id} - {auction.title}
              </h2>
              <div className="flex items-center gap-4">
                <span className={`px-4 py-2 text-sm rounded-full ${statusInfo.color} text-white font-medium shadow-lg`}>
                  {statusInfo.text}
                </span>
                <span className="text-gray-400 text-sm">{timeLeft}</span>
              </div>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-white transition p-2 rounded-lg hover:bg-gray-700">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <div className="lg:row-span-2">
                <div className="relative">
                  <img
                    src={auction.images?.[0] || `https://via.placeholder.com/600x600?text=${encodeURIComponent(auction.title.substring(0, 1))}`}
                    alt={auction.title}
                    className="w-full h-80 lg:h-[500px] rounded-2xl shadow-2xl border border-gray-700 object-cover"
                  />
                  {auction.images && auction.images.length > 1 && (
                    <div className="absolute bottom-3 right-3 flex gap-1 bg-black/50 rounded-lg p-1">
                      {auction.images.slice(1, 4).map((img, idx) => (
                        <img key={idx} src={img} alt="Thumbnail" className="w-12 h-12 rounded object-cover cursor-pointer opacity-70 hover:opacity-100" />
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

              <div className="space-y-4 lg:col-span-1">
                <div className="bg-gradient-to-br from-indigo-900/20 to-purple-900/20 rounded-2xl p-6 border border-indigo-500/30 shadow-lg">
                  <p className="text-indigo-300 text-sm uppercase tracking-wide mb-3 flex items-center gap-2">
                    <DollarSign className="w-4 h-4" /> Current Price
                  </p>
                  <div className="space-y-2">
                    <div className="text-3xl lg:text-4xl font-bold text-white">{currentPriceInfo.vnd}</div>
                    <div className="text-indigo-300 text-sm">≈ {currentPriceInfo.eth}</div>
                  </div>
                  {highestBidderObj && (
                    <p className="text-green-400 text-sm mt-4 flex items-center gap-2 bg-green-900/20 rounded-lg p-2">
                    <Trophy className="w-4 h-4" /> 
                    {!isAdminEnded ? (highestBidderName ? `Highest Bidder: ${highestBidderName}` : "No bids placed") : "AdminEnded"}                    </p>
                                      )}
                </div>

                {auction.start_price_vnd && (
                  <div className="bg-gradient-to-br from-gray-900/30 to-gray-800/30 rounded-2xl p-4 border border-gray-600/50">
                    <p className="text-gray-400 text-xs uppercase tracking-wide mb-2">Starting Price</p>
                    <div className="text-lg font-semibold text-white">{startPriceInfo.vnd}</div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className={`p-4 rounded-2xl border ${isEndingSoon ? "border-red-500/50 bg-red-900/20" : "border-gray-600/50 bg-gray-900/30"}`}>
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className={`w-4 h-4 ${isEndingSoon ? "text-red-400" : "text-gray-400"}`} />
                      <span className="text-xs uppercase tracking-wide text-gray-400">Ends In</span>
                    </div>
                    <p className={`font-bold text-lg ${isEndingSoon ? "text-red-400 animate-pulse" : "text-white"}`}>{timeLeft}</p>
                  </div>

                  {startDate && (
                    <div className="p-4 rounded-2xl border border-gray-600/50 bg-gray-900/30">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className="text-xs uppercase tracking-wide text-gray-400">Started</span>
                      </div>
                      <p className="font-bold text-lg text-white">{startDate.toLocaleString("vi-VN")}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 rounded-2xl p-6 border border-gray-700/50 mb-8">
              <p className="text-gray-400 text-sm uppercase tracking-wide mb-4 flex items-center gap-2">
                <User className="w-4 h-4" /> Seller Information
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-gray-400" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-white text-lg">{sellerName}</p>
                  {sellerObj?.id && <code className="text-xs bg-gray-700 px-3 py-1 rounded-full text-gray-300 block mt-1">ID: {sellerObj.id}</code>}
                  {auction.sellerAddress && <code className="text-xs bg-gray-700 px-3 py-1 rounded-full text-gray-300 block mt-1 truncate max-w-[200px]">{auction.sellerAddress}</code>}
                </div>
              </div>

              {isRejected && (
                <div className="mt-5 rounded-xl border border-red-500/40 bg-red-900/20 p-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5 shrink-0" />
                    <div>
                      <p className="font-semibold text-red-200">Auction has been rejected by Admin.</p>
                      {auction.rejection_reason ? (
                        <p className="text-sm text-red-100/90 mt-2">Reason: {auction.rejection_reason}</p>
                      ) : (
                        <p className="text-sm text-red-100/70 mt-2">No rejection reason was provided.</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {isAdminEnded && (
                <div className="mt-5 rounded-xl border border-amber-500/40 bg-amber-900/20 p-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-300 mt-0.5 shrink-0" />
                    <div>
                      <p className="font-semibold text-amber-100">Auction đã bị Admin Force End.</p>
                      <p className="text-sm text-amber-100/80 mt-2">Phiên đấu giá đã được kết thúc thủ công bởi Admin.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {showAdminActions && (
              <div className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 rounded-2xl p-6 border border-gray-700/50 mb-8">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Gavel className="w-5 h-5 text-indigo-400" /> Admin Actions
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {canApprove && (
                    <button onClick={handleApproveClick} disabled={isApproving} className="bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl transition flex items-center justify-center gap-2 shadow-lg disabled:opacity-50">
                      {isApproving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Gavel className="w-4 h-4" />}
                      {isApproving ? "Approving..." : "Approve"}
                    </button>
                  )}
                  {canReject && (
                    <div className="flex gap-2">
                      <input type="text" placeholder="Rejection reason..." className="flex-1 px-3 py-3 bg-gray-700 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 placeholder-gray-400" onKeyDown={(e) => e.key === "Enter" && handleReject(e.target.value)} />
                      <button onClick={() => handleReject(document.querySelector('input[placeholder="Rejection reason..."]')?.value)} disabled={isRejecting} className="px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition flex items-center gap-1 shadow-lg disabled:opacity-50">
                        {isRejecting ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
                        Reject
                      </button>
                    </div>
                  )}
                  {canDeploy && <button onClick={handleDeploy} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition">Deploying Contract ....</button>}
                  {canStart && <button onClick={handleStart} className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 rounded-xl transition">Start Auction</button>}
                  {canEnd && (
                    <button onClick={() => setShowConfirmForceEnd(true)} disabled={isForceEnding} className="bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-xl transition flex items-center justify-center gap-2 shadow-lg disabled:opacity-50">
                      {isForceEnding ? <Loader2 className="w-4 h-4 animate-spin" /> : <AlertTriangle className="w-4 h-4" />}
                      {isForceEnding ? "Ending..." : "Force End"}
                    </button>
                  )}
                  {canSettle && <button onClick={handleSettle} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl transition">Settle & Transfer</button>}
                </div>
              </div>
            )}

            {isEnded && hasBids && !isAdminEnded && (
              <motion.div className="w-full bg-gradient-to-r from-green-900/40 to-emerald-900/40 border border-green-500/30 rounded-2xl p-6 text-center mb-8 shadow-xl" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-4 animate-bounce" />
                <h3 className="text-2xl font-bold text-green-300 mb-2">Auction Successfully Completed!</h3>
                {/* {highestBidderObj && (
                  <p className="text-green-200">🏆 Winner: <span className="font-mono bg-green-800/50 px-2 py-1 rounded">{highestBidderName}</span></p>
                )} */}
              </motion.div>
            )}

            {isAdminEnded && hasBids && (
              <motion.div className="w-full bg-gradient-to-r from-amber-900/40 to-orange-900/40 border border-amber-500/40 rounded-2xl p-6 text-center mb-8 shadow-xl" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                <AlertTriangle className="w-16 h-16 text-amber-300 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-amber-200 mb-2">Auction Force Ended by Admin</h3>
                {/* {highestBidderObj && (
                  <p className="text-amber-100">Winner: <span className="font-mono bg-amber-800/50 px-2 py-1 rounded">{highestBidderName}</span></p>
                )} */}
              </motion.div>
            )}

            {hasBids && (
              <div>
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                   Bid History <span className="text-gray-500 text-sm">({bids.length} total bids)</span>
                </h3>
                <div className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 rounded-2xl p-6 border border-gray-700/50 mb-8">
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
                            <tr key={index} className="border-b border-gray-700/50">
                              <td className="py-3 px-4 text-white">{bid.user_id?.full_name || bid.user_id?.username || "Unknown"}</td>
                              <td className="py-3 px-4 text-indigo-300 font-semibold">{price.vnd}</td>
                              <td className="py-3 px-4 text-indigo-400">{price.eth}</td>
                              <td className="py-3 px-4">
                                {bid.status === "WINNING" ? <span className="text-green-400 font-medium">Winning</span> : <span className="text-gray-400">{bid.status}</span>}
                              </td>
                              <td className="py-3 px-4 text-gray-400">{new Date(bid.createdAt).toLocaleString("vi-VN")}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {!hasBids && isEnded && (
              <div className="bg-gray-900/50 border border-gray-700 rounded-2xl p-12 text-center">
                <p className="text-gray-400 text-xl">No bids were placed on this auction.</p>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {showConfirmApprove && (
          <ConfirmApprovePopup
            key="confirm-approve"
            auctionTitle={auction.title}
            onConfirm={handleApproveConfirm}
            onCancel={() => setShowConfirmApprove(false)}
            isLoading={isApproving}
          />
        )}
        {showConfirmForceEnd && (
          <ConfirmForceEndPopup
            key="confirm-force-end"
            auctionTitle={auction.title}
            onConfirm={handleForceEndConfirm}
            onCancel={() => setShowConfirmForceEnd(false)}
            isLoading={isForceEnding}
          />
        )}
        {showSuccess && (
          <SuccessPopup
            key="success-popup"
            type={successType}
            message={successMessage}
            details={successDetails}
            onClose={handleSuccessClose}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default AuctionDetailModal;
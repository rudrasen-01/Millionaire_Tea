import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Wallet as WalletIcon, 
  Lock, 
  Unlock, 
  Clock, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight, 
  Plus, 
  Coffee,
  DollarSign,
  CheckCircle,
  AlertCircle,
  X
} from 'lucide-react';
import { PrimaryButton, SecondaryButton } from '../components/buttons/PrimaryButton';
import { SkeletonLoader } from '../components/loaders/SkeletonLoader';
import { useApp } from '../context/AppContext';

export function Wallet() {
  const { user, isLoading, setCurrentPage, addNotification, fetchUserWithdrawals, userWithdrawals } = useApp();
  const hasOpenWithdrawal = (userWithdrawals || []).some(w => w.status === 'pending' || w.status === 'accepted');

  React.useEffect(() => {
    if (user) fetchUserWithdrawals();
  }, [user]);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawPointsInput, setWithdrawPointsInput] = useState(0);
  const [isSubmittingWithdrawal, setIsSubmittingWithdrawal] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const canWithdraw = user.points >= 50000;
  const withdrawablePoints = canWithdraw ? user.points : 0;
  const lockedPoints = canWithdraw ? 0 : user.points;
  const filteredHistory = user.rewardHistory || [];

  const getTypeIcon = (type) => {
    switch (type) {
      case 'purchase':
        return <Coffee className="w-4 h-4" />;
      case 'bonus':
        return <Plus className="w-4 h-4" />;
      case 'milestone':
        return <TrendingUp className="w-4 h-4" />;
      default:
        return <Plus className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'purchase':
        return 'text-tea-amber bg-tea-amber/10';
      case 'bonus':
        return 'text-green-600 bg-green-100';
      case 'milestone':
        return 'text-tea-gold bg-tea-gold/10';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };
  return (
    <motion.div 
      className="min-h-screen p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          className="mb-8"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
                Reward Wallet 💰
              </h1>
              <p className="text-lg text-gray-600">
                Manage your reward points and view transaction history
              </p>
            </div>
            <SecondaryButton onClick={() => setCurrentPage('dashboard')}>
              Back to Dashboard
            </SecondaryButton>
          </div>
        </motion.div>

        {/* Points Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Total Points */}
          <motion.div
            className="glass-card-premium p-6 hover-lift"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Total Points</h2>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-tea-400 to-tea-600 flex items-center justify-center shadow-lg">
                <WalletIcon className="w-6 h-6 text-white" />
              </div>
            </div>
            
            <div className="text-4xl font-bold text-gray-900 mb-2">
              {user.points.toLocaleString()}
            </div>
            
            <div className="text-sm text-gray-600">
              Available in your reward account
            </div>
          </motion.div>

          {/* Withdrawable Points */}
          <motion.div
            className="glass-card-premium p-6 hover-lift relative overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-200 to-emerald-200 rounded-full filter blur-3xl opacity-30"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900">Withdrawable</h2>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg ${
                  canWithdraw 
                    ? 'bg-gradient-to-br from-green-400 to-emerald-600' 
                    : 'bg-gradient-to-br from-gray-300 to-gray-500'
                }`}>
                  {canWithdraw ? (
                    <Unlock className="w-6 h-6 text-white" />
                  ) : (
                    <Lock className="w-6 h-6 text-white" />
                  )}
                </div>
              </div>
              
              <div className="text-4xl font-bold text-gray-900 mb-2">
                {withdrawablePoints.toLocaleString()}
              </div>
              
              {canWithdraw ? (
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-medium">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Ready to withdraw
                </div>
              ) : (
                <div className="text-sm text-gray-600">
                  Unlock at 50,000 points
                </div>
              )}
            </div>
          </motion.div>

          {/* Locked Points */}
          <motion.div
            className="glass-card-premium p-6 hover-lift"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Status</h2>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-premium-400 to-premium-600 flex items-center justify-center shadow-lg">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
            </div>
            
            <div className="text-4xl font-bold text-gray-900 mb-2">
              {lockedPoints.toLocaleString()}
            </div>
            
            <div className="text-sm text-gray-600">
              {canWithdraw 
                ? 'All points unlocked'
                : `${(50000 - user.points).toLocaleString()} more to unlock`
              }
            </div>
          </motion.div>
        </div>

        {/* Withdraw Section */}
        <motion.div
          className="glass-card p-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Withdraw Points</h2>
            <div className="relative">
              <div 
                className="w-5 h-5 text-gray-400 cursor-help"
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
              >
                <Clock className="w-5 h-5" />
              </div>
              
              <AnimatePresence>
                {showTooltip && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 top-6 w-64 p-3 bg-gray-900 text-white text-sm rounded-lg shadow-lg z-10"
                  >
                    Withdrawals are only available once you reach 50,000 points. Keep earning!
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Withdrawable</span>
                <Unlock className="w-4 h-4 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-green-600">
                {withdrawablePoints.toLocaleString()}
              </div>
            </div>
            
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Locked</span>
                <Lock className="w-4 h-4 text-tea-brown" />
              </div>
              <div className="text-2xl font-bold text-tea-brown">
                {lockedPoints.toLocaleString()}
              </div>
            </div>
          </div>

          <PrimaryButton
            onClick={() => { if (canWithdraw && !hasOpenWithdrawal) { setWithdrawPointsInput(withdrawablePoints); setShowWithdrawModal(true); } }}
            disabled={!canWithdraw || hasOpenWithdrawal}
            tooltipText={!canWithdraw ? "Withdrawals unlock at 50,000 points" : (hasOpenWithdrawal ? 'You have a pending withdrawal' : null)}
            className="w-full"
          >
            {hasOpenWithdrawal ? 'Withdrawal Pending' : (canWithdraw ? 'Withdraw Points' : 'Withdraw Locked')}
          </PrimaryButton>

          {hasOpenWithdrawal && (
            <div className="text-sm text-yellow-700 mt-3">You have an open withdrawal request. You cannot submit another until it is processed.</div>
          )}

          <AnimatePresence>
            {showWithdrawModal && (
              <motion.div 
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowWithdrawModal(false)}
              >
                <motion.div 
                  className="glass-card-premium p-8 w-full max-w-md m-4 relative"
                  initial={{ scale: 0.9, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.9, y: 20 }}
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Close button */}
                  <button 
                    onClick={() => setShowWithdrawModal(false)}
                    className="absolute top-4 right-4 w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>

                  {/* Header */}
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center shadow-lg">
                      <DollarSign className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">Request Withdrawal</h3>
                      <p className="text-sm text-gray-600">Convert your points to cash</p>
                    </div>
                  </div>

                  {/* Info Message */}
                  <div className="mb-6 p-4 rounded-lg bg-blue-50 border border-blue-200">
                    <p className="text-sm text-blue-800">
                      Requested points will remain in your account until an admin accepts and confirms the withdrawal.
                    </p>
                  </div>

                  {/* Available Balance */}
                  <div className="mb-6 p-4 rounded-lg bg-gradient-to-r from-tea-50 to-premium-50 border border-tea-200">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 font-medium">Available Balance</span>
                      <span className="text-2xl font-bold text-tea-700">
                        {withdrawablePoints.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Input Field */}
                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Points to withdraw
                    </label>
                    <div className="relative">
                      <input 
                        type="number" 
                        min="1" 
                        max={withdrawablePoints} 
                        value={withdrawPointsInput} 
                        onChange={e => setWithdrawPointsInput(Number(e.target.value || 0))} 
                        className="input-field w-full pr-20"
                        placeholder="Enter amount"
                      />
                      <button
                        type="button"
                        onClick={() => setWithdrawPointsInput(withdrawablePoints)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 rounded-lg bg-tea-100 text-tea-700 text-sm font-medium hover:bg-tea-200 transition-colors"
                      >
                        Max
                      </button>
                    </div>
                    {withdrawPointsInput > 0 && (
                      <div className="mt-2 text-sm text-gray-600">
                        Request: <span className="font-semibold text-gray-900">{withdrawPointsInput.toLocaleString()} points</span>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <SecondaryButton 
                      onClick={() => setShowWithdrawModal(false)}
                      className="flex-1"
                    >
                      Cancel
                    </SecondaryButton>
                    <PrimaryButton
                      onClick={async () => {
                        const pts = Number(withdrawPointsInput) || 0;
                        if (pts <= 0 || pts > withdrawablePoints) { 
                          addNotification({ id: Date.now(), text: 'Enter a valid withdraw amount' }); 
                          return; 
                        }
                        setIsSubmittingWithdrawal(true);
                        try {
                          const res = await fetch('/api/rewards/withdrawals/request', { 
                            method: 'POST', 
                            credentials: 'include', 
                            headers: { 'Content-Type': 'application/json' }, 
                            body: JSON.stringify({ points: pts }) 
                          });
                          const body = await res.json().catch(() => ({}));
                          if (!res.ok) {
                            addNotification({ id: Date.now(), text: body?.message || 'Failed to create withdrawal request' });
                            setIsSubmittingWithdrawal(false);
                            return;
                          }
                          addNotification({ id: Date.now(), text: 'Withdrawal request created and is pending admin approval' });
                          try { fetchUserWithdrawals(); } catch (e) { /* ignore */ }
                          setShowWithdrawModal(false);
                        } catch (e) {
                          console.error('Withdraw request error', e);
                          addNotification({ id: Date.now(), text: 'Network error' });
                        } finally { 
                          setIsSubmittingWithdrawal(false); 
                        }
                      }}
                      disabled={isSubmittingWithdrawal}
                      className="flex-1"
                    >
                      {isSubmittingWithdrawal ? (
                        <span className="flex items-center gap-2">
                          <motion.div 
                            className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          />
                          Requesting...
                        </span>
                      ) : (
                        'Request Withdrawal'
                      )}
                    </PrimaryButton>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
          {/* User's withdrawal requests */}
          <motion.div 
            className="mt-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">Your Withdrawal Requests</h3>
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-tea-100 text-tea-700 text-sm font-medium">
                {(userWithdrawals || []).length} total
              </div>
            </div>
            
            {(userWithdrawals || []).length === 0 ? (
              <div className="text-center py-12 px-4">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                  <Clock className="w-8 h-8 text-gray-400" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">No withdrawal requests yet</h4>
                <p className="text-gray-600">Your withdrawal requests will appear here</p>
              </div>
            ) : (
              <div className="space-y-3">
                {(userWithdrawals || []).map((w, idx) => (
                  <motion.div
                    key={w._id}
                    className="glass-card p-4 hover:shadow-lg transition-all"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <div className="flex items-center justify-between flex-wrap gap-4">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          w.status === 'accepted' 
                            ? 'bg-green-100' 
                            : w.status === 'pending' 
                            ? 'bg-yellow-100' 
                            : 'bg-red-100'
                        }`}>
                          {w.status === 'accepted' ? (
                            <CheckCircle className="w-6 h-6 text-green-600" />
                          ) : w.status === 'pending' ? (
                            <Clock className="w-6 h-6 text-yellow-600" />
                          ) : (
                            <X className="w-6 h-6 text-red-600" />
                          )}
                        </div>
                        
                        <div>
                          <div className="text-sm text-gray-500 mb-1">
                            {new Date(w.requestedAt).toLocaleDateString('en-US', { 
                              year: 'numeric', 
                              month: 'short', 
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                          <div className="text-lg font-bold text-gray-900">
                            {(w.requestedPoints || 0).toLocaleString()} points
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          w.status === 'accepted' 
                            ? 'bg-green-100 text-green-700' 
                            : w.status === 'pending' 
                            ? 'bg-yellow-100 text-yellow-700' 
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {w.status.charAt(0).toUpperCase() + w.status.slice(1)}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </motion.div>

        {/* Transaction history removed per request */}
      </div>
    </motion.div>
  );
}

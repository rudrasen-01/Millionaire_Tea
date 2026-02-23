import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wallet as WalletIcon, Lock, Unlock, Clock, TrendingUp, ArrowUpRight, ArrowDownRight, Plus, Coffee } from 'lucide-react';
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
        return 'text-caramel bg-caramel/10';
      case 'bonus':
        return 'text-green-600 bg-green-100';
      case 'milestone':
        return 'text-darkBrown bg-darkBrown/10';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };
  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-br from-warmWhite via-cream to-beige/30 p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto">
        <motion.div 
          className="mb-8"
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-baloo font-bold text-darkBrown drop-shadow-sm mb-2">
                Reward Wallet 💰
              </h1>
              <p className="text-darkBrown/70 font-semibold">
                Manage your reward points and view transaction history
              </p>
            </div>
            <SecondaryButton onClick={() => setCurrentPage('dashboard')}>
              Back to Dashboard
            </SecondaryButton>
          </div>
        </motion.div>

        {/* Points Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <motion.div
            className="bg-gradient-to-br from-cream to-warmWhite border-2 border-caramel/40 rounded-3xl p-6 shadow-xl hover:shadow-2xl hover:border-caramel transition-all"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-baloo font-bold text-darkBrown">Total Points</h2>
              <WalletIcon className="w-6 h-6 text-caramel" />
            </div>
            
            <div className="text-3xl font-bold text-caramel mb-2">
              {user.points.toLocaleString()}
            </div>
            
            <div className="text-sm text-darkBrown/70 font-semibold">
              Available in your reward account
            </div>
          </motion.div>

          <motion.div
            className="bg-gradient-to-br from-cream to-warmWhite border-2 border-caramel/40 rounded-3xl p-6 shadow-xl hover:shadow-2xl hover:border-caramel transition-all"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-baloo font-bold text-darkBrown">Status</h2>
              {canWithdraw ? (
                <Unlock className="w-6 h-6 text-green-600" />
              ) : (
                <Lock className="w-6 h-6 text-tea-brown" />
              )}
            </div>
            
            <div className={`text-lg font-bold mb-2 ${
              canWithdraw ? 'text-green-600' : 'text-darkBrown'
            }`}>
              {canWithdraw ? 'Unlocked' : 'Locked'}
            </div>
            
            <div className="text-sm text-darkBrown/70 font-semibold">
              {canWithdraw 
                ? 'You can withdraw your points now!'
                : `Unlock at 50,000 points (${(50000 - user.points).toLocaleString()} to go)`
              }
            </div>
          </motion.div>
        </div>

        {/* Withdraw Section */}
        <motion.div
          className="bg-gradient-to-br from-cream to-warmWhite border-2 border-caramel/40 rounded-3xl p-6 shadow-xl mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-baloo font-bold text-darkBrown">Withdraw Points</h2>
            <div className="relative">
              <div 
                className="w-5 h-5 text-caramel cursor-help"
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
                    className="absolute right-0 top-6 w-64 p-3 bg-gradient-to-r from-darkBrown to-caramel text-cream text-sm font-semibold rounded-lg shadow-xl z-10"
                  >
                    Withdrawals are only available once you reach 50,000 points. Keep earning!
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="p-4 border-2 border-green-400/40 bg-green-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-green-700 font-semibold">Withdrawable</span>
                <Unlock className="w-4 h-4 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-green-600">
                {withdrawablePoints.toLocaleString()}
              </div>
            </div>
            
            <div className="p-4 border-2 border-caramel/40 bg-beige/30 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-darkBrown font-semibold">Locked</span>
                <Lock className="w-4 h-4 text-caramel" />
              </div>
              <div className="text-2xl font-bold text-caramel">
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
            <div className="text-sm text-darkBrown font-semibold mt-3 p-3 bg-caramel/10 border-2 border-caramel/40 rounded-lg">You have an open withdrawal request. You cannot submit another until it is processed.</div>
          )}

          {showWithdrawModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
              <div className="bg-gradient-to-br from-cream to-warmWhite border-2 border-caramel/40 rounded-3xl p-6 w-full max-w-md shadow-2xl">
                <h3 className="text-lg font-baloo font-bold text-darkBrown mb-3">Request Withdrawal</h3>
                <p className="text-sm text-darkBrown/70 font-semibold mb-4">Requested points will remain in your account until an admin accepts and confirms the withdrawal.</p>
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-darkBrown mb-1">Points to withdraw</label>
                  <input type="number" min="1" max={withdrawablePoints} value={withdrawPointsInput} onChange={e => setWithdrawPointsInput(Number(e.target.value || 0))} className="w-full px-3 py-2 border-2 border-caramel/30 bg-warmWhite rounded-lg focus:outline-none focus:ring-2 focus:ring-caramel focus:border-caramel" />
                </div>
                <div className="flex justify-end space-x-2">
                  <button onClick={() => { setShowWithdrawModal(false); }} className="px-4 py-2 rounded-lg border-2 border-caramel/40 text-darkBrown font-semibold hover:bg-beige/30 transition-all">Cancel</button>
                  <button onClick={async () => {
                    const pts = Number(withdrawPointsInput) || 0;
                    if (pts <= 0 || pts > withdrawablePoints) { addNotification({ id: Date.now(), text: 'Enter a valid withdraw amount' }); return; }
                    setIsSubmittingWithdrawal(true);
                    try {
                      const res = await fetch('/api/rewards/withdrawals/request', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ points: pts }) });
                      const body = await res.json().catch(() => ({}));
                      if (!res.ok) {
                        addNotification({ id: Date.now(), text: body?.message || 'Failed to create withdrawal request' });
                        setIsSubmittingWithdrawal(false);
                        return;
                      }
                      addNotification({ id: Date.now(), text: 'Withdrawal request created and is pending admin approval' });
                      // refresh user's withdrawal list immediately
                      try { fetchUserWithdrawals(); } catch (e) { /* ignore */ }
                      setShowWithdrawModal(false);
                    } catch (e) {
                      console.error('Withdraw request error', e);
                      addNotification({ id: Date.now(), text: 'Network error' });
                    } finally { setIsSubmittingWithdrawal(false); }
                  }} className="px-4 py-2 rounded-lg bg-gradient-to-r from-caramel to-darkBrown text-cream font-bold hover:shadow-lg transition-all disabled:opacity-50" disabled={isSubmittingWithdrawal}>{isSubmittingWithdrawal ? 'Requesting…' : 'Request Withdrawal'}</button>
                </div>
              </div>
            </div>
          )}
          {/* User's withdrawal requests */}
          <div className="mt-6">
            <h3 className="text-lg font-baloo font-bold text-darkBrown mb-3">Your Withdrawal Requests</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-caramel/30">
                    <th className="text-left py-2 px-3 text-darkBrown font-bold">Requested At</th>
                    <th className="text-left py-2 px-3 text-darkBrown font-bold">Points</th>
                    <th className="text-left py-2 px-3 text-darkBrown font-bold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {(userWithdrawals || []).length === 0 ? (
                    <tr><td className="py-3 px-3 text-darkBrown/70" colSpan={3}>No withdrawal requests.</td></tr>
                  ) : (
                    (userWithdrawals || []).map(w => (
                      <tr key={w._id} className="border-b border-caramel/20 hover:bg-beige/30 transition-colors">
                        <td className="py-2 px-3 text-darkBrown">{new Date(w.requestedAt).toLocaleString()}</td>
                        <td className="py-2 px-3 text-caramel font-bold">{(w.requestedPoints || 0).toLocaleString()}</td>
                        <td className="py-2 px-3 text-darkBrown/70">{w.status}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>

        {/* Transaction history removed per request */}
      </div>
    </motion.div>
  );
}

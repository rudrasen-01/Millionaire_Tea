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
        <motion.div 
          className="mb-8"
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Reward Wallet 💰
              </h1>
              <p className="text-gray-600">
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
            className="glass-card p-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Total Points</h2>
              <WalletIcon className="w-6 h-6 text-tea-amber" />
            </div>
            
            <div className="text-3xl font-bold text-gray-900 mb-2">
              {user.points.toLocaleString()}
            </div>
            
            <div className="text-sm text-gray-600">
              Available in your reward account
            </div>
          </motion.div>

          <motion.div
            className="glass-card p-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Status</h2>
              {canWithdraw ? (
                <Unlock className="w-6 h-6 text-green-600" />
              ) : (
                <Lock className="w-6 h-6 text-tea-brown" />
              )}
            </div>
            
            <div className={`text-lg font-semibold mb-2 ${
              canWithdraw ? 'text-green-600' : 'text-tea-brown'
            }`}>
              {canWithdraw ? 'Unlocked' : 'Locked'}
            </div>
            
            <div className="text-sm text-gray-600">
              {canWithdraw 
                ? 'You can withdraw your points now!'
                : `Unlock at 50,000 points (${(50000 - user.points).toLocaleString()} to go)`
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

          {showWithdrawModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
              <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <h3 className="text-lg font-semibold mb-3">Request Withdrawal</h3>
                <p className="text-sm text-gray-600 mb-4">Requested points will remain in your account until an admin accepts and confirms the withdrawal.</p>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Points to withdraw</label>
                  <input type="number" min="1" max={withdrawablePoints} value={withdrawPointsInput} onChange={e => setWithdrawPointsInput(Number(e.target.value || 0))} className="w-full px-3 py-2 border rounded" />
                </div>
                <div className="flex justify-end space-x-2">
                  <button onClick={() => { setShowWithdrawModal(false); }} className="px-4 py-2 rounded border">Cancel</button>
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
                  }} className="px-4 py-2 rounded bg-amber-500 text-white" disabled={isSubmittingWithdrawal}>{isSubmittingWithdrawal ? 'Requesting…' : 'Request Withdrawal'}</button>
                </div>
              </div>
            </div>
          )}
          {/* User's withdrawal requests */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-3">Your Withdrawal Requests</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-3">Requested At</th>
                    <th className="text-left py-2 px-3">Points</th>
                    <th className="text-left py-2 px-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {(userWithdrawals || []).length === 0 ? (
                    <tr><td className="py-3 px-3" colSpan={3}>No withdrawal requests.</td></tr>
                  ) : (
                    (userWithdrawals || []).map(w => (
                      <tr key={w._id} className="border-b hover:bg-gray-50">
                        <td className="py-2 px-3">{new Date(w.requestedAt).toLocaleString()}</td>
                        <td className="py-2 px-3">{(w.requestedPoints || 0).toLocaleString()}</td>
                        <td className="py-2 px-3">{w.status}</td>
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

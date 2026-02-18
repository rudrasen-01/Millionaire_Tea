import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User as UserIcon, Search, Eye } from 'lucide-react';
import { PrimaryButton, IconButton } from '../components/buttons/PrimaryButton';
import { KPICard } from '../components/charts/ProgressChart';
import { useApp } from '../context/AppContext';

function formatDate(d) {
  const dt = new Date(d);
  const pad = (v) => String(v).padStart(2, '0');
  return `${pad(dt.getDate())}/${pad(dt.getMonth()+1)}/${dt.getFullYear()} ${pad(dt.getHours())}:${pad(dt.getMinutes())}`;
}

export function User() {
  const { user, adminKPIs, isLoading, setCurrentPage, setUser, addNotification, notifications } = useApp();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch('/api/auth/me', { credentials: 'include' });
        if (!mounted) return;
        if (res.ok) {
          const d = await res.json();
          try { console.debug('[User.jsx] /api/auth/me ->', d); } catch(e){}
          if (d?.user) setUser(d.user);
        }
      } catch (e) {
        // ignore
      }
    })();
    return () => { mounted = false; };
  }, [setUser]);

  const handleClaim = async () => {
    if (!user) return;
    try {
      const res = await fetch('/api/rewards/claim', { method: 'POST', credentials: 'include' });
      const data = await res.json();
      if (!res.ok) {
        addNotification({ id: Date.now(), text: data?.message || 'Claim failed' });
        return;
      }
      // refresh user state
      const meRes = await fetch('/api/auth/me', { credentials: 'include' });
      if (meRes.ok) {
        const d = await meRes.json();
        setUser(d.user);
      }
      addNotification({ id: Date.now(), text: `Claim successful: ${data.amount}` });
    } catch (e) {
      console.error('Claim error', e);
      addNotification({ id: Date.now(), text: 'Network error while claiming' });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">Loading user dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <motion.div className="min-h-screen p-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
            <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">🍵 User Dashboard</h1>
              <p className="text-gray-600">Your rewards, progress and wallet</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <KPICard title="Approx. Avg Points" value={adminKPIs.avgUserPoints} change={3.2} icon={UserIcon} color="tea-amber" />
          <KPICard title="Your Rank" value={user?.rank ?? user?.rankPosition ?? '-'} change={0.5} icon={UserIcon} color="tea-brown" />
          <KPICard title="Total Rewards Issued" value={adminKPIs.totalRewardsIssued} change={1.2} icon={UserIcon} color="tea-gold" />
          <KPICard title="Total Revenue" value={`$${adminKPIs.totalRevenue}`} change={2.1} icon={UserIcon} color="tea-amber" />
        </div>

        <div className="glass-card p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold">Withdrawable Rewards</h3>
              <p className="text-sm text-gray-600">You have {user?.claimableRewards ? user.claimableRewards.toLocaleString() : 0} available to withdraw.</p>
              <p className="text-xs text-gray-400">You must have at least {adminKPIs?.claimThresholdPoints ?? 50000} points to withdraw.</p>
            </div>
            <div>
              <PrimaryButton
                onClick={handleClaim}
                disabled={!(user?.points >= (adminKPIs?.claimThresholdPoints ?? 50000) && user?.claimableRewards > 0)}
              >
                Withdraw
              </PrimaryButton>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="glass-card p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Notifications</h2>
          </div>
          {user && notifications && notifications.length === 0 && (
            <div className="text-sm text-gray-500">No notifications</div>
          )}
          <div className="space-y-3">
            {notifications && notifications.map((n) => (
              <div key={n.id || n._id} className={`p-3 border rounded-md bg-white ${n.read ? 'opacity-60' : ''}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-800">{n.message || n.text}</div>
                    <div className="text-xs text-gray-500">Points added: {typeof n.rewardPointsAdded === 'number' ? `+${n.rewardPointsAdded}` : '-'} • Total: {typeof n.totalPoints === 'number' ? n.totalPoints : '-'}</div>
                  </div>
                  <div className="flex flex-col items-end">
                    <div className="text-xs text-gray-400">{n.createdAt ? formatDate(n.createdAt) : ''}</div>
                    <div className="mt-2 text-xs text-gray-400">{n.read ? 'Read' : ''}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Your Activity</h2>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type="text" placeholder="Search activity..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg" />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Date</th>
                  <th className="text-left py-3 px-4">Activity</th>
                  <th className="text-left py-3 px-4">Points</th>
                  <th className="text-left py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {[{id:1,date:'2026-02-01',activity:'Purchased Green Tea',points:50}].map(row=> (
                  <tr key={row.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">{row.date}</td>
                    <td className="py-3 px-4">{row.activity}</td>
                    <td className="py-3 px-4">{row.points}</td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <IconButton><Eye className="w-4 h-4" /></IconButton>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default User;

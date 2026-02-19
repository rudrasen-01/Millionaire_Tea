import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User as UserIcon, Search, Eye } from 'lucide-react';
import { PrimaryButton, IconButton } from '../components/buttons/PrimaryButton';
import { KPICard } from '../components/charts/ProgressChart';
import { useApp } from '../context/AppContext';

export function User() {
  const { user, adminKPIs, isLoading, setCurrentPage, setUser, addNotification } = useApp();
  const [searchTerm, setSearchTerm] = useState('');

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
    <motion.div className="min-h-screen bg-gradient-to-br from-warmWhite via-cream to-beige/30 p-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
            <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-baloo font-bold text-darkBrown mb-2 drop-shadow-sm">☕ User Dashboard</h1>
              <p className="text-darkBrown/70 font-semibold">Your rewards, progress and wallet</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <KPICard title="Approx. Avg Points" value={adminKPIs.avgUserPoints} change={3.2} icon={UserIcon} color="tea-amber" />
          <KPICard title="Your Rank" value={user?.rank ?? user?.rankPosition ?? '-'} change={0.5} icon={UserIcon} color="tea-brown" />
          <KPICard title="Total Rewards Issued" value={adminKPIs.totalRewardsIssued} change={1.2} icon={UserIcon} color="tea-gold" />
          <KPICard title="Total Revenue" value={`$${adminKPIs.totalRevenue}`} change={2.1} icon={UserIcon} color="tea-amber" />
        </div>

        <div className="bg-gradient-to-br from-cream to-warmWhite border-2 border-caramel/40 rounded-3xl p-6 mb-8 shadow-xl hover:shadow-2xl transition-all hover:border-caramel">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-baloo font-bold text-darkBrown">Withdrawable Rewards</h3>
              <p className="text-sm text-darkBrown/70 font-medium">You have {user?.claimableRewards ? user.claimableRewards.toLocaleString() : 0} available to withdraw.</p>
              <p className="text-xs text-caramel font-semibold">You must have at least {adminKPIs?.claimThresholdPoints ?? 50000} points to withdraw.</p>
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

        <div className="bg-gradient-to-br from-cream to-warmWhite border-2 border-caramel/40 rounded-3xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-baloo font-bold text-darkBrown">Your Activity</h2>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-caramel" />
                <input type="text" placeholder="Search activity..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 pr-4 py-2 border-2 border-caramel/30 bg-warmWhite rounded-lg focus:outline-none focus:ring-2 focus:ring-caramel focus:border-caramel" />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-caramel/30">
                  <th className="text-left py-3 px-4 text-darkBrown font-baloo font-bold">Date</th>
                  <th className="text-left py-3 px-4 text-darkBrown font-baloo font-bold">Activity</th>
                  <th className="text-left py-3 px-4 text-darkBrown font-baloo font-bold">Points</th>
                  <th className="text-left py-3 px-4 text-darkBrown font-baloo font-bold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {[{id:1,date:'2026-02-01',activity:'Purchased Green Tea',points:50}].map(row=> (
                  <tr key={row.id} className="border-b border-beige/50 hover:bg-beige/30 transition-colors">
                    <td className="py-3 px-4 text-darkBrown/80">{row.date}</td>
                    <td className="py-3 px-4 text-darkBrown/80">{row.activity}</td>
                    <td className="py-3 px-4 text-caramel font-semibold">{row.points}</td>
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

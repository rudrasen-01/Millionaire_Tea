import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, DollarSign, Gift, TrendingUp, Search, Filter, Download, Edit, Star } from 'lucide-react';
// charts removed from Admin overview
import { PrimaryButton, SecondaryButton, IconButton } from '../components/buttons/PrimaryButton';
import { SkeletonLoader, TableSkeleton } from '../components/loaders/SkeletonLoader';
import { useApp } from '../context/AppContext';

export function Admin({ initialTab }) {
  const { adminKPIs, allUsers, vendorStats, isLoading, setCurrentPage, dispatch, addNotification } = useApp();
  const [activeTab, setActiveTab] = useState(initialTab || 'overview');

  // update active tab when sidebar navigation changes `initialTab`
  useEffect(() => {
    if (initialTab && initialTab !== activeTab) setActiveTab(initialTab);
  }, [initialTab]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showAddTeasModal, setShowAddTeasModal] = useState(false);
  const [teasToAdd, setTeasToAdd] = useState(1);
  const [isSubmittingTeas, setIsSubmittingTeas] = useState(false);
  // Quick dashboard tea update states (uses existing Add Teas modal)
  const [dashboardSearch, setDashboardSearch] = useState('');

  const filteredUsers = (() => {
    const q = (searchTerm || '').trim().toLowerCase();
    if (!q) return [];
    return allUsers.filter(user =>
      String(user.name || '').toLowerCase().includes(q) ||
      String(user.email || '').toLowerCase().includes(q) ||
      String(user._id || user.id || '').toLowerCase().includes(q) ||
      String(user.mobile || user.phone || user.phoneNumber || '').toLowerCase().includes(q)
    );
  })();

  const dashboardResults = allUsers.filter(u => {
    const q = (dashboardSearch || '').trim().toLowerCase();
    if (!q) return false; // empty search shows nothing to avoid clutter; admin can type to find
    const id = String(u.id || u._id || '').toLowerCase();
    const name = String(u.name || '').toLowerCase();
    const email = String(u.email || '').toLowerCase();
    const mobile = String(u.mobile || u.phone || u.phoneNumber || '').toLowerCase();
    return name.includes(q) || email.includes(q) || mobile.includes(q) || id.includes(q);
  }).slice(0, 50);

  const exportUsersToCSV = (users) => {
    if (!users || users.length === 0) {
      addNotification({ id: Date.now(), text: 'No users to export' });
      return;
    }
    const headers = ['ID', 'Name', 'Email', 'Rank', 'Points', 'Teas', 'Status'];
    const rows = users.map(u => [
      u.id || u._id || '',
      u.name || '',
      u.email || '',
      u.rank ?? u.rankPosition ?? '',
      (u.points ?? 0).toString(),
      (u.teasConsumed ?? 0).toString(),
      // compute status from teasConsumed
      (u.teasConsumed || 0) >= 1000 ? 'Gold' : (u.teasConsumed || 0) >= 100 ? 'Silver' : 'Basic'
    ]);

    const escapeCell = (cell) => `"${String(cell).replace(/"/g, '""')}"`;
    const csv = [headers.map(escapeCell).join(','), ...rows.map(r => r.map(escapeCell).join(','))].join('\r\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `users_export_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  

  if (isLoading) {
    return (
      <div className="min-h-screen p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <SkeletonLoader height="h-8 w-48 mb-2" />
            <SkeletonLoader height="h-4 w-96" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-gradient-to-br from-cream to-warmWhite border-2 border-caramel/40 rounded-2xl p-6 shadow-xl">
                <SkeletonLoader height="h-6 w-32 mb-4" />
                <SkeletonLoader height="h-8 w-24 mb-2" />
                <SkeletonLoader height="h-4 w-16" />
              </div>
            ))}
          </div>
          
          <div className="bg-gradient-to-br from-cream to-warmWhite border-2 border-caramel/40 rounded-3xl p-6 shadow-xl">
            <SkeletonLoader height="h-6 w-48 mb-4" />
            <TableSkeleton rows={5} />
          </div>
        </div>
      </div>
    );
  }

  const [awards, setAwards] = useState([]);

  const getStatus = (u) => {
    const teas = Number(u?.teasConsumed || 0);
    if (teas >= 1000) return { label: 'Gold', classes: 'bg-luxury-gold/20 text-darkBrown' };
    if (teas >= 100) return { label: 'Silver', classes: 'bg-slate-100 text-slate-700' };
    return { label: 'Basic', classes: 'bg-gray-100 text-gray-600' };
  };

  const tabs = [
    { id: 'overview', label: 'Dashboard', icon: TrendingUp },
  ];

  useEffect(() => {
    // fetch award history when awards tab is active
    if (activeTab === 'awards') {
      (async () => {
        try {
          const res = await fetch('/api/rewards/admin/awards', { credentials: 'include' });
          if (!res.ok) throw new Error('Failed to fetch awards');
          const body = await res.json();
          setAwards(body.awards || []);
        } catch (e) {
          console.error('Fetch awards error', e);
          addNotification({ id: Date.now(), text: 'Could not load awards' });
        }
      })();
    }
    // fetch withdrawal requests when withdrawals tab active
    if (activeTab === 'withdrawals') {
      (async () => {
        try {
          const res = await fetch('/api/rewards/admin/withdrawals', { credentials: 'include' });
          if (!res.ok) throw new Error('Failed to fetch withdrawals');
          const body = await res.json();
          setWithdrawals(body.withdrawals || []);
        } catch (e) {
          console.error('Fetch withdrawals error', e);
          addNotification({ id: Date.now(), text: 'Could not load withdrawals' });
        }
      })();
    }
    // Listen for real-time awards updates
    const onAwardsUpdated = (e) => { if (e?.detail) setAwards(e.detail); };
    window.addEventListener('app:awardsUpdated', onAwardsUpdated);
    // Listen for admin withdrawals updates
    const onWithdrawalsUpdated = (e) => { if (e?.detail) setWithdrawals(e.detail); };
    window.addEventListener('app:withdrawalsAdminUpdated', onWithdrawalsUpdated);
    return () => { window.removeEventListener('app:awardsUpdated', onAwardsUpdated); window.removeEventListener('app:withdrawalsAdminUpdated', onWithdrawalsUpdated); };
  }, [activeTab]);

  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    if (activeTab === 'reviews') {
      (async () => {
        try {
          const res = await fetch('/api/reviews', { credentials: 'include' });
          if (!res.ok) throw new Error('Failed to fetch reviews');
          const body = await res.json();
          setReviews(body.reviews || []);
        } catch (e) {
          console.error('Fetch reviews error', e);
          addNotification({ id: Date.now(), text: 'Could not load reviews' });
        }
      })();
    }
  }, [activeTab]);

  const [withdrawals, setWithdrawals] = useState([]);

  const handleAccept = async (id) => {
    try {
      const res = await fetch(`/api/rewards/admin/withdrawals/${id}/accept`, { method: 'POST', credentials: 'include' });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) { addNotification({ id: Date.now(), text: body?.message || 'Accept failed' }); return; }
      addNotification({ id: Date.now(), text: 'Request accepted (pending confirmation)' });
      const r = await fetch('/api/rewards/admin/withdrawals', { credentials: 'include' }); if (r.ok) { const b = await r.json(); setWithdrawals(b.withdrawals || []); }
    } catch (e) { console.error('Accept error', e); addNotification({ id: Date.now(), text: 'Network error' }); }
  };

  const handleConfirm = async (id) => {
    try {
      const res = await fetch(`/api/rewards/admin/withdrawals/${id}/confirm`, { method: 'POST', credentials: 'include' });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) { addNotification({ id: Date.now(), text: body?.message || 'Confirm failed' }); return; }
      addNotification({ id: Date.now(), text: 'Withdrawal confirmed and processed' });
      // refresh withdrawals and dashboard
      const [r1, dash] = await Promise.all([ fetch('/api/rewards/admin/withdrawals', { credentials: 'include' }), fetch('/api/rewards/dashboard', { credentials: 'include' }) ]);
      if (r1.ok) { const b = await r1.json(); setWithdrawals(b.withdrawals || []); }
      if (dash.ok) { const d = await dash.json(); dispatch({ type: 'SET_ADMIN_KPIS', payload: d.admin || {} }); }
    } catch (e) { console.error('Confirm error', e); addNotification({ id: Date.now(), text: 'Network error' }); }
  };

  const handleDeleteReview = async (id) => {
    try {
      const res = await fetch(`/api/reviews/${id}`, { method: 'DELETE', credentials: 'include' });
      let respBody = null;
      try { respBody = await res.json(); } catch (err) { try { respBody = { text: await res.text() }; } catch (e) { respBody = null; } }
      if (!res.ok) {
        const msg = (respBody && (respBody.message || respBody.text)) || `Delete failed (${res.status})`;
        addNotification({ id: Date.now(), text: msg });
        return;
      }
      setReviews(prev => prev.filter(rr => rr._id !== id));
      addNotification({ id: Date.now(), text: 'Review deleted' });
    } catch (e) {
      console.error('Delete review network error', e);
      addNotification({ id: Date.now(), text: 'Network error' });
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
        {/* Header */}
        <motion.div 
          className="mb-8"
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.3 }}
        >
            <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-baloo font-bold text-darkBrown mb-2 drop-shadow-sm">
               Admin Dashboard
              </h1>
              <p className="text-darkBrown/70 font-semibold">
                Manage users, rewards, and system settings
              </p>
            </div>
          </div>
        </motion.div>

        {/* Navigation Tabs */}
        <motion.div 
          className="bg-gradient-to-r from-cream to-beige border-2 border-caramel/40 rounded-2xl p-2 mb-8 shadow-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <div className="flex space-x-2">
            {tabs.map(tab => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
                    active 
                      ? 'bg-gradient-to-r from-caramel to-darkBrown text-cream shadow-lg border border-beige/50' 
                      : 'text-darkBrown hover:bg-beige/50 border border-transparent'
                  }`}
                  aria-pressed={active}
                >
                  <Icon className={`w-4 h-4 ${active ? 'text-cream' : 'text-caramel'}`} />
                  <span className={`${active ? 'font-bold' : 'font-semibold'}`}>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {/* Users (embedded) on Overview - identical to Users tab */}
            <div className="bg-gradient-to-br from-cream to-warmWhite border-2 border-caramel/40 rounded-3xl p-6 mb-6 shadow-xl hover:shadow-2xl transition-all">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                <h2 className="text-xl font-baloo font-bold text-darkBrown">User Management</h2>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full">
                  <div className="relative flex-1 min-w-0">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-caramel" />
                    <input
                      type="text"
                      placeholder="Search users..."
                      value={dashboardSearch}
                      onChange={(e) => setDashboardSearch(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border-2 border-caramel/30 bg-warmWhite rounded-lg focus:outline-none focus:ring-2 focus:ring-caramel focus:border-caramel"
                    />
                  </div>

                  <div className="mt-3 sm:mt-0 sm:ml-4 flex-shrink-0 w-full sm:w-auto">
                    <PrimaryButton onClick={() => exportUsersToCSV(dashboardResults)} className="w-full sm:w-auto">
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </PrimaryButton>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-caramel/30">
                      <th className="text-left py-3 px-4 text-darkBrown font-baloo font-bold">User</th>
                      <th className="text-left py-3 px-4 text-darkBrown font-baloo font-bold">Rank</th>
                      <th className="text-left py-3 px-4 text-darkBrown font-baloo font-bold">Points</th>
                      <th className="text-left py-3 px-4 text-darkBrown font-baloo font-bold">Teas</th>
                      <th className="text-left py-3 px-4 text-darkBrown font-baloo font-bold">Status</th>
                      <th className="text-left py-3 px-4 text-darkBrown font-baloo font-bold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(() => {
                      const overviewUsers = dashboardResults || [];
                      if (overviewUsers.length === 0) {
                        return <tr><td className="py-4 px-4 text-darkBrown/70" colSpan={6}>{dashboardSearch.trim() ? 'No users found.' : 'Type to search users by name, email, ID or mobile.'}</td></tr>;
                      }
                      return overviewUsers.map((user, index) => (
                        <tr key={user.id || user._id || index} className="border-b border-beige/50 hover:bg-beige/30 transition-colors">
                          <td className="py-3 px-4">
                            <div className="flex items-center space-x-3">
                              <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full border-2 border-caramel/30" />
                              <div>
                                <div className="font-semibold text-darkBrown">{user.name}</div>
                                <div className="text-sm text-darkBrown/60">{user.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-caramel font-semibold">{user.rank ?? user.rankPosition ?? '-'}</td>
                          <td className="py-3 px-4 text-darkBrown font-semibold">{user.points.toLocaleString()}</td>
                          <td className="py-3 px-4 text-caramel font-semibold">{user.teasConsumed || 0}</td>
                          <td className="py-3 px-4">
                            {(() => {
                              const st = getStatus(user);
                              return (
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${st.classes}`}>
                                  {st.label}
                                </span>
                              );
                            })()}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex space-x-2">
                              <IconButton onClick={() => {
                                setSelectedUser(user);
                                setShowAddTeasModal(true);
                              }}>
                                <Edit className="w-4 h-4" />
                              </IconButton>
                            </div>
                          </td>
                        </tr>
                      ));
                    })()}
                  </tbody>
                </table>
              </div>
            </div>
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="bg-gradient-to-br from-cream to-warmWhite border-2 border-caramel/40 rounded-2xl p-6 shadow-xl hover:shadow-2xl hover:border-caramel transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-3xl font-baloo font-bold text-darkBrown">{adminKPIs?.totalUsers ?? 0}</p>
                    <p className="text-sm text-darkBrown/70 font-semibold">Total Users</p>
                  </div>
                  <div className="text-caramel">
                    <TrendingUp />
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-cream to-warmWhite border-2 border-caramel/40 rounded-2xl p-6 shadow-xl hover:shadow-2xl hover:border-caramel transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-3xl font-baloo font-bold text-darkBrown">{adminKPIs?.rewardsIssued ?? 0}</p>
                      <p className="text-sm text-darkBrown/70 font-semibold">Awards Issued</p>
                  </div>
                  <div className="text-caramel">
                    <Gift />
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-cream to-warmWhite border-2 border-caramel/40 rounded-2xl p-6 shadow-xl hover:shadow-2xl hover:border-caramel transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-3xl font-baloo font-bold text-darkBrown">{adminKPIs?.totalTeasSold ?? 0}</p>
                    <p className="text-sm text-darkBrown/70 font-semibold">Total Teas Sold</p>
                  </div>
                  <div className="text-caramel">
                    <TrendingUp />
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-cream to-warmWhite border-2 border-caramel/40 rounded-2xl p-6 shadow-xl hover:shadow-2xl hover:border-caramel transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-3xl font-baloo font-bold text-caramel">₹{adminKPIs?.adminPoolMoney ?? 0}</p>
                    <p className="text-sm text-darkBrown/70 font-semibold">Total Revenue</p>
                  </div>
                  <div className="text-darkBrown text-2xl font-bold leading-none">
                    ₹
                  </div>
                </div>
              </div>
            </div>

            {/* Charts */}
            <div className="mb-6">
              <div className="bg-gradient-to-br from-cream to-warmWhite border-2 border-caramel/40 rounded-3xl p-6 shadow-xl hover:shadow-2xl hover:border-caramel transition-all">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h3 className="text-lg font-baloo font-bold text-darkBrown">Total Teas Sold Progress</h3>
                    <div className="text-sm text-darkBrown/70 font-semibold">Progress toward transfer milestone</div>
                  </div>
                  <div className="text-sm font-bold text-caramel">
                    {adminKPIs?.totalTeasSold ?? vendorStats?.totalTeasSold ?? 0} / {adminKPIs?.transferMilestoneTeas ?? 5000} teas
                  </div>
                </div>
                <div className="w-full bg-beige/40 rounded-full h-4 overflow-hidden border border-caramel/30">
                  {(() => {
                    const total = Number(adminKPIs?.totalTeasSold ?? vendorStats?.totalTeasSold ?? 0);
                    const target = Number(adminKPIs?.transferMilestoneTeas ?? 5000);
                    const pct = target > 0 ? Math.min(100, Math.round((total / target) * 100)) : 0;
                    return (
                      <div className="h-4 bg-gradient-to-r from-caramel to-darkBrown" style={{ width: `${pct}%` }} />
                    );
                  })()}
                </div>
              </div>
            </div>

            {/* Charts removed from overview per request */}

            {/* Quick Stats removed as requested */}
          </motion.div>
        )}

        

        {/* Awards Tab */}
        {activeTab === 'awards' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="bg-gradient-to-br from-cream to-warmWhite border-2 border-caramel/40 rounded-3xl p-6 shadow-xl">
              <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-baloo font-bold text-darkBrown">Awards Issued</h2>
                    <div className="text-sm text-darkBrown/70 font-semibold">Recipients: {(() => { const ids = new Set((awards || []).map(a => String(a.winnerId || a.winnerId))); return ids.size; })()}</div>
                  </div>
                <div className="flex items-center space-x-4">
                    <div className="text-sm text-caramel font-bold">Admin Pool: ₹{adminKPIs?.adminPoolMoney ?? 0}</div>
                    {adminKPIs?.salesLocked && (
                      <div className="text-sm text-red-600 font-semibold">Sales locked — target reached. Process award to distribute pool.</div>
                    )}
                  {(adminKPIs?.totalTeasSold ?? 0) >= (adminKPIs?.transferMilestoneTeas ?? 0) && (adminKPIs?.adminPoolMoney ?? 0) > 0 && (
                    <PrimaryButton onClick={async () => {
                      try {
                        const res = await fetch('/api/rewards/admin/trigger-award', { method: 'POST', credentials: 'include' });
                        const body = await res.json().catch(() => ({}));
                        if (!res.ok) {
                          addNotification({ id: Date.now(), text: body?.message || 'Failed to process award' });
                          return;
                        }
                        addNotification({ id: Date.now(), text: 'Award processed' });
                        // refresh awards and admin KPIs
                        const r1 = await fetch('/api/rewards/admin/awards', { credentials: 'include' });
                        if (r1.ok) { const b = await r1.json(); setAwards(b.awards || []); }
                        const dash = await fetch('/api/rewards/dashboard', { credentials: 'include' });
                        if (dash.ok) { const d = await dash.json(); dispatch({ type: 'SET_ADMIN_KPIS', payload: d.admin || {} }); }
                      } catch (e) {
                        console.error('Trigger award error', e);
                        addNotification({ id: Date.now(), text: 'Network error' });
                      }
                    }}>Process Award</PrimaryButton>
                  )}
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-caramel/30">
                      <th className="text-left py-3 px-4 text-darkBrown font-bold">Date</th>
                      <th className="text-left py-3 px-4 text-darkBrown font-bold">Winner</th>
                      <th className="text-left py-3 px-4 text-darkBrown font-bold">Email</th>
                      <th className="text-left py-3 px-4 text-darkBrown font-bold">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                      {awards.length === 0 ? (
                      <tr><td className="py-4 px-4 text-darkBrown/70" colSpan={4}>No awards issued yet.</td></tr>
                    ) : (
                      awards.map((a) => (
                        <tr key={a._id || a.date} className="border-b border-caramel/20 hover:bg-beige/30 transition-colors">
                          <td className="py-3 px-4 text-darkBrown">{new Date(a.date).toLocaleString()}</td>
                          <td className="py-3 px-4 text-darkBrown font-semibold">{a.winnerName || a.winnerId}</td>
                          <td className="py-3 px-4 text-darkBrown/70">{a.winnerEmail || '-'}</td>
                          <td className="py-3 px-4 text-caramel font-bold">₹{a.amount.toLocaleString()}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* Withdrawals Tab */}
        {activeTab === 'withdrawals' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
            <div className="bg-gradient-to-br from-cream to-warmWhite border-2 border-caramel/40 rounded-3xl p-6 shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-baloo font-bold text-darkBrown">Withdrawal Requests</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-caramel/30">
                      <th className="text-left py-3 px-4 text-darkBrown font-bold">Requested At</th>
                      <th className="text-left py-3 px-4 text-darkBrown font-bold">User</th>
                      <th className="text-left py-3 px-4 text-darkBrown font-bold">Points</th>
                      <th className="text-left py-3 px-4 text-darkBrown font-bold">Status</th>
                      <th className="text-left py-3 px-4 text-darkBrown font-bold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {withdrawals.length === 0 ? (
                      <tr><td className="py-4 px-4 text-darkBrown/70" colSpan={5}>No withdrawal requests.</td></tr>
                    ) : (
                      withdrawals.map(w => (
                        <tr key={w._id} className="border-b border-caramel/20 hover:bg-beige/30 transition-colors">
                          <td className="py-3 px-4 text-darkBrown">{new Date(w.requestedAt).toLocaleString()}</td>
                          <td className="py-3 px-4 text-darkBrown font-semibold">{w.userName || w.userId}</td>
                          <td className="py-3 px-4 text-caramel font-bold">{(w.requestedPoints || 0).toLocaleString()}</td>
                          <td className="py-3 px-4 text-darkBrown/70">{w.status}</td>
                          <td className="py-3 px-4">
                            <div className="flex space-x-2">
                              {w.status === 'pending' && (
                                <PrimaryButton onClick={() => handleAccept(w._id)}>Accept</PrimaryButton>
                              )}
                              {w.status === 'accepted' && (
                                <PrimaryButton onClick={() => handleConfirm(w._id)}>Confirm</PrimaryButton>
                              )}
                              {w.status === 'confirmed' && (
                                <PrimaryButton onClick={async () => {
                                  try {
                                    console.log('Marking paid for', w._id);
                                    const res = await fetch(`/api/rewards/admin/withdrawals/${w._id}/paid`, { method: 'POST', credentials: 'include' });
                                    let body;
                                    try { body = await res.json(); } catch (err) { body = { raw: await res.text().catch(() => String(err)) }; }
                                    console.log('Paid response', res.status, body);
                                    if (!res.ok) { const msg = body?.message || body?.raw || 'Mark paid failed'; addNotification({ id: Date.now(), text: msg }); return; }
                                    addNotification({ id: Date.now(), text: body?.message || 'Marked as paid' });
                                    const r = await fetch('/api/rewards/admin/withdrawals', { credentials: 'include' }); if (r.ok) { const b = await r.json(); setWithdrawals(b.withdrawals || []); }
                                  } catch (e) { console.error('Mark paid error', e); addNotification({ id: Date.now(), text: 'Network error' }); }
                                }}>Paid</PrimaryButton>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* Reviews Tab */}
        {activeTab === 'reviews' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
            <div className="bg-gradient-to-br from-cream to-warmWhite border-2 border-caramel/40 rounded-3xl p-6 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-baloo font-bold text-darkBrown">User Reviews</h2>
                <div className="text-sm text-darkBrown/70 font-semibold">Manage submitted reviews (approve/delete)</div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-caramel/30">
                      <th className="text-left py-3 px-4 text-darkBrown font-bold">Submitted</th>
                      <th className="text-left py-3 px-4 text-darkBrown font-bold">User</th>
                      <th className="text-left py-3 px-4 text-darkBrown font-bold">Rating</th>
                      <th className="text-left py-3 px-4 text-darkBrown font-bold">Comment</th>
                      <th className="text-left py-3 px-4 text-darkBrown font-bold">Approved</th>
                      <th className="text-left py-3 px-4 text-darkBrown font-bold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reviews.length === 0 ? (
                      <tr><td className="py-4 px-4 text-darkBrown/70" colSpan={6}>No reviews submitted.</td></tr>
                    ) : (
                      reviews.map(r => (
                        <tr key={r._id} className="border-b border-caramel/20 hover:bg-beige/30 transition-colors">
                          <td className="py-3 px-4 text-darkBrown">{new Date(r.createdAt).toLocaleString()}</td>
                          <td className="py-3 px-4 text-darkBrown font-semibold">{r.name || r.userId || 'Anonymous'}</td>
                          <td className="py-3 px-4 text-caramel font-bold">{r.rating}</td>
                          <td className="py-3 px-4 text-darkBrown/70">{r.comment || ''}</td>
                          <td className="py-3 px-4 text-darkBrown/70">{r.approved ? 'Yes' : 'No'}</td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <button onClick={async () => {
                                try {
                                  const res = await fetch(`/api/reviews/${r._id}/approve`, { method: 'PATCH', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ approved: !r.approved }) });
                                  const b = await res.json().catch(() => ({}));
                                  if (!res.ok) { addNotification({ id: Date.now(), text: b.message || 'Approve failed' }); return; }
                                  setReviews(prev => prev.map(rr => rr._id === r._id ? { ...rr, approved: !rr.approved } : rr));
                                  addNotification({ id: Date.now(), text: 'Review updated' });
                                } catch (e) { console.error(e); addNotification({ id: Date.now(), text: 'Network error' }); }
                              }} className="px-3 py-1 rounded bg-gradient-to-r from-caramel to-darkBrown text-cream text-sm font-semibold hover:shadow-lg transition-all">{r.approved ? 'Unapprove' : 'Approve'}</button>
                              <button onClick={() => handleDeleteReview(r._id)} className="px-3 py-1 rounded border-2 border-caramel/40 text-darkBrown text-sm font-semibold hover:bg-beige/30 transition-all">Delete</button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="bg-gradient-to-br from-cream to-warmWhite border-2 border-caramel/40 rounded-3xl p-6 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                <h2 className="text-xl font-baloo font-bold text-darkBrown">User Management</h2>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full">
                  <div className="relative flex-1 min-w-0">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-caramel" />
                    <input
                      type="text"
                      placeholder="Search users..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border-2 border-caramel/30 bg-warmWhite rounded-lg focus:outline-none focus:ring-2 focus:ring-caramel focus:border-caramel"
                    />
                  </div>

                  <div className="mt-3 sm:mt-0 sm:ml-4 flex-shrink-0 w-full sm:w-auto">
                    {(() => {
                      const usersToShow = (!searchTerm.trim() && activeTab === 'users') ? allUsers : filteredUsers;
                      return (
                        <PrimaryButton onClick={() => exportUsersToCSV(usersToShow)} className="w-full sm:w-auto">
                          <Download className="w-4 h-4 mr-2" />
                          Export
                        </PrimaryButton>
                      );
                    })()}
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-caramel/30">
                      <th className="text-left py-3 px-4 text-darkBrown font-bold">User</th>
                      <th className="text-left py-3 px-4 text-darkBrown font-bold">Rank</th>
                      <th className="text-left py-3 px-4 text-darkBrown font-bold">Points</th>
                      <th className="text-left py-3 px-4 text-darkBrown font-bold">Teas</th>
                      <th className="text-left py-3 px-4 text-darkBrown font-bold">Status</th>
                      <th className="text-left py-3 px-4 text-darkBrown font-bold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(() => {
                      const usersToShow = (!searchTerm.trim() && activeTab === 'users') ? allUsers : filteredUsers;
                      if (!usersToShow || usersToShow.length === 0) {
                        return <tr><td className="py-4 px-4 text-darkBrown/70" colSpan={6}>No users found.</td></tr>;
                      }
                      return usersToShow.map((user, index) => (
                        <tr key={user.id || user._id || index} className="border-b border-caramel/20 hover:bg-beige/30 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-3">
                            <img 
                              src={user.avatar} 
                              alt={user.name}
                              className="w-8 h-8 rounded-full border-2 border-caramel/40"
                            />
                            <div>
                              <div className="font-semibold text-darkBrown">{user.name}</div>
                              <div className="text-sm text-darkBrown/70">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-darkBrown">{user.rank ?? user.rankPosition ?? '-'}</td>
                        <td className="py-3 px-4 text-caramel font-bold">{user.points.toLocaleString()}</td>
                        <td className="py-3 px-4 text-darkBrown">{user.teasConsumed || 0}</td>
                        <td className="py-3 px-4">
                          {(() => {
                            const st = getStatus(user);
                            return (
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${st.classes}`}>
                                {st.label}
                              </span>
                            );
                          })()}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex space-x-2">
                            <IconButton onClick={() => {
                              setSelectedUser(user);
                              setShowAddTeasModal(true);
                            }}>
                              <Edit className="w-4 h-4" />
                            </IconButton>
                          </div>
                        </td>
                      </tr>
                      ));
                    })()}
                  </tbody>
                </table>
              </div>
              {/* Add Teas Modal moved to top-level so both Overview and Users can open it */}
            </div>
          </motion.div>
        )}

        

        {/* Global Add Teas Modal (available in any tab) */}
        {showAddTeasModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-gradient-to-br from-cream to-warmWhite border-2 border-caramel/40 rounded-3xl p-6 w-full max-w-md shadow-2xl">
              <h3 className="text-lg font-baloo font-bold text-darkBrown mb-3">Add Teas to {selectedUser?.name}</h3>
              <div className="mb-4">
                <label className="block text-sm font-semibold text-darkBrown mb-1">Number of teas</label>
                <input type="number" min="1" value={teasToAdd} onChange={e => setTeasToAdd(parseInt(e.target.value || '0', 10))} className="w-full px-3 py-2 border-2 border-caramel/30 bg-warmWhite rounded-lg focus:outline-none focus:ring-2 focus:ring-caramel focus:border-caramel" />
              </div>
              <div className="flex justify-end space-x-2">
                <button onClick={() => { setShowAddTeasModal(false); setSelectedUser(null); setTeasToAdd(1); }} className="px-4 py-2 rounded-lg border-2 border-caramel/40 text-darkBrown font-semibold hover:bg-beige/30 transition-all">Cancel</button>
                <button onClick={async () => {
                  if (!selectedUser) return;
                  const n = Number(teasToAdd) || 0;
                  if (n <= 0) { addNotification({ id: Date.now(), text: 'Enter a valid number' }); return; }
                  setIsSubmittingTeas(true);
                  try {
                    const uid = selectedUser.id || selectedUser._id;
                    const res = await fetch(`/api/rewards/admin/users/${uid}/add-teas`, {
                      method: 'POST',
                      credentials: 'include',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ teas: n })
                    });
                    let body;
                    try {
                      body = await res.json();
                    } catch (parseErr) {
                      const text = await res.text().catch(() => res.statusText || 'Unknown error');
                      body = { message: text };
                    }
                    if (!res.ok) {
                      console.error('Add-teas failed', res.status, body);
                      addNotification({ id: Date.now(), text: body?.message || `Failed to update user (${res.status})` });
                      setIsSubmittingTeas(false);
                      return;
                    }
                    // Do not add detailed user notification here in admin UI.
                    // The server emits a concise `admin:notificationSent` event to admins.
                    // refresh rankings and admin KPIs
                    const [ranksRes, dashRes] = await Promise.all([
                      fetch('/api/rewards/rankings'),
                      fetch('/api/rewards/dashboard', { credentials: 'include' })
                    ]);
                    if (ranksRes.ok) {
                      const rr = await ranksRes.json();
                      dispatch({ type: 'SET_ALL_USERS', payload: rr.rankings || [] });
                    }
                    if (dashRes.ok) {
                      const dd = await dashRes.json();
                      dispatch({ type: 'SET_ADMIN_KPIS', payload: dd.admin || {} });
                      dispatch({ type: 'SET_VENDOR_STATS', payload: dd.vendorStats || {} });
                    }
                    setShowAddTeasModal(false);
                    setSelectedUser(null);
                    setTeasToAdd(1);
                  } catch (e) {
                    console.error(e);
                    addNotification({ id: Date.now(), text: 'Network error' });
                  } finally {
                    setIsSubmittingTeas(false);
                  }
                }} className="px-4 py-2 rounded-lg bg-gradient-to-r from-caramel to-darkBrown text-cream font-bold hover:shadow-lg transition-all disabled:opacity-50" disabled={isSubmittingTeas}>{isSubmittingTeas ? 'Saving…' : 'Save'}</button>
              </div>
            </div>
          </div>
        )}

      </div>
    </motion.div>
  );
}

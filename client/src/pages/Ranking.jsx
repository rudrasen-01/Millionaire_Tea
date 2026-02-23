import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Crown, Star, TrendingUp, TrendingDown, Minus, Search, Filter } from 'lucide-react';
import { RankCard } from '../components/cards/MetricCard';
import { PrimaryButton, SecondaryButton } from '../components/buttons/PrimaryButton';
import { SkeletonLoader } from '../components/loaders/SkeletonLoader';
import { useApp } from '../context/AppContext';

export function Ranking() {
  const { user, allUsers, isLoading, setCurrentPage, claimPrize } = useApp();
  const [awards, setAwards] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('rank');
  const [userMovements, setUserMovements] = useState({});

  useEffect(() => {
    const movements = {};
    allUsers.forEach(u => {
      movements[u.id] = Math.floor(Math.random() * 11) - 5;
    });
    setUserMovements(movements);
  }, [allUsers]);

  useEffect(() => {
    let mounted = true;
    fetch('/api/rewards/awards')
      .then(r => r.json())
      .then(data => { if (mounted && data && data.awards) setAwards(data.awards); })
      .catch(() => {});
    return () => { mounted = false; };
  }, []);

  const filteredAndSortedUsers = allUsers
    .filter(u => 
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'points':
          return b.points - a.points;
        case 'teas':
          return b.teasConsumed - a.teasConsumed;
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return a.rank - b.rank;
      }
    });

  const currentUserIndex = filteredAndSortedUsers.findIndex(u => u.id === user.id);
  const topUsers = filteredAndSortedUsers.slice(0, 10);
  const otherUsers = filteredAndSortedUsers.slice(10);

  const getMovementIcon = (movement) => {
    if (movement > 0) return <TrendingUp className="w-4 h-4 text-green-600" />;
    if (movement < 0) return <TrendingDown className="w-4 h-4 text-red-600" />;
    return <Minus className="w-4 h-4 text-gray-500" />;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <SkeletonLoader height="h-8 w-48 mb-2" />
            <SkeletonLoader height="h-4 w-96" />
          </div>
          
          <div className="glass-card p-6 mb-8">
            <SkeletonLoader height="h-12 w-full mb-4" />
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i}>
                  <SkeletonLoader height="h-20 w-full" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      className="min-h-screen p-6 overflow-x-hidden"
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
          <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
            <div>
              <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
                🏆 Leaderboard
              </h1>
              <p className="text-lg text-gray-600">
                See how you rank among other tea enthusiasts
              </p>
            </div>
            <SecondaryButton onClick={() => setCurrentPage('dashboard')}>
              Back to Dashboard
            </SecondaryButton>
          </div>

          {/* Current User Stats Card */}
          <div className="glass-card-premium p-6 bg-gradient-to-r from-tea-50/50 to-premium-50/50 border-2 border-tea-200">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <img 
                    src={user.avatar} 
                    alt={user.name}
                    className="w-20 h-20 rounded-2xl border-4 border-white shadow-lg object-cover"
                  />
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-lg bg-gradient-to-br from-luxury-gold to-tea-600 flex items-center justify-center shadow-lg">
                    <Crown className="w-4 h-4 text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">Your Position</h3>
                  <p className="text-gray-600">
                    <span className="font-bold text-tea-700">Rank #{user.rank ?? user.rankPosition ?? '-'}</span> with <span className="font-semibold">{user.points.toLocaleString()}</span> points
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-tea-100 text-tea-700 text-xs font-medium">
                      {user.teasConsumed} teas consumed
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-5xl font-extrabold gradient-text mb-1">
                  #{user.rank ?? user.rankPosition ?? '-'}
                </div>
                <div className="text-sm text-gray-600">Your Rank</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Filters and Search */}
        <motion.div 
          className="glass-card p-4 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-caramel focus:border-transparent"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-caramel focus:border-transparent"
              >
                <option value="rank">Sort by Rank</option>
                <option value="points">Sort by Points</option>
                <option value="teas">Sort by Teas</option>
                <option value="name">Sort by Name</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Recent Awards (public) */}
        <motion.div
          className="glass-card p-4 mb-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.15 }}
        >
          <h2 className="text-lg font-bold mb-3">Recent Awards</h2>
          {awards.length === 0 ? (
            <div className="text-sm text-gray-500">No awards yet.</div>
          ) : (
            <div className="space-y-2">
              {awards.slice(0,5).map((a) => (
                <div key={a._id} className="flex items-center justify-between p-2 border rounded">
                  <div>
                    <div className="font-semibold">{a.winnerName || 'Anonymous'}</div>
                    <div className="text-xs text-gray-500">{new Date(a.date).toLocaleString()}</div>
                  </div>
                  <div className="text-tea-brown font-bold">₹{Number(a.amount).toLocaleString()}</div>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Top 3 Winners */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          {topUsers.slice(0, 3).map((topUser, index) => (
            <motion.div
              key={topUser.id}
              className={`
                glass-card p-6 text-center relative overflow-hidden
                ${index === 0 ? 'rank-1' : index === 1 ? 'border-l-4 border-gray-400' : 'border-l-4 border-caramel'}
              `}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              {index === 0 && (
                <div className="absolute top-2 right-2">
                  <Crown className="w-8 h-8 text-luxury-gold" />
                </div>
              )}
              
              <div className="mb-4">
                <div className={`w-20 h-20 mx-auto rounded-full border-4 ${
                  index === 0 ? 'border-luxury-gold' : index === 1 ? 'border-gray-400' : 'border-caramel'
                } overflow-hidden`}>
                  <img 
                    src={topUser.avatar} 
                    alt={topUser.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              
              <h3 className={`font-bold text-lg mb-2 ${
                index === 0 ? 'text-white' : 'text-gray-900'
              }`}>
                {topUser.name}
              </h3>
              
              <div className={`text-2xl font-bold mb-2 ${
                index === 0 ? 'text-white' : 'text-gray-900'
              }`}>
                {topUser.rank ?? topUser.rankPosition ?? '-'}
              </div>
              
              <div className={`text-sm ${
                index === 0 ? 'text-white/80' : 'text-gray-600'
              }`}>
                {topUser.points.toLocaleString()} points
              </div>
              
              {topUser.id === user.id && (
                <div className={`mt-2 px-2 py-1 rounded-full text-xs font-semibold ${
                  index === 0 ? 'bg-white/20 text-white' : 'bg-caramel/20 text-darkBrown'
                }`}>
                  You
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>

        {/* Claim Prize Button for Rank 1 */}
        {user.rank === 1 && (
            <motion.div
              className="glass-card p-6 mb-8 bg-gradient-to-r from-luxury-gold/20 to-caramel/20 border-2 border-luxury-gold"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.4 }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {/* Rank-1 claim banner removed per request */}
                    </h3>
                  </div>
                </div>
              </div>
            </motion.div>
        )}

        {/* Rankings List */}
        <motion.div
          className="glass-card p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
        >
          <h2 className="text-xl font-bold text-gray-900 mb-6">All Rankings</h2>
          
          <div className="space-y-3 max-h-96 overflow-y-auto overflow-x-hidden">
            <AnimatePresence>
              {filteredAndSortedUsers.map((rankUser, index) => (
                <RankCard
                  key={rankUser.id}
                  user={rankUser}
                  isCurrentUser={rankUser.id === user.id}
                  showMovement={true}
                  movement={userMovements[rankUser.id]}
                  loading={isLoading}
                />
              ))}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

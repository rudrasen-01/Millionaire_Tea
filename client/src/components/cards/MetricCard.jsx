import React from 'react';
import { motion } from 'framer-motion';
import { Coffee, Trophy, Star, TrendingUp } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export function MetricCard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  color = "tea-amber",
  trend = null,
  loading = false 
}) {
  if (loading) {
    return (
      <div className="metric-card">
        <div className="flex items-center justify-between mb-4">
          <div className={`w-12 h-12 bg-${color}/20 rounded-full animate-pulse`}></div>
          <div className="w-16 h-6 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="h-8 bg-gray-200 rounded mb-2 animate-pulse"></div>
        <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse"></div>
      </div>
    );
  }

  return (
    <motion.div 
      className={`metric-card border-${color}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5 }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 bg-${color}/20 rounded-full flex items-center justify-center`}>
          <Icon className={`w-6 h-6 text-${color}`} />
        </div>
        {trend && (
          <div className={`flex items-center text-sm ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
            <TrendingUp className={`w-4 h-4 mr-1 ${trend < 0 ? 'rotate-180' : ''}`} />
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      
      <div className="text-2xl font-bold text-gray-900 mb-1">
        {typeof value === 'number' ? value.toLocaleString() : value}
      </div>
      
      <div className="text-sm text-gray-600">{title}</div>
      {subtitle && (
        <div className="text-xs text-gray-500 mt-1">{subtitle}</div>
      )}
    </motion.div>
  );
}

export function RankCard({ 
  user, 
  isCurrentUser = false, 
  showMovement = false,
  movement = null,
  loading = false 
}) {
  if (loading) {
    return <div className="glass-card p-4 mb-3 animate-pulse">
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
        <div className="flex-1">
          <div className="h-5 bg-gray-200 rounded mb-2 w-32"></div>
          <div className="h-4 bg-gray-200 rounded w-24"></div>
        </div>
        <div className="w-16 h-8 bg-gray-200 rounded"></div>
      </div>
    </div>;
  }

  const isRank1 = user.rank === 1;
  
  return (
    <motion.div
      className={`
        glass-card p-4 mb-3 cursor-pointer transition-all duration-300
        ${isCurrentUser ? 'ring-2 ring-tea-amber ring-offset-2' : ''}
        ${isRank1 ? 'rank-1' : ''}
      `}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
    >
      <div className="flex items-center space-x-4">
        <div className="relative">
          <img 
            src={user.avatar} 
            alt={user.name}
            className="w-12 h-12 rounded-full border-2 border-white shadow-md"
          />
          {isRank1 && (
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-tea-gold rounded-full flex items-center justify-center">
              <Trophy className="w-3 h-3 text-white" />
            </div>
          )}
        </div>
        
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <h3 className={`font-semibold ${isRank1 ? 'text-white' : 'text-gray-900'}`}>
              {user.name}
            </h3>
            {isCurrentUser && (
              <span className={`px-2 py-1 text-xs rounded-full ${
                isRank1 ? 'bg-white/20 text-white' : 'bg-tea-amber/20 text-tea-brown'
              }`}>
                You
              </span>
            )}
          </div>
          <div className={`text-sm ${isRank1 ? 'text-white/80' : 'text-gray-600'}`}>
            {user.points.toLocaleString()} points
          </div>
        </div>
        
        <div className="text-right">
          <div className={`text-2xl font-bold ${isRank1 ? 'text-white' : 'text-gray-900'}`}>
              {user.rank ?? user.rankPosition ?? '-'}
            </div>
          {/* movement indicator removed */}
        </div>
      </div>
    </motion.div>
  );
}

export function MilestoneCard({ 
  milestone, 
  currentProgress, 
  loading = false 
}) {
  const { user } = useApp();

  // Do not show milestone card to non-admin users
  if (!user || (user.role && user.role !== 'admin')) return null;
  if (loading) {
    return <div className="glass-card p-6 animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
        <div className="w-16 h-6 bg-gray-200 rounded"></div>
      </div>
      <div className="h-5 bg-gray-200 rounded mb-2"></div>
      <div className="h-4 bg-gray-200 rounded mb-4 w-3/4"></div>
      <div className="h-2 bg-gray-200 rounded-full"></div>
    </div>;
  }

  const progress = Math.min((currentProgress / milestone.target) * 100, 100);
  const isAchieved = milestone.achieved;

  return (
    <motion.div
      className={`
        glass-card p-6 relative overflow-hidden
        ${isAchieved ? 'ring-2 ring-green-500 ring-offset-2' : ''}
      `}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5 }}
    >
      {isAchieved && (
        <div className="absolute top-2 right-2">
          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
            <Star className="w-4 h-4 text-white" />
          </div>
        </div>
      )}
      
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${
          isAchieved ? 'bg-green-100' : 'bg-tea-amber/20'
        }`}>
          {milestone.icon}
        </div>
        <div className={`px-3 py-1 rounded-full text-sm font-semibold ${
          isAchieved ? 'bg-green-100 text-green-800' : 'bg-tea-amber/20 text-tea-brown'
        }`}>
          {milestone.prize.toLocaleString()} pts
        </div>
      </div>
      
      <h3 className="font-bold text-gray-900 mb-1">{milestone.name}</h3>
      <p className="text-sm text-gray-600 mb-4">{milestone.description}</p>
      
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Progress</span>
          <span className="font-semibold">
            {currentProgress} / {milestone.target}
          </span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2">
          <motion.div
            className={`h-2 rounded-full transition-all duration-500 ${
              isAchieved ? 'bg-green-500' : 'bg-gradient-to-r from-tea-amber to-tea-brown'
            }`}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1, delay: 0.2 }}
          />
        </div>
        
        <div className="text-xs text-gray-500 text-right">
          {Math.round(progress)}% complete
        </div>
      </div>
    </motion.div>
  );
}

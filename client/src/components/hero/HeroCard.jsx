import React from 'react';
import { Users, Award, Star, Trophy, TrendingUp, Sparkles, Gift, Crown } from 'lucide-react';
import { PrimaryButton } from '../buttons/PrimaryButton';
import { motion } from 'framer-motion';

export default function HeroCard({ points = 120, nextReward = 250, isAuthenticated = false, onGetStarted }) {
  const progress = Math.min(1, points / nextReward);

  if (!isAuthenticated) {
    const previewProgress = 0.65;
    return (
      <motion.aside 
        className="relative w-full max-w-lg mx-auto md:mx-0 p-12 rounded-3xl overflow-hidden" 
        style={{
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.98), rgba(255, 250, 245, 0.95))',
          backdropFilter: 'blur(30px)',
          border: '3px solid rgba(255, 153, 51, 0.35)',
          boxShadow: '0 25px 70px rgba(255, 153, 51, 0.25), 0 10px 30px rgba(255, 140, 0, 0.2), inset 0 2px 0 rgba(255, 255, 255, 0.6), inset 0 -2px 0 rgba(255, 153, 51, 0.1)',
        }}
        aria-labelledby="hero-card-title"
        initial={{ opacity: 0, rotateY: -10 }}
        animate={{ opacity: 1, rotateY: 0 }}
        transition={{ delay: 0.6, duration: 0.8, type: 'spring' }}
        whileHover={{ 
          y: -10,
          boxShadow: '0 30px 80px rgba(255, 153, 51, 0.3), 0 15px 40px rgba(255, 140, 0, 0.25)',
        }}
      >
        {/* Multiple layered animated gradient orbs */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br from-orange-300/30 via-amber-300/20 to-transparent rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-gradient-to-tr from-yellow-300/25 via-orange-300/15 to-transparent rounded-full blur-3xl" />
        <motion.div 
          className="absolute top-1/2 left-1/2 w-32 h-32 bg-gradient-to-br from-amber-200/20 to-transparent rounded-full blur-2xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.3, 0.2] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        
        {/* Decorative corner patterns */}
        <div className="absolute top-0 left-0 w-20 h-20 opacity-[0.08]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='20' cy='20' r='15' fill='none' stroke='%23FF9933' stroke-width='2'/%3E%3C/svg%3E")`
        }} />
        <div className="absolute bottom-0 right-0 w-20 h-20 opacity-[0.08]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 20 L40 20 M20 0 L20 40' stroke='%23FF9933' stroke-width='2'/%3E%3C/svg%3E")`
        }} />
        
        {/* Content */}
        <div className="relative z-10">
          {/* Header with enhanced visual hierarchy */}
          <div className="flex items-start justify-between mb-12">
            <div className="flex-1">
              <motion.div 
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4 relative overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, rgba(255, 153, 51, 0.18), rgba(255, 140, 0, 0.12))',
                  border: '1.5px solid rgba(255, 153, 51, 0.35)',
                  boxShadow: '0 4px 12px rgba(255, 153, 51, 0.2)'
                }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.8, type: 'spring' }}
              >
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                >
                  <Sparkles className="w-4 h-4 text-orange-600" />
                </motion.div>
                <span className="text-xs font-extrabold text-orange-700 uppercase tracking-widest">Rewards Preview</span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                  animate={{ x: ['-200%', '200%'] }}
                  transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
                />
              </motion.div>
              <h3 className="text-5xl font-black text-gray-900 mb-3 tracking-tight">Join & Earn</h3>
              <p className="text-base text-gray-700 font-semibold leading-relaxed">
                Claim <span className="text-orange-600 font-extrabold text-lg">50 bonus points</span> instantly
              </p>
            </div>
            <motion.div 
              className="relative w-24 h-24 rounded-3xl bg-gradient-to-br from-amber-200 via-orange-200 to-amber-100 flex items-center justify-center border-3 border-orange-300 shadow-2xl overflow-hidden"
              style={{ boxShadow: '0 8px 24px rgba(255, 153, 51, 0.3), inset 0 2px 0 rgba(255, 255, 255, 0.5)' }}
              animate={{ 
                rotate: [0, 5, -5, 0],
                scale: [1, 1.08, 1],
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              {/* Radial gradient glow */}
              <motion.div
                className="absolute inset-0 bg-gradient-radial from-white/40 to-transparent"
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <Trophy className="w-12 h-12 text-orange-700 drop-shadow-lg relative z-10" />
            </motion.div>
          </div>

          {/* Enhanced Progress Bar with sophisticated design */}
          <div className="mb-12">
            <div className="flex justify-between items-center text-sm mb-5">
              <span className="font-extrabold text-gray-900 text-base uppercase tracking-wide">Your Journey Progress</span>
              <motion.div
                className="relative"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1, type: 'spring' }}
              >
                <motion.span 
                  className="font-black text-3xl bg-gradient-to-r from-orange-600 via-amber-500 to-orange-600 bg-clip-text text-transparent"
                  style={{ backgroundSize: '200% auto' }}
                  animate={{ backgroundPosition: ['0% center', '100% center', '0% center'] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                >
                  {Math.round(previewProgress * 100)}%
                </motion.span>
                {/* Decorative percentage glow */}
                <motion.div
                  className="absolute -inset-2 bg-orange-300/30 rounded-full blur-lg -z-10"
                  animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </motion.div>
            </div>
            
            {/* Sophisticated gradient progress bar with layered effects */}
            <div className="relative w-full rounded-full h-5 overflow-hidden" 
              style={{ 
                background: 'linear-gradient(90deg, rgba(255, 153, 51, 0.15), rgba(255, 140, 0, 0.1))',
                boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.1)'
              }}
            >
              {/* Inner glow border */}
              <div className="absolute inset-0 rounded-full border border-orange-200/50"></div>
              
              <motion.div 
                className="h-5 rounded-full relative overflow-hidden"
                style={{ 
                  background: 'linear-gradient(90deg, #FF9933, #FFB347, #FF8C00, #FF9933)',
                  backgroundSize: '300% auto',
                  width: '0%',
                  boxShadow: '0 0 16px rgba(255, 153, 51, 0.7), inset 0 1px 0 rgba(255, 255, 255, 0.4)',
                }}
                animate={{ 
                  width: `${Math.round(previewProgress * 100)}%`,
                  backgroundPosition: ['0% center', '100% center', '0% center'],
                }}
                transition={{ 
                  width: { duration: 1.8, delay: 1, ease: 'easeOut' },
                  backgroundPosition: { duration: 3, repeat: Infinity, ease: 'linear' },
                }}
              >
                {/* Multiple shine effects */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-50"
                  animate={{ x: ['-100%', '200%'] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatDelay: 0.5,
                    ease: 'easeInOut',
                  }}
                />
                <motion.div
                  className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/60 to-transparent"
                />
              </motion.div>
            </div>
            
            <p className="mt-6 text-sm text-gray-700 leading-relaxed font-semibold text-center px-2">
              Join now to track your rewards, unlock <span className="text-orange-600 font-extrabold">exclusive perks</span>, and enjoy a <span className="text-orange-600 font-extrabold">transparent</span> earning experience
            </p>
          </div>

          {/* Enhanced Stats Grid with sophisticated cards */}
          <motion.div 
            className="grid grid-cols-3 gap-5 mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
          >
            {[
              { icon: Gift, value: '₹250', label: 'Avg Reward', gradient: 'from-amber-100 via-orange-50 to-orange-100', iconBg: 'from-orange-400 to-amber-400', iconColor: 'text-white', border: 'border-amber-300', glow: 'rgba(245, 158, 11, 0.3)' },
              { icon: Users, value: '10K+', label: 'Members', gradient: 'from-blue-100 via-cyan-50 to-cyan-100', iconBg: 'from-blue-400 to-cyan-400', iconColor: 'text-white', border: 'border-blue-300', glow: 'rgba(59, 130, 246, 0.3)' },
              { icon: Crown, value: '4.9★', label: 'Rating', gradient: 'from-purple-100 via-pink-50 to-pink-100', iconBg: 'from-purple-400 to-pink-400', iconColor: 'text-white', border: 'border-purple-300', glow: 'rgba(168, 85, 247, 0.3)' },
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                className={`relative bg-gradient-to-br ${stat.gradient} p-5 rounded-2xl text-center border-2 ${stat.border} overflow-hidden group`}
                style={{ boxShadow: `0 4px 16px ${stat.glow}` }}
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: 1.3 + idx * 0.1, type: 'spring' }}
                whileHover={{ 
                  scale: 1.08, 
                  y: -8,
                  boxShadow: `0 8px 24px ${stat.glow}`,
                }}
              >
                {/* Decorative corner accent */}
                <div className="absolute top-0 right-0 w-12 h-12 opacity-20" style={{
                  background: `linear-gradient(135deg, transparent 50%, ${stat.iconBg} 50%)`
                }} />
                
                {/* Animated icon container */}
                <motion.div 
                  className={`w-14 h-14 mx-auto mb-4 rounded-xl bg-gradient-to-br ${stat.iconBg} flex items-center justify-center border-2 ${stat.border} shadow-xl relative overflow-hidden`}
                  whileHover={{ rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 0.5 }}
                >
                  <motion.div
                    className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20"
                    transition={{ duration: 0.3 }}
                  />
                  <stat.icon className={`w-7 h-7 ${stat.iconColor} drop-shadow-md relative z-10`} />
                </motion.div>
                
                <div className="text-2xl font-black text-gray-900 mb-2 tracking-tight">{stat.value}</div>
                <div className="text-xs text-gray-700 font-extrabold uppercase tracking-widest">{stat.label}</div>
                
                {/* Shine effect on hover */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-30"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: '100%' }}
                  transition={{ duration: 0.6 }}
                />
              </motion.div>
            ))}
          </motion.div>

          {/* Enhanced CTA Button with sophisticated effects */}
          <motion.button 
            onClick={onGetStarted} 
            className="relative w-full text-lg font-extrabold py-6 rounded-2xl transition-all overflow-hidden group"
            style={{
              background: 'linear-gradient(135deg, #FF9933, #FF8C00, #FFB347, #FF9933)',
              backgroundSize: '300% auto',
              color: '#ffffff',
              boxShadow: '0 10px 30px rgba(255, 153, 51, 0.45), 0 5px 15px rgba(255, 140, 0, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
              border: '2px solid rgba(255, 140, 0, 0.5)',
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ 
              opacity: 1, 
              y: 0,
              backgroundPosition: ['0% center', '100% center', '0% center'],
            }}
            transition={{
              opacity: { delay: 1.5 },
              y: { delay: 1.5 },
              backgroundPosition: { duration: 4, repeat: Infinity, ease: 'linear' },
            }}
            whileHover={{ 
              scale: 1.03,
              boxShadow: '0 15px 40px rgba(255, 153, 51, 0.55), 0 8px 20px rgba(255, 140, 0, 0.45)',
            }}
            whileTap={{ scale: 0.97 }}
            aria-label="Create account and claim points"
          >
            {/* Multiple layered shine effects */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-25"
              animate={{ x: ['-150%', '250%'] }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                repeatDelay: 1,
                ease: 'easeInOut',
              }}
            />
            <motion.div
              className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent"
            />
            
            <span className="relative z-10 flex items-center justify-center gap-3 drop-shadow-md">
              <span className="text-xl">Create Free Account</span>
              <motion.span
                className="text-2xl"
                animate={{ x: [0, 6, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                →
              </motion.span>
            </span>
          </motion.button>

          {/* Enhanced Trust Badge */}
          <motion.div 
            className="mt-8 flex items-center justify-center gap-3 text-sm font-bold"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.7 }}
          >
            <motion.div 
              className="relative w-4 h-4 rounded-full overflow-hidden"
              style={{ boxShadow: '0 0 12px rgba(16, 185, 129, 0.5)' }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-green-500" />
              <motion.div 
                className="absolute inset-0 bg-white"
                animate={{ scale: [0, 2], opacity: [0.6, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.div>
            <span className="bg-gradient-to-r from-gray-800 via-gray-700 to-gray-900 bg-clip-text text-transparent font-extrabold uppercase tracking-wide">
              Trusted • Secure • Transparent
            </span>
          </motion.div>
        </div>
      </motion.aside>
    );
  }


  return (
    <motion.aside 
      className="relative w-full max-w-lg mx-auto md:mx-0 p-12 rounded-3xl overflow-hidden" 
      style={{
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(24px)',
        border: '2px solid rgba(255, 153, 51, 0.3)',
        boxShadow: '0 20px 60px rgba(255, 153, 51, 0.2), 0 8px 24px rgba(255, 140, 0, 0.15)',
      }}
      aria-labelledby="hero-card-title"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      whileHover={{ 
        y: -8,
        boxShadow: '0 24px 70px rgba(255, 153, 51, 0.25), 0 12px 30px rgba(255, 140, 0, 0.2)',
      }}
    >
      {/* Animated background orbs */}
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-orange-300/20 to-amber-300/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-gradient-to-tr from-yellow-300/20 to-orange-300/10 rounded-full blur-3xl" />

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-8">
          <div className="flex-1">
            <div id="hero-card-title" className="text-xs font-bold text-orange-700 uppercase tracking-wider mb-2">
              Your Rewards
            </div>
            <div className="text-5xl font-extrabold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent mb-2">
              {points}
            </div>
            <div className="text-sm text-gray-700 font-semibold">
              Next reward at <span className="text-orange-600 font-bold">{nextReward}</span> points
            </div>
          </div>

          <motion.div 
            className="relative"
            aria-hidden
            animate={{ rotate: 360 }}
            transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
          >
            <svg width="100" height="100" viewBox="0 0 100 100" fill="none" className="transform -rotate-90">
              <circle cx="50" cy="50" r="42" stroke="rgba(255, 153, 51, 0.2)" strokeWidth="8" />
              <motion.circle 
                cx="50" 
                cy="50" 
                r="42" 
                stroke="url(#gradient)" 
                strokeWidth="8" 
                strokeLinecap="round" 
                strokeDasharray={`${Math.round(2 * Math.PI * 42)}`}
                strokeDashoffset={Math.round(2 * Math.PI * 42 * (1 - progress))}
                initial={{ strokeDashoffset: Math.round(2 * Math.PI * 42) }}
                animate={{ strokeDashoffset: Math.round(2 * Math.PI * 42 * (1 - progress)) }}
                transition={{ duration: 1.5, delay: 0.8, ease: 'easeOut' }}
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FF9933" />
                  <stop offset="50%" stopColor="#FFB347" />
                  <stop offset="100%" stopColor="#FF8C00" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl font-extrabold text-gray-900">{Math.round(progress * 100)}%</div>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div 
          className="grid grid-cols-3 gap-4 mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          {[
            { icon: Star, value: '₹150', label: 'Avg Reward', gradient: 'from-amber-100 to-orange-100', iconBg: 'from-orange-300 to-amber-300', iconColor: 'text-orange-800', border: 'border-amber-300' },
            { icon: Users, value: '100K+', label: 'Members', gradient: 'from-blue-100 to-cyan-100', iconBg: 'from-blue-300 to-cyan-300', iconColor: 'text-blue-800', border: 'border-blue-300' },
            { icon: Award, value: '50+', label: 'Partners', gradient: 'from-purple-100 to-pink-100', iconBg: 'from-purple-300 to-pink-300', iconColor: 'text-purple-800', border: 'border-purple-300' },
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              className={`bg-gradient-to-br ${stat.gradient} p-4 rounded-2xl text-center border ${stat.border} shadow-md`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.1 + idx * 0.1, type: 'spring' }}
              whileHover={{ scale: 1.05, y: -4 }}
            >
              <div className={`w-12 h-12 mx-auto mb-2 rounded-xl bg-gradient-to-br ${stat.iconBg} flex items-center justify-center border-2 ${stat.border}`}>
                <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
              </div>
              <div className="text-lg font-extrabold text-gray-900">{stat.value}</div>
              <div className="text-xs text-gray-700 font-semibold uppercase tracking-wide">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div 
          className="mt-6 flex items-center justify-center gap-3 text-sm font-semibold text-gray-700"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
        >
          <motion.div 
            className="w-3 h-3 rounded-full bg-gradient-to-r from-emerald-400 to-green-500"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <span>Trusted · Secure · Transparent</span>
        </motion.div>
      </div>
    </motion.aside>
  );
}


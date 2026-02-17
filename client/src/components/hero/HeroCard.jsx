import React from 'react';
import { Users, Award, Star, Trophy, TrendingUp } from 'lucide-react';
import { PrimaryButton } from '../buttons/PrimaryButton';
import { motion } from 'framer-motion';

export default function HeroCard({ points = 120, nextReward = 250, isAuthenticated = false, onGetStarted }) {
  const progress = Math.min(1, points / nextReward);

  if (!isAuthenticated) {
    const previewProgress = 0.35;
    return (
      <motion.aside 
        className="w-full max-w-lg mx-auto md:mx-0 p-10 rounded-3xl" 
        style={{
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 153, 51, 0.25)',
          boxShadow: '0 10px 40px rgba(255, 153, 51, 0.15)'
        }}
        aria-labelledby="hero-card-title"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="flex items-center justify-between mb-8">
          <div>
            <div id="hero-card-title" className="text-xs font-semibold text-orange-700 uppercase tracking-wider">
              Rewards Preview
            </div>
            <div className="mt-2 text-3xl font-bold text-gray-900">Join & Begin</div>
            <div className="text-sm text-gray-700 mt-1">Claim 50 bonus points instantly</div>
          </div>
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center border border-amber-200">
            <Trophy className="w-8 h-8 text-orange-600" />
          </div>
        </div>

        <div className="mb-8">
          <div className="flex justify-between text-sm mb-3">
            <span className="font-semibold text-gray-800">Your Progress</span>
            <span className="font-bold text-orange-600">{Math.round(previewProgress * 100)}%</span>
          </div>
          <div className="relative w-full rounded-full h-3 overflow-hidden" style={{ background: 'rgba(255, 153, 51, 0.15)' }}>
            <motion.div 
              className="h-3 rounded-full"
              style={{ 
                background: 'linear-gradient(90deg, #FF9933, #FF8C00)',
                width: '0%'
              }}
              animate={{ width: `${Math.round(previewProgress * 100)}%` }}
              transition={{ duration: 1.5, delay: 0.6, ease: 'easeOut' }}
            />
          </div>
          <div className="mt-4 text-sm text-gray-700 leading-relaxed">
            Sign up to track your rewards and unlock exclusive benefits
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-4 rounded-2xl text-center border border-amber-200">
            <div className="w-11 h-11 mx-auto mb-2 rounded-xl bg-gradient-to-br from-orange-200 to-amber-200 flex items-center justify-center border border-orange-300">
              <Star className="w-6 h-6 text-orange-700" />
            </div>
            <div className="text-lg font-bold text-gray-900">₹200</div>
            <div className="text-xs text-gray-600 font-medium">Avg Reward</div>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-4 rounded-2xl text-center border border-blue-200">
            <div className="w-11 h-11 mx-auto mb-2 rounded-xl bg-gradient-to-br from-blue-200 to-cyan-200 flex items-center justify-center border border-blue-300">
              <Users className="w-6 h-6 text-blue-800" />
            </div>
            <div className="text-lg font-bold text-gray-900">10K+</div>
            <div className="text-xs text-gray-600 font-medium">Members</div>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-2xl text-center border border-purple-200">
            <div className="w-11 h-11 mx-auto mb-2 rounded-xl bg-gradient-to-br from-purple-200 to-pink-200 flex items-center justify-center border border-purple-300">
              <TrendingUp className="w-6 h-6 text-purple-800" />
            </div>
            <div className="text-lg font-bold text-gray-900">4.9</div>
            <div className="text-xs text-gray-600 font-medium">Rating</div>
          </div>
        </div>

        <button 
          onClick={onGetStarted} 
          className="w-full text-base font-semibold py-4 rounded-2xl transition-all"
          style={{
            background: 'linear-gradient(135deg, #FF9933, #FF8C00)',
            color: '#ffffff',
            boxShadow: '0 4px 16px rgba(255, 153, 51, 0.3)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = '0 6px 24px rgba(255, 153, 51, 0.4)';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = '0 4px 16px rgba(255, 153, 51, 0.3)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
          aria-label="Create account and claim points"
        >
          Create Free Account
        </button>

        <div className="mt-5 flex items-center justify-center gap-2 text-xs font-medium text-gray-600">
          <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
          <span>Trusted · Secure · Transparent</span>
        </div>
      </motion.aside>
    );
  }

  return (
    <motion.aside 
      className="w-full max-w-lg mx-auto md:mx-0 glass-card-premium p-8 shadow-glow-lg" 
      aria-labelledby="hero-card-title"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <div className="flex items-start justify-between mb-6">
        <div>
          <div id="hero-card-title" className="text-xs font-semibold text-tea-600 uppercase tracking-wide">
            Your Points
          </div>
          <div className="mt-2 text-5xl font-extrabold gradient-text">{points}</div>
          <div className="text-sm text-gray-600 mt-1">Next reward at {nextReward} points</div>
        </div>

        <div className="ml-4" aria-hidden>
          <svg width="90" height="90" viewBox="0 0 90 90" fill="none" className="transform -rotate-90">
            <circle cx="45" cy="45" r="38" stroke="#E5E7EB" strokeWidth="7" />
            <circle 
              cx="45" 
              cy="45" 
              r="38" 
              stroke="url(#gradient)" 
              strokeWidth="7" 
              strokeLinecap="round" 
              strokeDasharray={`${Math.round(2 * Math.PI * 38 * progress)} ${Math.round(2 * Math.PI * 38)}`}
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFB347" />
                <stop offset="100%" stopColor="#F57C00" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
            <div className="text-xl font-bold text-gray-900">{Math.round(progress * 100)}%</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="bg-gradient-to-br from-tea-50 to-orange-50 p-4 rounded-xl text-center border border-tea-100">
          <div className="p-2 rounded-full bg-amber-100 text-amber-600 mb-1"><Star className="w-4 h-4" /></div>
          <div className="text-sm font-bold text-slate-700">₹150</div>
          <div className="text-xs text-slate-500">Avg Reward</div>
        </div>
        <div className="flex flex-col items-center p-3 bg-slate-50 rounded-lg">
          <div className="p-2 rounded-full bg-amber-100 text-amber-600 mb-1"><Users className="w-4 h-4" /></div>
          <div className="text-sm font-bold text-slate-700">100K+</div>
          <div className="text-xs text-slate-500">Members</div>
        </div>
        <div className="flex flex-col items-center p-3 bg-slate-50 rounded-lg">
          <div className="p-2 rounded-full bg-amber-100 text-amber-600 mb-1"><Award className="w-4 h-4" /></div>
          <div className="text-sm font-bold text-slate-700">50+</div>
          <div className="text-xs text-slate-500">Partners</div>
        </div>
      </div>

      <div className="mt-4 text-xs text-slate-500">Trusted • Secure • Curated</div>
    </motion.aside>
  );
}

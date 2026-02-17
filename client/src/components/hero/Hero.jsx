import React from 'react';
import HeroCard from './HeroCard';
import { Sparkles, ArrowRight, CheckCircle, Zap } from 'lucide-react';
import { PrimaryButton, SecondaryButton } from '../buttons/PrimaryButton';
import { motion } from 'framer-motion';

export default function Hero({ onGetStarted, isAuthenticated = false }) {
  return (
    <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Elegant cream to warm beige gradient - sophisticated tea brand aesthetic */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50" aria-hidden />
      
      {/* Subtle warmth overlays - delicate and refined */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-gradient-to-br from-amber-200/30 to-transparent rounded-full filter blur-3xl animate-float"></div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-orange-200/25 to-transparent rounded-full filter blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-0 left-1/3 w-[550px] h-[550px] bg-gradient-to-tr from-yellow-200/20 to-transparent rounded-full filter blur-3xl animate-float" style={{ animationDelay: '4s' }}></div>
      </div>
      
      {/* Elegant tea leaf pattern overlay */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M50 5 Q 60 25 50 45 Q 40 25 50 5 M50 55 Q 60 75 50 95 Q 40 75 50 55' stroke='%23FF9933' stroke-width='1' fill='none'/%3E%3C/svg%3E")`
      }} aria-hidden />

      <div className="relative max-w-7xl mx-auto z-10">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          {/* Left Content */}
          <motion.div 
            className="lg:col-span-7"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Elegant Badge */}
            <motion.div 
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 backdrop-blur-sm"
              style={{ 
                background: 'linear-gradient(135deg, rgba(255, 153, 51, 0.12), rgba(255, 140, 0, 0.08))',
                border: '1px solid rgba(255, 153, 51, 0.25)',
                boxShadow: '0 2px 12px rgba(255, 153, 51, 0.15)'
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Sparkles className="w-4 h-4 text-orange-600" aria-hidden />
              <span className="text-sm font-semibold tracking-wide text-orange-800">Premium Tea Rewards</span>
            </motion.div>

            {/* Elegant Main Heading */}
            <motion.h1 
              className="font-display font-bold text-5xl md:text-6xl lg:text-7xl leading-[1.1] mb-6" 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <span className="text-gray-900">Turn Every Cup Into</span>
              <span className="block mt-3 bg-gradient-to-r from-orange-600 via-amber-600 to-orange-500 bg-clip-text text-transparent">
                Extraordinary Rewards
              </span>
            </motion.h1>

            {/* Elegant Description */}
            <motion.p 
              className="text-lg md:text-xl text-gray-700 max-w-2xl leading-relaxed mb-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Join an exclusive, transparent rewards program crafted for discerning tea enthusiasts. Earn points with every purchase, track your elegance in real-time, and unlock luxurious rewards.
            </motion.p>

            {/* Premium CTA Buttons */}
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <motion.div whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.98 }}>
                <button
                  onClick={onGetStarted}
                  className="group px-8 py-4 rounded-2xl font-semibold text-lg transition-all"
                  style={{ 
                    background: 'linear-gradient(135deg, #FF9933, #FF8C00)',
                    color: '#ffffff',
                    boxShadow: '0 4px 16px rgba(255, 153, 51, 0.3), 0 1px 3px rgba(255, 153, 51, 0.2)'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 6px 24px rgba(255, 153, 51, 0.4), 0 2px 6px rgba(255, 153, 51, 0.25)'}
                  onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 4px 16px rgba(255, 153, 51, 0.3), 0 1px 3px rgba(255, 153, 51, 0.2)'}
                >
                  <span className="flex items-center">
                    Begin Your Journey — 50 Points Welcome
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </button>
              </motion.div>

              <motion.div whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.98 }}>
                <button
                  onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                  className="px-8 py-4 rounded-2xl font-semibold text-lg transition-all text-orange-700 hover:text-orange-800"
                  style={{ 
                    background: 'rgba(255, 255, 255, 0.7)',
                    backdropFilter: 'blur(12px)',
                    border: '1.5px solid rgba(255, 153, 51, 0.3)',
                    boxShadow: '0 2px 8px rgba(255, 153, 51, 0.15)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.9)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(255, 153, 51, 0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.7)';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(255, 153, 51, 0.15)';
                  }}
                >
                  Discover How It Works
                </button>
              </motion.div>
            </motion.div>

            {/* Refined Features */}
            <motion.div 
              className="flex flex-wrap items-center gap-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center border border-emerald-200 shadow-sm">
                  <CheckCircle className="w-5 h-5 text-emerald-700" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900 text-base">100% Transparent</div>
                  <div className="text-gray-600 text-sm">Fair ranking system</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center border border-amber-200 shadow-sm">
                  <Zap className="w-5 h-5 text-amber-700" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900 text-base">Real-Time Updates</div>
                  <div className="text-gray-600 text-sm">Instant tracking</div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Content - Hero Card */}
          <motion.div 
            className="lg:col-span-5"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <HeroCard />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

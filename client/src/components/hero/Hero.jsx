import React from 'react';
import HeroCard from './HeroCard';
import { Sparkles, ArrowRight, CheckCircle, Zap, Award, TrendingUp, Shield } from 'lucide-react';
import { PrimaryButton, SecondaryButton } from '../buttons/PrimaryButton';
import { motion } from 'framer-motion';

export default function Hero({ onGetStarted, isAuthenticated = false }) {
  return (
    <section className="relative min-h-screen flex items-center pt-20 pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Multi-layered gradient background with sophisticated depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50" aria-hidden />
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-orange-50/50 to-amber-100/30" aria-hidden />
      
      {/* Multiple animated gradient orbs with enhanced variety */}
      <div className="absolute inset-0">
        <div className="absolute top-[-10%] left-[-5%] w-[800px] h-[800px] bg-gradient-to-br from-amber-300/50 via-orange-200/35 to-transparent rounded-full filter blur-3xl animate-float"></div>
        <div className="absolute top-[20%] right-[-10%] w-[700px] h-[700px] bg-gradient-to-bl from-orange-300/40 via-yellow-200/30 to-transparent rounded-full filter blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-[-15%] left-[30%] w-[750px] h-[750px] bg-gradient-to-tr from-yellow-300/35 via-amber-200/30 to-transparent rounded-full filter blur-3xl animate-float" style={{ animationDelay: '4s' }}></div>
        <div className="absolute top-[40%] left-[10%] w-[500px] h-[500px] bg-gradient-to-br from-orange-200/25 to-transparent rounded-full filter blur-3xl animate-float" style={{ animationDelay: '6s' }}></div>
        <div className="absolute bottom-[10%] right-[15%] w-[450px] h-[450px] bg-gradient-to-tl from-amber-300/30 to-transparent rounded-full filter blur-3xl animate-float" style={{ animationDelay: '3s' }}></div>
      </div>
      
      {/* Enhanced tea leaf pattern with subtle grid overlay */}
      <div className="absolute inset-0 opacity-[0.06]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M50 5 Q 60 25 50 45 Q 40 25 50 5 M50 55 Q 60 75 50 95 Q 40 75 50 55' stroke='%23FF9933' stroke-width='1.5' fill='none'/%3E%3C/svg%3E")`
      }} aria-hidden />
      
      {/* Subtle geometric grid pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0L60 60M60 0L0 60' stroke='%23FF9933' stroke-width='0.5'/%3E%3C/svg%3E")`
      }} aria-hidden />

      {/* Enhanced Floating Sparkles with varied sizes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
        {[...Array(20)].map((_, i) => {
          const size = Math.random() > 0.5 ? 3 : 2;
          return (
            <motion.div
              key={i}
              className="absolute bg-gradient-to-br from-orange-400 via-amber-300 to-yellow-400 rounded-full"
              style={{
                width: `${size}px`,
                height: `${size}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                boxShadow: '0 0 8px rgba(255, 153, 51, 0.4)',
              }}
              animate={{
                y: [0, -40, 0],
                x: [0, Math.random() * 20 - 10, 0],
                opacity: [0.3, 0.8, 0.3],
                scale: [1, 1.4, 1],
              }}
              transition={{
                duration: 3 + Math.random() * 3,
                repeat: Infinity,
                delay: Math.random() * 2,
                ease: 'easeInOut',
              }}
            />
          );
        })}
      </div>
      
      {/* Decorative tea cup illustrations */}
      <div className="absolute top-[15%] right-[5%] opacity-[0.08] pointer-events-none" aria-hidden>
        <motion.svg
          width="120"
          height="120"
          viewBox="0 0 120 120"
          animate={{ rotate: [0, 5, -5, 0], y: [0, -10, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        >
          <path d="M30 40 Q30 30 40 30 L80 30 Q90 30 90 40 L85 70 Q85 80 75 80 L45 80 Q35 80 35 70 Z" fill="#FF9933" />
          <rect x="40" y="80" width="40" height="5" rx="2" fill="#FF9933" />
          <path d="M90 45 Q105 45 105 55 Q105 65 90 65" stroke="#FF9933" strokeWidth="3" fill="none" />
        </motion.svg>
      </div>
      
      <div className="absolute bottom-[20%] left-[8%] opacity-[0.06] pointer-events-none" aria-hidden>
        <motion.svg
          width="100"
          height="100"
          viewBox="0 0 100 100"
          animate={{ rotate: [0, -5, 5, 0], y: [0, 15, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        >
          <circle cx="50" cy="50" r="35" fill="none" stroke="#FF9933" strokeWidth="2" />
          <path d="M50 20 L50 35 M50 65 L50 80 M20 50 L35 50 M65 50 L80 50" stroke="#FF9933" strokeWidth="2" />
          <circle cx="50" cy="50" r="8" fill="#FF9933" />
        </motion.svg>
      </div>

      <div className="relative max-w-7xl mx-auto z-10">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          {/* Left Content */}
          <motion.div 
            className="space-y-10"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          >
            {/* Premium Badge with enhanced animation and glow */}
            <motion.div 
              className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full backdrop-blur-md relative overflow-hidden"
              style={{ 
                background: 'linear-gradient(135deg, rgba(255, 153, 51, 0.18), rgba(255, 140, 0, 0.12))',
                border: '2px solid rgba(255, 153, 51, 0.35)',
                boxShadow: '0 8px 24px rgba(255, 153, 51, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.4), 0 0 40px rgba(255, 153, 51, 0.1)'
              }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              whileHover={{ scale: 1.08, boxShadow: '0 12px 32px rgba(255, 153, 51, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.5)' }}
            >
              {/* Shimmer effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                animate={{ x: ['-200%', '200%'] }}
                transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
              />
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              >
                <Sparkles className="w-5 h-5 text-orange-600 drop-shadow-md relative z-10" aria-hidden />
              </motion.div>
              <span className="text-sm font-bold tracking-wider text-orange-800 uppercase relative z-10">Premium Tea Rewards Program</span>
            </motion.div>

            {/* Stunning Main Heading */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.7 }}
            >
              <h1 className="font-display font-extrabold text-6xl md:text-7xl lg:text-8xl leading-[1.05] mb-6">
                <motion.span 
                  className="block text-gray-900"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  Transform
                </motion.span>
                <motion.span 
                  className="block bg-gradient-to-r from-orange-600 via-amber-500 to-orange-600 bg-clip-text text-transparent"
                  style={{
                    backgroundSize: '200% auto',
                  }}
                  animate={{
                    backgroundPosition: ['0% center', '100% center', '0% center'],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  Every Sip
                </motion.span>
                <motion.span 
                  className="block text-gray-900 mt-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  Into Rewards
                </motion.span>
              </h1>
            </motion.div>

            {/* Enhanced Description with better typography and decorative element */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="relative"
            >
              {/* Decorative quote mark */}
              <div className="absolute -left-4 -top-2 text-6xl text-orange-200 font-serif leading-none select-none" aria-hidden>"</div>
              <p className="text-xl md:text-2xl text-gray-700 max-w-xl leading-relaxed font-medium relative">
                Join our <span className="text-orange-600 font-semibold relative inline-block">
                  transparent
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-orange-400 to-amber-400 opacity-50"></span>
                </span> rewards ecosystem. 
                Every purchase earns you <span className="text-orange-600 font-semibold relative inline-block">
                  real points
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-orange-400 to-amber-400 opacity-50"></span>
                </span>, 
                every point brings you closer to <span className="text-orange-600 font-bold relative inline-block">
                  exclusive rewards
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-orange-400 to-amber-400 opacity-50"></span>
                </span>.
              </p>
            </motion.div>

            {/* Enhanced CTA Buttons with better styling */}
            <motion.div 
              className="flex flex-col sm:flex-row gap-5"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <motion.button
                onClick={onGetStarted}
                className="group relative px-10 py-5 rounded-2xl font-bold text-lg text-white overflow-hidden transition-all duration-300"
                style={{ 
                  background: 'linear-gradient(135deg, #FF9933, #FF8C00, #FF9933)',
                  backgroundSize: '200% auto',
                  boxShadow: '0 8px 24px rgba(255, 153, 51, 0.4), 0 4px 12px rgba(255, 140, 0, 0.3)',
                }}
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: '0 12px 32px rgba(255, 153, 51, 0.5), 0 6px 16px rgba(255, 140, 0, 0.4)',
                }}
                whileTap={{ scale: 0.98 }}
                animate={{
                  backgroundPosition: ['0% center', '100% center', '0% center'],
                }}
                transition={{
                  backgroundPosition: {
                    duration: 3,
                    repeat: Infinity,
                    ease: 'linear',
                  },
                }}
              >
                <span className="relative z-10 flex items-center justify-center">
                  Start Earning — Get 50 Points Free
                  <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" />
                </span>
                {/* Shine effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20"
                  initial={{ x: '-100%' }}
                  animate={{ x: '200%' }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatDelay: 1,
                    ease: 'easeInOut',
                  }}
                />
              </motion.button>

              <motion.button
                onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                className="group px-10 py-5 rounded-2xl font-semibold text-lg transition-all duration-300 text-orange-700 hover:text-orange-800 relative overflow-hidden"
                style={{ 
                  background: 'rgba(255, 255, 255, 0.8)',
                  backdropFilter: 'blur(16px)',
                  border: '2px solid rgba(255, 153, 51, 0.3)',
                  boxShadow: '0 4px 16px rgba(255, 153, 51, 0.15)',
                }}
                whileHover={{ 
                  scale: 1.05,
                  background: 'rgba(255, 255, 255, 0.95)',
                  boxShadow: '0 6px 20px rgba(255, 153, 51, 0.25)',
                }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="relative z-10">Discover How It Works</span>
              </motion.button>
            </motion.div>

            {/* Enhanced Trust Indicators with sophisticated design */}
            <motion.div 
              className="flex flex-wrap items-center gap-6 pt-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
            >
              {[
                { icon: CheckCircle, title: '100% Transparent', desc: 'Fair & automated', gradient: 'from-emerald-100 to-teal-100', iconColor: 'text-emerald-700', borderColor: 'border-emerald-200', glowColor: 'rgba(16, 185, 129, 0.2)' },
                { icon: Zap, title: 'Instant Updates', desc: 'Real-time tracking', gradient: 'from-amber-100 to-orange-100', iconColor: 'text-amber-700', borderColor: 'border-amber-200', glowColor: 'rgba(245, 158, 11, 0.2)' },
                { icon: Shield, title: 'Secure Platform', desc: '256-bit encryption', gradient: 'from-blue-100 to-indigo-100', iconColor: 'text-blue-700', borderColor: 'border-blue-200', glowColor: 'rgba(59, 130, 246, 0.2)' },
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  className="flex items-center gap-4 group cursor-default relative"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1 + idx * 0.1 }}
                  whileHover={{ scale: 1.08, x: 5 }}
                >
                  <motion.div 
                    className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${item.gradient} flex items-center justify-center border-2 ${item.borderColor} shadow-lg relative overflow-hidden`}
                    whileHover={{ rotate: [0, -5, 5, 0] }}
                    transition={{ duration: 0.5 }}
                    style={{ boxShadow: `0 4px 16px ${item.glowColor}` }}
                  >
                    <motion.div
                      className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20"
                      transition={{ duration: 0.3 }}
                    />
                    <item.icon className={`w-7 h-7 ${item.iconColor} relative z-10`} />
                  </motion.div>
                  <div>
                    <div className="font-extrabold text-gray-900 text-base leading-tight">{item.title}</div>
                    <div className="text-gray-600 text-sm font-medium">{item.desc}</div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Enhanced Stats Section with decorative elements */}
            <motion.div
              className="relative pt-10 mt-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
            >
              {/* Decorative divider */}
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-300 to-transparent"></div>
              <div className="flex flex-wrap gap-10 pt-6">
                {[
                  { value: '10K+', label: 'Active Members', icon: '👥' },
                  { value: '₹50L+', label: 'Rewards Distributed', icon: '💰' },
                  { value: '4.9★', label: 'User Rating', icon: '⭐' },
                ].map((stat, idx) => (
                  <motion.div
                    key={idx}
                    className="group relative"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.3 + idx * 0.1 }}
                    whileHover={{ scale: 1.15, y: -5 }}
                  >
                    {/* Decorative background glow */}
                    <motion.div
                      className="absolute -inset-2 bg-gradient-to-r from-orange-200 to-amber-200 rounded-2xl opacity-0 group-hover:opacity-40 blur-xl transition-opacity duration-300"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    <div className="relative">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-2xl" aria-hidden="true">{stat.icon}</span>
                        <div className="text-5xl font-black bg-gradient-to-r from-orange-600 via-amber-500 to-orange-600 bg-clip-text text-transparent" style={{ backgroundSize: '200% auto' }}>
                          {stat.value}
                        </div>
                      </div>
                      <div className="text-sm text-gray-700 font-bold uppercase tracking-wide">{stat.label}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Right Content - Enhanced Hero Card with sophisticated depth */}
          <motion.div 
            className="relative"
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, type: 'spring', stiffness: 100 }}
          >
            {/* Multiple layered glows for depth */}
            <div className="absolute -inset-6 bg-gradient-to-r from-orange-400 to-amber-400 rounded-3xl opacity-20 blur-3xl animate-pulse" />
            <div className="absolute -inset-3 bg-gradient-to-br from-orange-300 to-yellow-300 rounded-3xl opacity-15 blur-2xl" style={{ animationDelay: '1s' }} />
            
            {/* Decorative corner accents */}
            <motion.div
              className="absolute -top-4 -right-4 w-24 h-24 border-t-4 border-r-4 border-orange-300/40 rounded-tr-3xl"
              animate={{ scale: [1, 1.1, 1], opacity: [0.4, 0.6, 0.4] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
            <motion.div
              className="absolute -bottom-4 -left-4 w-24 h-24 border-b-4 border-l-4 border-amber-300/40 rounded-bl-3xl"
              animate={{ scale: [1, 1.1, 1], opacity: [0.4, 0.6, 0.4] }}
              transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
            />
            
            <HeroCard onGetStarted={onGetStarted} isAuthenticated={isAuthenticated} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

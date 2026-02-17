import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Coffee,
  Trophy,
  Users,
  TrendingUp,
  ArrowRight,
  Star,
  CheckCircle,
  Menu,
  X,
  ChevronDown,
  Sparkles,
  Crown,
  Gem,
  Shield,
  Gift,
  Heart,
  Leaf,
  Award,
  UserPlus,
  ShoppingCart,
  Activity,
  Target,
  Shuffle,
  Zap,
  Settings
} from 'lucide-react';
import { PrimaryButton, SecondaryButton } from '../components/buttons/PrimaryButton';
import { useNavigate } from 'react-router-dom';
import Hero from '../components/hero/Hero';

export function LandingPage({ onGetStarted }) {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [approvedReviews, setApprovedReviews] = useState([]);
  const [reviewsSummary, setReviewsSummary] = useState({ average: 0, count: 0 });

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 48);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch('/api/reviews/approved?limit=6');
        if (!res.ok) return;
        const b = await res.json();
        if (!mounted) return;
        setApprovedReviews(b.reviews || []);
        setReviewsSummary(b.summary || { average: 0, count: 0 });
      } catch (e) {
        console.error('Failed to fetch approved reviews', e);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const features = [
    {
      icon: Crown,
      title: 'Transparent Rank-Based Rewards',
      description: 'Our system ensures complete transparency. Your rank is automatically assigned based on your registration order, and rewards are distributed fairly without any manual manipulation.',
      color: 'text-vendor-600',
      bgGradient: 'from-vendor-50 to-orange-50'
    },
    {
      icon: Coffee,
      title: 'Earn Points with Every Tea',
      description: 'Every tea purchase adds reward points to your account. The more you purchase, the more you earn — making every cup valuable.',
      color: 'text-orange-600',
      bgGradient: 'from-orange-50 to-vendor-50'
    },
    {
      icon: TrendingUp,
      title: 'Performance-Driven Reward Model',
      description: 'Rewards are not random. Once the sales milestone is achieved, the top-ranked eligible user receives the reward, ensuring a structured and motivating system.',
      color: 'text-vendor-700',
      bgGradient: 'from-vendor-50 to-yellow-50'
    },
    {
      icon: Zap,
      title: 'Dynamic & Automated System',
      description: 'From rank reshuffling to reward distribution — everything is fully automated. Once a reward is given, the system automatically updates rankings.',
      color: 'text-orange-700',
      bgGradient: 'from-orange-50 to-red-50'
    },
    {
      icon: Shield,
      title: 'Secure & Reliable Platform',
      description: 'Built with a modern technology stack ensuring secure authentication, real-time updates, and safe reward management.',
      color: 'text-orange-700',
      bgGradient: 'from-orange-50 to-red-50'
    },
    {
      icon: Award,
      title: 'Fair Opportunity for Everyone',
      description: 'After receiving a reward, the winner moves to the last rank — giving every participant a fair chance to become the next top-ranked user.',
      color: 'text-vendor-700',
      bgGradient: 'from-vendor-50 to-yellow-50'
    },
    {
      icon: Users,
      title: 'Real-Time Tracking',
      description: (
        <>
          Users can track their rank, total points, total tea purchased, and reward eligibility status. <strong>Admin</strong> can monitor total tea sales and user performance in real time.
        </>
      ),
      color: 'text-vendor-600',
      bgGradient: 'from-vendor-50 to-orange-50'
    }
    ,
    {
      icon: Trophy,
      title: 'Milestone-Based Guaranteed Distribution',
      description: 'No lucky draws — rewards are automatically distributed to the top-ranked eligible user once the sales milestone is achieved, ensuring fairness and guaranteed payout.',
      color: 'text-vendor-700',
      bgGradient: 'from-vendor-50 to-orange-50'
    }
  ];

  const testimonials = [
    {
      name: 'Rajesh Sharma',
      role: 'Premium Member',
      content: 'The quality of teas and the cultural significance in this platform is unmatched. Truly a premium experience.',
      rating: 5,
      avatar: '👨‍🦱'
    },
    {
      name: 'Priya Patel',
      role: 'Tea Connoisseur',
      content: 'Finally, a platform that understands our cultural values while delivering world-class service.',
      rating: 5,
      avatar: '👩‍🦰'
    },
    {
      name: 'Amit Kumar',
      role: 'VIP Member',
      content: 'The rewards program is exceptional. The vendor theme and attention to cultural details make it special.',
      rating: 5,
      avatar: '👨‍💼'
    }
  ];

  

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(to bottom, #FFF8E7 0%, #FFF5E1 50%, #FFEDD5 100%)' }}>

      {/* Refined Navigation */}
      <nav className="fixed top-0 w-full z-50"
        style={{
          background: 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255, 153, 51, 0.15)',
          boxShadow: '0 2px 24px rgba(255, 153, 51, 0.1)'
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-3"
            >
              <div className="w-11 h-11 rounded-2xl flex items-center justify-center shadow-sm border border-amber-200" style={{ background: 'linear-gradient(135deg, #FFF8E7, #FFEDD5)' }}>
                <Coffee className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <span className="text-xl font-bold bg-gradient-to-r from-orange-700 to-orange-600 bg-clip-text text-transparent">Millionaire Tea</span>
                <div className="text-xs text-orange-600 font-medium tracking-wide">Premium Rewards</div>
              </div>
            </motion.div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#how-it-works" className="text-gray-700 hover:text-orange-700 transition-all duration-300 font-medium">How It Works</a>
              <a href="#features" className="text-gray-700 hover:text-orange-700 transition-all duration-300 font-medium">Features</a>
              <a href="#testimonials" className="text-gray-700 hover:text-orange-700 transition-all duration-300 font-medium">Reviews</a>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <PrimaryButton onClick={() => navigate('/register')} style={{ background: 'linear-gradient(135deg, #FF9933, #FF8C00)', color: '#ffffff', padding: '0.75rem 1.75rem', borderRadius: '0.75rem', boxShadow: '0 2px 12px rgba(255, 153, 51, 0.25)' }}>
                  Get Started
                </PrimaryButton>
              </motion.div>
            </div>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-3 rounded-xl transition-colors"
            >
              {isMenuOpen ? <X className="w-6 h-6 text-gray-800" /> : <Menu className="w-6 h-6 text-gray-800" />}
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu - Elegant */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden"
              style={{ background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(20px)', borderTop: '1px solid rgba(255, 153, 51, 0.15)' }}
            >
              <div className="px-4 py-6 space-y-4">
                <a href="#how-it-works" className="block px-4 py-3 rounded-xl text-gray-700 hover:text-orange-700 font-medium hover:bg-orange-50/50 transition-colors">How It Works</a>
                <a href="#features" className="block px-4 py-3 rounded-xl text-gray-700 hover:text-orange-700 font-medium hover:bg-orange-50/50 transition-colors">Features</a>
                <a href="#testimonials" className="block px-4 py-3 rounded-xl text-gray-700 hover:text-orange-700 font-medium hover:bg-orange-50/50 transition-colors">Reviews</a>
                <div className="px-4 py-2">
                  <PrimaryButton onClick={onGetStarted} className="w-full" style={{ background: 'linear-gradient(135deg, #FF9933, #FF8C00)', color: '#ffffff' }}>
                    Get Started
                  </PrimaryButton>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section - Elegant & Premium */}
      <Hero onGetStarted={() => { onGetStarted(); navigate('/register'); }} isAuthenticated={false} />

      {/* Features Section - Sophisticated & Refined */}
      <section id="features" className="py-24 px-4 sm:px-6 lg:px-8" style={{ background: 'rgba(255, 255, 255, 0.6)', backdropFilter: 'blur(12px)' }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <motion.h2 
              className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Crafted for <span className="bg-gradient-to-r from-orange-600 to-orange-700 bg-clip-text text-transparent">Excellence</span>
            </motion.h2>
            <motion.p 
              className="text-lg text-gray-700 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              Experience a rewards platform that combines transparency, elegance, and innovation
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                className="group p-8 rounded-3xl transition-all duration-300 hover:shadow-2xl"
                style={{
                  background: 'rgba(255, 255, 255, 0.8)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 153, 51, 0.2)',
                  boxShadow: '0 4px 24px rgba(255, 153, 51, 0.12)'
                }}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -8 }}
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border border-amber-200">
                  <feature.icon className={`w-7 h-7 ${feature.color}`} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-700 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section - Elegant Timeline */}
      <section id="how-it-works" className="py-24 px-4 sm:px-6 lg:px-8" style={{ background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.6), rgba(255, 248, 231, 0.8))', backdropFilter: 'blur(12px)' }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <motion.h2 
              className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Your Journey to <span className="bg-gradient-to-r from-orange-600 to-orange-700 bg-clip-text text-transparent">Rewards</span>
            </motion.h2>
            <motion.p 
              className="text-lg text-gray-700 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              A clear, fair flow that rewards purchases and rotates winners with complete transparency
            </motion.p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                  title: 'Register & Get Ranked',
                  desc: 'Create an account and receive a registration-based rank. Earlier sign-ups get higher priority in the reward queue.',
                  icon: UserPlus,
                  gradient: 'from-blue-100 to-cyan-100',
                  iconColor: 'text-blue-700'
                },
              {
                  title: 'Buy Tea & Earn Points',
                  desc: 'Each tea purchased grants points (1 tea = 10 points). Points accumulate automatically in your dashboard.',
                  icon: ShoppingCart,
                  gradient: 'from-amber-100 to-orange-100',
                  iconColor: 'text-orange-600'
              },
              {
                  title: 'Track Progress',
                  desc: 'View rank, points, total teas purchased and reward eligibility — all updated in real time.',
                  icon: Activity,
                  gradient: 'from-emerald-100 to-teal-100',
                  iconColor: 'text-emerald-700'
              },
              {
                  title: 'Hit The Milestone',
                  desc: 'When platform-wide sales hit the milestone (e.g. 5000 teas), the system evaluates Rank #1 for payout eligibility.',
                  icon: Target,
                  gradient: 'from-purple-100 to-pink-100',
                  iconColor: 'text-purple-700'
              },
              {
                  title: 'Guaranteed Payout',
                  desc: 'If Rank #1 meets the points threshold at milestone time, they receive the guaranteed reward automatically.',
                  icon: Award,
                  gradient: 'from-yellow-100 to-amber-100',
                  iconColor: 'text-yellow-700'
              },
              {
                  title: 'Rank Rotation',
                  desc: 'After payout, the winner moves to the last rank and everyone else advances — ensuring fair, repeatable cycles.',
                  icon: Shuffle,
                  gradient: 'from-rose-100 to-orange-100',
                  iconColor: 'text-rose-700'
              }
            ].map((step, idx) => (
              <motion.div 
                key={idx} 
                initial={{ opacity: 0, y: 30 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }} 
                className="group"
              >
                <div className="p-8 h-full rounded-3xl transition-all duration-300 hover:shadow-2xl"
                  style={{
                    background: 'rgba(255, 255, 255, 0.8)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 153, 51, 0.2)',
                    boxShadow: '0 4px 24px rgba(255, 153, 51, 0.12)'
                  }}
                >
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${step.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border border-gray-200`}>
                    {React.createElement(step.icon, { className: `w-7 h-7 ${step.iconColor}` })}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">{step.title}</h3>
                  <p className="text-sm text-gray-600">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials - Sophisticated & Elegant */}
      <section id="testimonials" className="py-24 px-4 sm:px-6 lg:px-8" style={{ background: 'rgba(255, 248, 231, 0.7)', backdropFilter: 'blur(12px)' }}>
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              What Our <span className="bg-gradient-to-r from-orange-600 to-orange-700 bg-clip-text text-transparent">Distinguished Members</span> Say
            </h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto mb-6">
              Join thousands of satisfied tea enthusiasts who trust our platform
            </p>
            {reviewsSummary.count > 0 && (
              <div className="flex items-center justify-center gap-4">
                <div className="flex items-center gap-1">
                  {[...Array(Math.round(reviewsSummary.average || 0))].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-orange-500 text-orange-500" />
                  ))}
                </div>
                <div className="text-sm font-medium text-gray-700">
                  {reviewsSummary.average?.toFixed(1)} average · {reviewsSummary.count} reviews
                </div>
              </div>
            )}
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {(approvedReviews && approvedReviews.length > 0 ? approvedReviews : testimonials).map((t, index) => (
              <motion.div
                key={t._id || index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className="h-full"
              >
                <div className="p-8 h-full rounded-3xl transition-all duration-300"
                  style={{
                    background: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 153, 51, 0.2)',
                    boxShadow: '0 4px 24px rgba(255, 153, 51, 0.12)'
                  }}
                >
                  <div className="flex items-center mb-6">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center text-2xl border border-amber-200 mr-4">
                      {t.avatar || (t.name ? t.name.charAt(0) : '🫖')}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{t.name}</div>
                      <div className="text-sm text-orange-700">{t.role || 'Member'}</div>
                    </div>
                  </div>

                  <div className="flex mb-5">
                    {[...Array(t.rating || t.rating === 0 ? t.rating : 5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-orange-500 fill-orange-500" />
                    ))}
                  </div>

                  <p className="text-gray-700 leading-relaxed italic">&ldquo;{t.content || t.comment}&rdquo;</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Elegant Final Call to Action */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="p-12 md:p-16 text-center rounded-3xl"
            style={{ 
              background: 'linear-gradient(135deg, #FF9933, #FF8C00)',
              boxShadow: '0 10px 30px rgba(255, 153, 51, 0.2)'
            }}
          >
            <div className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-8 bg-white/10 backdrop-blur-sm">
              <Crown className="w-10 h-10 text-white" />
            </div>

            <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight text-white">
              Begin Your Premium Journey
            </h2>
            <p className="text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed text-white/95">
              Join our exclusive, transparent rewards platform. Earn points with every exquisite cup, track your elegance in real-time, and unlock guaranteed milestone rewards.
            </p>

            <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.98 }}>
              <button
                onClick={() => { onGetStarted?.(); navigate('/register'); }}
                className="text-lg px-10 py-5 font-semibold rounded-2xl shadow-2xl inline-flex items-center"
                style={{ 
                  background: '#ffffff',
                  color: '#FF6600'
                }}
              >                Begin With 50 Welcome Points
                <ArrowRight className="ml-3 w-6 h-6" />
              </button>
            </motion.div>

            
          </motion.div>
        </div>
      </section>
    </div>
  );
}

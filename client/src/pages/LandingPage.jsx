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
    <div className="min-h-screen overflow-hidden" style={{ background: 'linear-gradient(135deg, #FF9933 0%, #FFF5E6 50%, #FFE4CC 100%)' }}>
      {/* Background Decorative Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ backgroundColor: '#FF9933' }}></div>
        <div className="absolute top-40 right-20 w-96 h-96 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '2s', backgroundColor: '#FF8C00' }}></div>
        <div className="absolute bottom-20 left-1/2 w-80 h-80 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '4s', backgroundColor: '#FFA500' }}></div>
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 shadow-luxury"
        style={{
          background: '#ffffff',
          backdropFilter: 'blur(8px)',
          borderBottom: '1px solid rgba(15, 23, 42, 0.06)',
          boxShadow: '0 8px 32px rgba(15,23,42,0.06)'
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-3"
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg bg-white ring-1 ring-slate-200">
                <Coffee className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <span className="text-xl font-bold text-slate-900">Millionaire Chai</span>
                <div className="text-xs text-slate-500 font-medium">Premium Platform</div>
              </div>
            </motion.div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#how-it-works" className="text-slate-800 hover:text-slate-900 transition-all duration-300 font-medium">How It Works</a>
              <a href="#features" className="text-slate-800 hover:text-slate-900 transition-all duration-300 font-medium">Features</a>
              <a href="#testimonials" className="text-slate-800 hover:text-slate-900 transition-all duration-300 font-medium">Reviews</a>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <PrimaryButton onClick={() => navigate('/register')} style={{ background: 'linear-gradient(to right, #FF9933, #FF8C00)' }}>
                  Get Started
                </PrimaryButton>
              </motion.div>
            </div>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-3 rounded-xl transition-colors"
              style={{ hover: { backgroundColor: 'rgba(0,0,0,0.04)' } }}
            >
              {isMenuOpen ? <X className="w-6 h-6" style={{ color: '#0f172a' }} /> : <Menu className="w-6 h-6" style={{ color: '#0f172a' }} />}
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden"
              style={{ background: '#ffffff', backdropFilter: 'blur(12px)', borderTop: '1px solid rgba(15,23,42,0.06)' }}
            >
              <div className="px-4 py-6 space-y-4">
                <a href="#how-it-works" className="block px-4 py-3 rounded-xl text-slate-800 font-medium" style={{ hover: { backgroundColor: 'rgba(0,0,0,0.04)' } }}>How It Works</a>
                <a href="#features" className="block px-4 py-3 rounded-xl text-slate-800 font-medium" style={{ hover: { backgroundColor: 'rgba(0,0,0,0.04)' } }}>Features</a>
                <a href="#testimonials" className="block px-4 py-3 rounded-xl text-slate-800 font-medium" style={{ hover: { backgroundColor: 'rgba(0,0,0,0.04)' } }}>Reviews</a>
                <div className="px-4 py-2">
                  <PrimaryButton onClick={onGetStarted} className="w-full" style={{ background: 'linear-gradient(to right, #FF9933, #FF8C00)' }}>
                    Get Started
                  </PrimaryButton>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section (polished professional version) */}
      <section className="relative pt-24 pb-16 px-4 sm:px-6 lg:px-8" style={{ background: 'transparent' }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7">
              <p className="text-sm font-semibold text-amber-600 mb-3">Premium Rank-Based Tea Rewards</p>

                <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight mb-4">Turn Every Cup Into Meaningful Rewards</h1>

                <p className="text-base md:text-lg text-gray-700 max-w-2xl mb-6" style={{ lineHeight: 1.7 }}>
                  A transparent, performance-driven rewards platform. Earn points with each purchase and compete for guaranteed milestone payouts awarded to the top-ranked eligible member. The system automates rank updates, milestone checks and fair reward distribution so members can focus on enjoying premium tea while tracking progress in real time.
                </p>

                <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
                  <PrimaryButton aria-label="Register and secure your rank" onClick={() => { onGetStarted(); navigate('/register'); }} className="px-6 py-3 text-sm font-semibold rounded-md shadow" style={{ background: 'linear-gradient(90deg,#FF8C00,#FF7000)', color: '#fff' }}>Register Now</PrimaryButton>
                  <SecondaryButton aria-label="Scroll to how it works" onClick={() => { document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' }); }} className="px-5 py-3 text-sm font-medium rounded-md border" style={{ borderColor: 'rgba(15,23,42,0.06)', background: 'transparent', color: '#0f172a' }}>How It Works</SecondaryButton>
                </div>

              
            </div>

            <div className="lg:col-span-5">
              <aside className="w-full max-w-sm mx-auto bg-white rounded-lg p-6 shadow border" aria-hidden="false">
                <div className="mb-4">
                  <div className="text-xs font-medium text-gray-600 uppercase">Rewards Preview</div>
                  <div className="mt-2 text-lg font-semibold text-gray-900">Join & Start Earning</div>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                    <div className="h-3 bg-amber-400" style={{ width: '25%' }} />
                  </div>
                  <div className="text-sm text-gray-600">Track rank, points, tea purchases and eligibility from your dashboard.</div>
                </div>

                <div className="grid grid-cols-1 gap-3 mb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium text-gray-800">Current Rank</div>
                      <div className="text-xs text-gray-500">Displayed in dashboard</div>
                    </div>
                    <div className="text-xl font-semibold text-gray-900">—</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium text-gray-800">Points</div>
                      <div className="text-xs text-gray-500">Accrued from purchases</div>
                    </div>
                    <div className="text-xl font-semibold text-gray-900">—</div>
                  </div>
                </div>

                <PrimaryButton onClick={() => navigate('/register')} className="w-full text-sm font-semibold py-2">Create Free Account</PrimaryButton>
                <div className="mt-3 text-xs text-gray-500">Transparent · Secure · Automated · Fair</div>
              </aside>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 px-4 sm:px-6 lg:px-8" style={{ background: 'rgba(255, 255, 255, 0.5)', backdropFilter: 'blur(8px)' }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">How It Works</h2>
            <p className="text-sm text-gray-600 mt-2 max-w-2xl mx-auto">A clear, fair flow that rewards purchases and rotates winners predictably.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                  title: 'Register & Get Ranked',
                  desc: 'Create an account and receive a registration-based rank. Earlier sign-ups get higher priority in the reward queue.',
                  icon: UserPlus
                },
              {
                  title: 'Buy Tea & Earn Points',
                  desc: 'Each tea purchased grants points (1 tea = 10 points). Points accumulate automatically in your dashboard.',
                  icon: ShoppingCart
              },
              {
                  title: 'Track Progress',
                  desc: 'View rank, points, total teas purchased and reward eligibility — all updated in real time.',
                  icon: Activity
              },
              {
                  title: 'Hit The Milestone',
                  desc: 'When platform-wide sales hit the milestone (e.g. 5000 teas), the system evaluates Rank #1 for payout eligibility.',
                  icon: Target
              },
              {
                  title: 'Guaranteed Payout',
                  desc: 'If Rank #1 meets the points threshold at milestone time, they receive the guaranteed reward automatically.',
                  icon: Award
              },
              {
                  title: 'Rank Rotation',
                  desc: 'After payout, the winner moves to the last rank and everyone else advances — ensuring fair, repeatable cycles.',
                  icon: Shuffle
              }
            ].map((step, idx) => (
              <motion.div key={idx} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: idx * 0.06 }} className="group">
                <div className="glass-card p-6 h-full flex flex-col items-start gap-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-md" style={{ background: 'linear-gradient(135deg,#FF9933,#FF8C00)' }}>
                    {/* icon placeholder - lucide icons imported above */}
                    {React.createElement(step.icon, { className: 'w-6 h-6 text-white' })}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">{step.title}</h3>
                  <p className="text-sm text-gray-600">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8" style={{ background: 'rgba(255, 255, 255, 0.5)', backdropFilter: 'blur(8px)' }}>
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Why Choose Our Tea Reward System?
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="group"
              >
                <div className="glass-card p-8 h-full transition-all duration-500" style={{ background: `linear-gradient(to bottom right, ${index % 2 === 0 ? 'rgba(255, 153, 51, 0.05)' : 'rgba(255, 140, 0, 0.05)'}, ${index % 2 === 0 ? 'rgba(255, 140, 0, 0.05)' : 'rgba(255, 153, 51, 0.05)'})` }}>
                  <div className="w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300" style={{ background: 'linear-gradient(to bottom right, #FF9933, #FF8C00)' }}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">{feature.title}</h3>
                  <p className="text-gray-600 text-center leading-relaxed">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      

      {/* Testimonials */}
      <section id="testimonials" className="py-20 px-4 sm:px-6 lg:px-8" style={{ background: 'rgba(255, 255, 255, 0.5)', backdropFilter: 'blur(8px)' }}>
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              What Our
              <span className="block" style={{ background: 'linear-gradient(to right, #FF9933, #FF8C00)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                Elite Members Say
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join thousands of satisfied tea enthusiasts
            </p>
            <div className="mt-4 flex items-center justify-center gap-4">
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(Math.round(reviewsSummary.average || 0))].map((_, i) => (<Star key={i} className="w-4 h-4" />))}
              </div>
              <div className="text-sm text-gray-600">{reviewsSummary.average || 0} average — {reviewsSummary.count || 0} reviews</div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {(approvedReviews && approvedReviews.length > 0 ? approvedReviews : testimonials).map((t, index) => (
              <motion.div
                key={t._id || index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className="glass-card p-8 h-full">
                  <div className="flex items-center mb-4">
                    <div className="text-4xl mr-4">{t.avatar || (t.name ? t.name.charAt(0) : '🫖')}</div>
                    <div>
                      <div className="font-bold text-gray-900">{t.name}</div>
                      <div className="text-sm font-medium" style={{ color: '#FF9933' }}>{t.role || ''}</div>
                    </div>
                  </div>

                  <div className="flex mb-4">
                    {[...Array(t.rating || t.rating === 0 ? t.rating : 5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>

                  <p className="text-gray-700 italic leading-relaxed">"{t.content || t.comment}"</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="glass-card p-12 text-center luxury-shadow text-white"
            style={{ background: 'linear-gradient(to bottom right, #FF9933, #FF8C00)' }}
          >
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6" style={{ background: 'rgba(255, 255, 255, 0.12)', backdropFilter: 'blur(6px)' }}>
              <Gift className="w-8 h-8 text-white" />
            </div>

            <h2 className="text-3xl md:text-4xl font-extrabold mb-3 leading-tight">
              Start Your Reward Journey
            </h2>
            <p className="text-lg mb-6 max-w-2xl mx-auto text-amber-50/95">
              Join our transparent, rank-based rewards platform and earn points with every cup. Track progress in real time and qualify for milestone-based guaranteed rewards.
            </p>

            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
              <PrimaryButton
                onClick={() => { onGetStarted?.(); navigate('/register'); }}
                className="text-base px-8 py-3 font-semibold rounded-lg shadow-md"
                style={{ background: 'white', color: '#FF6E1A' }}
              >
                Start Earning Today
                <ArrowRight className="ml-2 w-5 h-5" />
              </PrimaryButton>
            </motion.div>

            
          </motion.div>
        </div>
      </section>
    </div>
  );
}

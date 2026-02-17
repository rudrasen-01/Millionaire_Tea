import React from 'react';
import { motion } from 'framer-motion';
import { Coffee, Trophy, Star, TrendingUp, CheckCircle, Wallet, Target, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

export function Dashboard({ scrollTo }) {
  const { user, isLoading, setCurrentPage, allUsers, addNotification } = useApp();
  
  const [rating, setRating] = React.useState(5);
  const [reviewComment, setReviewComment] = React.useState('');
  const [isSubmittingReview, setIsSubmittingReview] = React.useState(false);
  const [userReviews, setUserReviews] = React.useState([]);

  const pointsToUnlock = 50000 - user.points;
  const progressPercentage = (user.points / 50000) * 100;

  if (isLoading) {
    return (
      <div style={{ minHeight: '100vh', padding: '1.5rem', background: 'transparent' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ height: '2rem', width: '16rem', backgroundColor: '#E5E7EB', borderRadius: '0.5rem', marginBottom: '0.5rem' }}></div>
            <div style={{ height: '1rem', width: '24rem', backgroundColor: '#E5E7EB', borderRadius: '0.5rem' }}></div>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
            {[1, 2, 3].map((i) => (
              <div key={i} style={{ backgroundColor: '#ffffff', borderRadius: '1.25rem', padding: '1rem', height: '120px', boxShadow: '0 8px 24px -8px rgba(0,0,0,0.06)' }}></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // fetch user's own reviews
  React.useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch('/api/reviews/mine', { credentials: 'include' });
        if (!res.ok) return;
        const b = await res.json();
        if (!mounted) return;
        setUserReviews(b.reviews || []);
      } catch (e) {
        console.error('Failed to fetch my reviews', e);
      }
    })();
    return () => { mounted = false; };
  }, []);

  React.useEffect(() => {
    if (scrollTo === 'reviews') {
      setTimeout(() => {
        const el = document.getElementById('reviews-section');
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 120);
    }
  }, [scrollTo]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen p-6"
      style={{ background: 'transparent' }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-2">
            <div>
              <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
                Welcome back, {user.name}! ☕
              </h1>
              <p className="text-lg text-gray-600">
                Track your progress, earn rewards, and climb the ranks
              </p>
            </div>
            <div className="hidden md:flex items-center gap-3">
              <div className="glass-card px-4 py-2">
                <div className="text-xs text-gray-500 mb-1">Member Since</div>
                <div className="text-sm font-semibold text-gray-900">
                  {new Date(user.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Metric Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Points Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="glass-card-premium p-6 hover-lift group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-tea-400 to-tea-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <Coffee className="w-7 h-7 text-white" />
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-600">Teas Consumed</div>
                  <div className="text-3xl font-bold text-gray-900">{user.teasConsumed}</div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="flex items-center text-green-600 font-medium">
                <TrendingUp className="w-4 h-4 mr-1" />
                +12%
              </div>
              <span className="text-gray-500">this month</span>
            </div>
          </motion.div>

          {/* Reward Points Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="glass-card-premium p-6 hover-lift group relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-tea-200 to-premium-200 rounded-full filter blur-3xl opacity-30 group-hover:opacity-50 transition-opacity"></div>
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-luxury-gold to-tea-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Star className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-600">Reward Points</div>
                    <div className="text-3xl font-bold text-gray-900">{user.points.toLocaleString()}</div>
                  </div>
                </div>
              </div>
              <div className="text-sm">
                {user.points >= 50000 ? (
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-700 font-medium">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Withdrawal Unlocked
                  </span>
                ) : (
                  <span className="text-gray-600">
                    {(50000 - user.points).toLocaleString()} points to unlock
                  </span>
                )}
              </div>
            </div>
          </motion.div>

          {/* Rank Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="glass-card-premium p-6 hover-lift group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <Trophy className="w-7 h-7 text-white" />
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-600">Current Rank</div>
                  {user.role !== 'admin' ? (
                    <div className="text-3xl font-bold text-gray-900">#{user.rank ?? user.rankPosition ?? '-'}</div>
                  ) : (
                    <div className="text-2xl font-bold text-gray-900">Admin</div>
                  )}
                </div>
              </div>
            </div>
            {user.role !== 'admin' && (
              <div className="text-sm text-gray-600">
                of {allUsers?.length || 0} active members
              </div>
            )}
          </motion.div>
        </div>

        {/* Progress Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="glass-card-premium p-8 mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">Unlock Progress</h2>
              <p className="text-gray-600">Reach 50,000 points to enable withdrawals</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold gradient-text">{progressPercentage.toFixed(1)}%</div>
              <div className="text-sm text-gray-500">Complete</div>
            </div>
          </div>
          
          <div className="relative">
            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden shadow-inner">
              <motion.div
                className="h-4 rounded-full shadow-glow"
                style={{ 
                  background: 'linear-gradient(90deg, #FF9800, #F57C00)',
                  width: `${Math.min(progressPercentage, 100)}%`
                }}
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(progressPercentage, 100)}%` }}
                transition={{ duration: 1, ease: 'easeOut', delay: 0.5 }}
              />
            </div>
            <div className="flex justify-between mt-2 text-sm">
              <span className="text-gray-600">{user.points.toLocaleString()} points</span>
              <span className="font-bold text-tea-600">50,000 points</span>
            </div>
          </div>

          {pointsToUnlock > 0 && (
            <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-tea-50 to-orange-50 border border-tea-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-white shadow-sm flex items-center justify-center flex-shrink-0">
                  <Target className="w-5 h-5 text-tea-600" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Keep Going!</div>
                  <div className="text-sm text-gray-600">
                    You need <span className="font-bold text-tea-700">{pointsToUnlock.toLocaleString()}</span> more points to unlock withdrawal
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>

        {/* Action Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
        >
          <button 
            onClick={() => setCurrentPage('wallet')}
            className="glass-card p-6 hover-lift group text-left transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-tea-400 to-tea-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <Wallet className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <div className="font-bold text-gray-900 text-lg">Wallet</div>
                <div className="text-sm text-gray-600">Manage rewards & withdrawals</div>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-tea-600 group-hover:translate-x-1 transition-all" />
            </div>
          </button>

          <button 
            onClick={() => setCurrentPage('ranking')}
            className="glass-card p-6 hover-lift group text-left transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <div className="font-bold text-gray-900 text-lg">Rankings</div>
                <div className="text-sm text-gray-600">View leaderboard & compete</div>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all" />
            </div>
          </button>

          <button
            onClick={() => setCurrentPage('reviews')}
            className="glass-card p-6 hover-lift group text-left transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <Star className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <div className="font-bold text-gray-900 text-lg">Reviews</div>
                <div className="text-sm text-gray-600">Share your experience</div>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
            </div>
          </button>
        </motion.div>
          {scrollTo === 'reviews' && (
            <>
              {/* Review Submission */}
              <motion.div id="reviews-section" style={{ marginTop: '1.5rem', maxWidth: '720px' }} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <div style={{ background: '#fff', padding: '1rem', borderRadius: '0.75rem', boxShadow: '0 6px 18px rgba(0,0,0,0.04)' }}>
                  <div style={{ marginBottom: '0.5rem', fontWeight: '600' }}>Share your experience</div>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.5rem' }}>
                    {[1,2,3,4,5].map(n => (
                      <button key={n} onClick={() => setRating(n)} style={{ background: n <= rating ? '#FBBF24' : 'transparent', border: '1px solid #E5E7EB', padding: '0.35rem 0.6rem', borderRadius: '0.35rem', cursor: 'pointer' }}>{n}★</button>
                    ))}
                  </div>
                  <textarea value={reviewComment} onChange={(e) => setReviewComment(e.target.value)} placeholder="Write a short comment (optional)" rows={3} style={{ width: '100%', padding: '0.5rem', borderRadius: '0.5rem', border: '1px solid #E5E7EB', marginBottom: '0.5rem' }} />
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button disabled={isSubmittingReview} onClick={async () => {
                      try {
                        setIsSubmittingReview(true);
                        const res = await fetch('/api/reviews', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ rating, comment: reviewComment }) });
                        const b = await res.json().catch(() => ({}));
                        if (!res.ok) { addNotification({ id: Date.now(), text: b.message || 'Failed to submit review' }); return; }
                        addNotification({ id: Date.now(), text: 'Review submitted and pending approval' });
                        setReviewComment(''); setRating(5);
                      } catch (e) { console.error('Submit review error', e); addNotification({ id: Date.now(), text: 'Network error' }); }
                      finally { setIsSubmittingReview(false); }
                    }} style={{ background: 'linear-gradient(to right,#FF9933,#FF8C00)', color: '#fff', padding: '0.5rem 1rem', borderRadius: '0.5rem', border: 'none' }}>{isSubmittingReview ? 'Submitting...' : 'Submit Review'}</button>
                    <button onClick={() => { setRating(5); setReviewComment(''); }} style={{ background: 'transparent', border: '1px solid #E5E7EB', padding: '0.5rem 1rem', borderRadius: '0.5rem' }}>Clear</button>
                  </div>
                </div>
              </motion.div>

              {/* My Reviews */}
              <motion.div style={{ marginTop: '1.25rem', maxWidth: '720px' }} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
                <div style={{ background: '#fff', padding: '1rem', borderRadius: '0.75rem', boxShadow: '0 6px 18px rgba(0,0,0,0.04)' }}>
                  <div style={{ fontWeight: 600, marginBottom: '0.75rem' }}>Your Reviews</div>
                  {userReviews.length === 0 ? (
                    <div style={{ color: '#6B7280' }}>You haven't submitted any reviews yet.</div>
                  ) : (
                    <div style={{ display: 'grid', gap: '0.75rem' }}>
                      {userReviews.map(r => (
                        <div key={r._id} style={{ border: '1px solid #E5E7EB', padding: '0.75rem', borderRadius: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                            <div style={{ fontWeight: 600 }}>{r.name || (user && user.name)}</div>
                            <div style={{ color: '#6B7280', fontSize: '0.9rem' }}>{r.comment || '<no comment>'}</div>
                            <div style={{ marginTop: '0.35rem', fontSize: '0.85rem', color: '#6B7280' }}>Rating: {r.rating} · {r.approved ? 'Approved' : 'Pending'}</div>
                          </div>
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button onClick={async () => {
                              try {
                                const res = await fetch(`/api/reviews/${r._id}`, { method: 'DELETE', credentials: 'include' });
                                const b = await res.json().catch(() => ({}));
                                if (!res.ok) { addNotification({ id: Date.now(), text: b.message || 'Delete failed' }); return; }
                                setUserReviews(prev => prev.filter(rr => rr._id !== r._id));
                                addNotification({ id: Date.now(), text: 'Review deleted' });
                              } catch (e) { console.error(e); addNotification({ id: Date.now(), text: 'Network error' }); }
                            }} style={{ background: 'transparent', border: '1px solid #E5E7EB', padding: '0.4rem 0.6rem', borderRadius: '0.35rem' }}>Delete</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            </>
          )}

      </div>
    </motion.div>
  );
}

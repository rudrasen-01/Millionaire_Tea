import React from 'react';
import { motion } from 'framer-motion';
import { Coffee, Trophy, Star } from 'lucide-react';
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
      <div className="min-h-screen p-6 bg-gradient-to-br from-cream via-warmWhite to-cream">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <div className="h-8 w-64 bg-gray-200 rounded-lg mb-2"></div>
            <div className="h-4 w-96 bg-gray-200 rounded-lg"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gradient-to-br from-cream to-warmWhite border-2 border-caramel/40 rounded-2xl p-4 h-32 shadow-xl"></div>
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
      className="min-h-screen p-6 bg-gradient-to-br from-cream via-warmWhite to-cream"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-darkBrown mb-2 font-baloo">
            Welcome back, {user.name}! ☕
          </h1>
          <p className="text-darkBrown/70">
            Your tea journey continues. Keep earning those reward points!
          </p>
        </motion.div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="metric-card bg-gradient-to-br from-cream to-warmWhite border-2 border-caramel/40 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-caramel to-darkBrown flex items-center justify-center mr-4">
                <Coffee className="w-6 h-6 text-cream" />
              </div>
              <div>
                <div className="text-sm text-darkBrown/60 mb-1">Teas Consumed</div>
                <div className="text-3xl font-bold text-darkBrown">{user.teasConsumed}</div>
                <div className="text-xs text-caramel">↑ 12% this month</div>
              </div>
            </div>
          </div>
          
          <div className="metric-card bg-gradient-to-br from-cream to-warmWhite border-2 border-caramel/40 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-caramel to-darkBrown flex items-center justify-center mr-4">
                <Star className="w-6 h-6 text-cream" />
              </div>
              <div>
                <div className="text-sm text-darkBrown/60 mb-1">Reward Points</div>
                <div className="text-3xl font-bold text-darkBrown">{user.points}</div>
                <div className="text-xs text-darkBrown/60">Locked until 50,000</div>
              </div>
            </div>
          </div>
          
          <div className="metric-card bg-gradient-to-br from-cream to-warmWhite border-2 border-caramel/40 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-caramel to-darkBrown flex items-center justify-center mr-4">
                <Trophy className="w-6 h-6 text-cream" />
              </div>
              <div>
                <div className="text-sm text-darkBrown/60 mb-1">Current Rank</div>
                {user.role !== 'admin' ? (
                  <>
                    <div className="text-3xl font-bold text-darkBrown">{user.rank ?? user.rankPosition ?? '-'}</div>
                    <div className="text-xs text-darkBrown/60">of {allUsers?.length || 0} users</div>
                  </>
                ) : (
                  <div className="text-base text-darkBrown/60">Admin</div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Progress Section removed per request */}

        {/* Action Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="flex flex-row gap-4 flex-wrap"
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <button 
              onClick={() => setCurrentPage('wallet')}
              className="bg-gradient-to-r from-caramel to-darkBrown text-cream px-8 py-3 rounded-lg font-bold border-none cursor-pointer text-base shadow-lg hover:shadow-xl transition-all"
            >
              View Wallet
            </button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <button 
              onClick={() => setCurrentPage('ranking')}
              className="bg-gradient-to-br from-cream to-warmWhite border-2 border-caramel/40 text-caramel px-8 py-3 rounded-lg font-bold cursor-pointer text-base shadow-lg hover:shadow-xl transition-all"
            >
              View Rankings
            </button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <button
              onClick={() => setCurrentPage('reviews')}
              className="bg-gradient-to-br from-cream to-warmWhite border-2 border-caramel/40 text-darkBrown px-8 py-3 rounded-lg font-semibold cursor-pointer text-base shadow-lg hover:shadow-xl transition-all"
            >
              View Reviews
            </button>
          </motion.div>
        </motion.div>
          {scrollTo === 'reviews' && (
            <>
              {/* Review Submission */}
              <motion.div id="reviews-section" className="mt-6 max-w-3xl" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <div className="bg-gradient-to-br from-cream to-warmWhite border-2 border-caramel/40 rounded-2xl p-4 shadow-xl">
                  <div className="mb-2 font-semibold text-darkBrown">Share your experience</div>
                  <div className="flex gap-2 items-center mb-2">
                    {[1,2,3,4,5].map(n => (
                      <button key={n} onClick={() => setRating(n)} className={`${n <= rating ? 'bg-caramel' : 'bg-transparent'} border border-caramel/30 px-3 py-2 rounded-lg cursor-pointer hover:bg-caramel/70 transition-colors text-darkBrown`}>{n}★</button>
                    ))}
                  </div>
                  <textarea value={reviewComment} onChange={(e) => setReviewComment(e.target.value)} placeholder="Write a short comment (optional)" rows={3} className="w-full p-2 rounded-lg border-2 border-caramel/30 bg-warmWhite mb-2 focus:outline-none focus:ring-2 focus:ring-caramel text-darkBrown" />
                  <div className="flex gap-2">
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
                    }} className="bg-gradient-to-r from-caramel to-darkBrown text-cream px-4 py-2 rounded-lg border-none hover:shadow-lg transition-all disabled:opacity-50">{isSubmittingReview ? 'Submitting...' : 'Submit Review'}</button>
                    <button onClick={() => { setRating(5); setReviewComment(''); }} className="bg-transparent border-2 border-caramel/30 text-darkBrown px-4 py-2 rounded-lg hover:bg-beige/30 transition-colors">Clear</button>
                  </div>
                </div>
              </motion.div>

              {/* My Reviews */}
              <motion.div className="mt-5 max-w-3xl" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
                <div className="bg-gradient-to-br from-cream to-warmWhite border-2 border-caramel/40 rounded-2xl p-4 shadow-xl">
                  <div className="font-semibold mb-3 text-darkBrown">Your Reviews</div>
                  {userReviews.length === 0 ? (
                    <div className="text-darkBrown/60">You haven't submitted any reviews yet.</div>
                  ) : (
                    <div className="grid gap-3">
                      {userReviews.map(r => (
                        <div key={r._id} className="border-2 border-caramel/30 bg-warmWhite p-3 rounded-lg flex justify-between items-center">
                          <div>
                            <div className="font-semibold text-darkBrown">{r.name || (user && user.name)}</div>
                            <div className="text-darkBrown/60 text-sm">{r.comment || '<no comment>'}</div>
                            <div className="mt-1 text-xs text-darkBrown/60">Rating: {r.rating} · {r.approved ? 'Approved' : 'Pending'}</div>
                          </div>
                          <div className="flex gap-2">
                            <button onClick={async () => {
                              try {
                                const res = await fetch(`/api/reviews/${r._id}`, { method: 'DELETE', credentials: 'include' });
                                const b = await res.json().catch(() => ({}));
                                if (!res.ok) { addNotification({ id: Date.now(), text: b.message || 'Delete failed' }); return; }
                                setUserReviews(prev => prev.filter(rr => rr._id !== r._id));
                                addNotification({ id: Date.now(), text: 'Review deleted' });
                              } catch (e) { console.error(e); addNotification({ id: Date.now(), text: 'Network error' }); }
                            }} className="bg-transparent border border-caramel/30 text-darkBrown px-2 py-1 rounded-md hover:bg-beige/30 transition-colors">Delete</button>
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

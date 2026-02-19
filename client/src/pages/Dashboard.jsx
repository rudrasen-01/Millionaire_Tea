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
      style={{ minHeight: '100vh', padding: '1.5rem', background: 'transparent' }}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        {/* Header */}
        <motion.div 
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.3 }}
          style={{ marginBottom: '2rem' }}
        >
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1F2937', marginBottom: '0.5rem' }}>
            Welcome back, {user.name}! ☕
          </h1>
          <p style={{ color: '#6B7280' }}>
            Your tea journey continues. Keep earning those reward points!
          </p>
        </motion.div>

        {/* Metric Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          <div className="metric-card">
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{ 
                width: '3rem', 
                height: '3rem', 
                borderRadius: '0.75rem', 
                background: 'linear-gradient(to bottom right, #FF9933, #FF8C00)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                marginRight: '1rem'
              }}>
                <Coffee style={{ width: '1.5rem', height: '1.5rem', color: 'white' }} />
              </div>
              <div>
                <div style={{ fontSize: '0.875rem', color: '#6B7280', marginBottom: '0.25rem' }}>Teas Consumed</div>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1F2937' }}>{user.teasConsumed}</div>
                <div style={{ fontSize: '0.75rem', color: '#FF9933' }}>↑ 12% this month</div>
              </div>
            </div>
          </div>
          
          <div className="metric-card">
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{ 
                width: '3rem', 
                height: '3rem', 
                borderRadius: '0.75rem', 
                background: 'linear-gradient(to bottom right, #FF8C00, #FF6B35)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                marginRight: '1rem'
              }}>
                <Star style={{ width: '1.5rem', height: '1.5rem', color: 'white' }} />
              </div>
              <div>
                <div style={{ fontSize: '0.875rem', color: '#6B7280', marginBottom: '0.25rem' }}>Reward Points</div>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1F2937' }}>{user.points}</div>
                <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>Locked until 50,000</div>
              </div>
            </div>
          </div>
          
          <div className="metric-card">
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{ 
                width: '3rem', 
                height: '3rem', 
                borderRadius: '0.75rem', 
                background: 'linear-gradient(to bottom right, #FFD700, #FFA500)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                marginRight: '1rem'
              }}>
                <Trophy style={{ width: '1.5rem', height: '1.5rem', color: 'white' }} />
              </div>
              <div>
                <div style={{ fontSize: '0.875rem', color: '#6B7280', marginBottom: '0.25rem' }}>Current Rank</div>
                {user.role !== 'admin' ? (
                  <>
                      <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1F2937' }}>{user.rank ?? user.rankPosition ?? '-'}</div>
                    <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>of {allUsers?.length || 0} users</div>
                  </>
                ) : (
                  <div style={{ fontSize: '1rem', color: '#6B7280' }}>Admin</div>
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
          style={{ display: 'flex', flexDirection: 'row', gap: '1rem', flexWrap: 'wrap' }}
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <button 
              onClick={() => setCurrentPage('wallet')}
              style={{
                background: 'linear-gradient(to right, #FF9933, #FF8C00)',
                color: 'white',
                padding: '0.75rem 2rem',
                borderRadius: '0.5rem',
                fontWeight: 'bold',
                border: 'none',
                cursor: 'pointer',
                fontSize: '1rem',
                boxShadow: '0 4px 12px rgba(255, 153, 51, 0.3)'
              }}
            >
              View Wallet
            </button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <button 
              onClick={() => setCurrentPage('ranking')}
                style={{
                backgroundColor: 'rgba(255, 255, 255, 0.82)',
                color: '#FF8C00',
                padding: '0.75rem 2rem',
                borderRadius: '0.5rem',
                fontWeight: 'bold',
                border: '2px solid rgba(255, 153, 51, 0.18)',
                cursor: 'pointer',
                fontSize: '1rem',
                boxShadow: '0 4px 12px rgba(255, 153, 51, 0.12)'
              }}
            >
              View Rankings
            </button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <button
              onClick={() => setCurrentPage('reviews')}
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.92)',
                color: '#1F2937',
                padding: '0.75rem 2rem',
                borderRadius: '0.5rem',
                fontWeight: '600',
                border: '1px solid rgba(229,231,235,0.9)',
                cursor: 'pointer',
                fontSize: '1rem',
                boxShadow: '0 6px 18px rgba(0,0,0,0.04)'
              }}
            >
              View Reviews
            </button>
          </motion.div>
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

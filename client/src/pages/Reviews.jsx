import React from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';

export function Reviews() {
  const { user, addNotification } = useApp();

  const [rating, setRating] = React.useState(5);
  const [reviewComment, setReviewComment] = React.useState('');
  const [isSubmittingReview, setIsSubmittingReview] = React.useState(false);
  const [userReviews, setUserReviews] = React.useState([]);

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

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }} style={{ minHeight: '100vh', padding: '1.5rem' }}>
      <div style={{ maxWidth: '880px', margin: '0 auto' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>Reviews</h2>
        <p style={{ color: '#6B7280', marginBottom: '1rem' }}>Share feedback and view your submitted reviews.</p>

        <motion.div id="reviews-section" style={{ marginTop: '1rem', background: '#fff', padding: '1rem', borderRadius: '0.75rem', boxShadow: '0 6px 18px rgba(0,0,0,0.04)' }} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
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
                // refresh
                const r = await fetch('/api/reviews/mine', { credentials: 'include' });
                if (r.ok) { const jb = await r.json().catch(() => ({})); setUserReviews(jb.reviews || []); }
              } catch (e) { console.error('Submit review error', e); addNotification({ id: Date.now(), text: 'Network error' }); }
              finally { setIsSubmittingReview(false); }
            }} style={{ background: 'linear-gradient(to right,#FF9933,#FF8C00)', color: '#fff', padding: '0.5rem 1rem', borderRadius: '0.5rem', border: 'none' }}>{isSubmittingReview ? 'Submitting...' : 'Submit Review'}</button>
            <button onClick={() => { setRating(5); setReviewComment(''); }} style={{ background: 'transparent', border: '1px solid #E5E7EB', padding: '0.5rem 1rem', borderRadius: '0.5rem' }}>Clear</button>
          </div>
        </motion.div>

        <motion.div style={{ marginTop: '1rem' }} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
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
      </div>
    </motion.div>
  );
}

export default Reviews;

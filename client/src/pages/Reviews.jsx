import React from 'react';
import { motion } from 'framer-motion';
import { Star, Trash2, CheckCircle, Clock, MessageSquare } from 'lucide-react';
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

  const handleSubmitReview = async () => {
    try {
      setIsSubmittingReview(true);
      const res = await fetch('/api/reviews', { 
        method: 'POST', 
        credentials: 'include', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify({ rating, comment: reviewComment }) 
      });
      const b = await res.json().catch(() => ({}));
      if (!res.ok) { 
        addNotification({ id: Date.now(), text: b.message || 'Failed to submit review' }); 
        return; 
      }
      addNotification({ id: Date.now(), text: 'Review submitted and pending approval' });
      setReviewComment(''); 
      setRating(5);
      // Refresh reviews
      const r = await fetch('/api/reviews/mine', { credentials: 'include' });
      if (r.ok) { 
        const jb = await r.json().catch(() => ({})); 
        setUserReviews(jb.reviews || []); 
      }
    } catch (e) { 
      console.error('Submit review error', e); 
      addNotification({ id: Date.now(), text: 'Network error' }); 
    } finally { 
      setIsSubmittingReview(false); 
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      const res = await fetch(`/api/reviews/${reviewId}`, { method: 'DELETE', credentials: 'include' });
      const b = await res.json().catch(() => ({}));
      if (!res.ok) { 
        addNotification({ id: Date.now(), text: b.message || 'Delete failed' }); 
        return; 
      }
      setUserReviews(prev => prev.filter(r => r._id !== reviewId));
      addNotification({ id: Date.now(), text: 'Review deleted successfully' });
    } catch (e) { 
      console.error(e); 
      addNotification({ id: Date.now(), text: 'Network error' }); 
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      transition={{ duration: 0.4 }} 
      className="min-h-screen p-6"
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Reviews & Feedback</h1>
          <p className="text-lg text-gray-600">Share your experience and view your submitted reviews</p>
        </motion.div>

        {/* Submit Review Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card-premium p-8 mb-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Share Your Experience</h2>
              <p className="text-sm text-gray-600">Your feedback helps us improve</p>
            </div>
          </div>

          {/* Star Rating */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">Rating</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map(n => (
                <motion.button
                  key={n}
                  onClick={() => setRating(n)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                    n <= rating 
                      ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 shadow-lg' 
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  <Star className={`w-6 h-6 ${n <= rating ? 'text-white fill-white' : 'text-gray-400'}`} />
                </motion.button>
              ))}
            </div>
            <div className="mt-2 text-sm text-gray-600">
              {rating === 5 ? 'Excellent!' : rating === 4 ? 'Great!' : rating === 3 ? 'Good' : rating === 2 ? 'Fair' : 'Poor'}
            </div>
          </div>

          {/* Comment */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">Comment (Optional)</label>
            <textarea
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              placeholder="Tell us about your experience..."
              rows={4}
              className="input-field resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              disabled={isSubmittingReview}
              onClick={handleSubmitReview}
              className="tea-button flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmittingReview ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Submitting...
                </div>
              ) : (
                'Submit Review'
              )}
            </button>
            <button
              onClick={() => { setRating(5); setReviewComment(''); }}
              className="secondary-button"
            >
              Clear
            </button>
          </div>
        </motion.div>

        {/* User Reviews List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Reviews</h2>
          
          {userReviews.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                <MessageSquare className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500 text-lg">You haven't submitted any reviews yet</p>
              <p className="text-sm text-gray-400 mt-1">Share your experience to help others!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {userReviews.map(review => (
                <motion.div
                  key={review._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gradient-to-r from-gray-50 to-white p-6 rounded-xl border border-gray-200 hover:border-tea-200 hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="font-bold text-gray-900 text-lg">
                          {review.name || user.name}
                        </div>
                        <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          review.approved 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {review.approved ? (
                            <>
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Approved
                            </>
                          ) : (
                            <>
                              <Clock className="w-3 h-3 mr-1" />
                              Pending
                            </>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex gap-1 mb-3">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < review.rating 
                                ? 'text-yellow-400 fill-yellow-400' 
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      
                      {review.comment && (
                        <p className="text-gray-700 leading-relaxed">
                          "{review.comment}"
                        </p>
                      )}
                    </div>
                    
                    <button
                      onClick={() => handleDeleteReview(review._id)}
                      className="ml-4 p-2 rounded-lg hover:bg-red-50 text-red-500 hover:text-red-700 transition-colors"
                      title="Delete review"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}

export default Reviews;

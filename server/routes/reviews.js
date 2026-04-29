const express = require('express');
const { body, validationResult } = require('express-validator');
const Review = require('../models/Review');
const AdminNotification = require('../models/AdminNotification');
const { auth, requireRole } = require('../middleware/auth');

const router = express.Router();

// POST /api/reviews -- authenticated users submit a review (requires name, rating)
router.post('/', auth, [
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be 1-5'),
  body('comment').optional().isString().trim().isLength({ max: 1000 })
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  try {
    const { rating, comment } = req.body;
    const review = new Review({ userId: req.user._id, name: req.user.name || 'Anonymous', rating, comment, approved: false });
    await review.save();
    // notify admins that a new review was submitted (admins filter client-side)
    try {
      const io = req.app.get('io');
      if (io) {
        io.to('admins').emit('admin:newReview', { id: review._id, userId: review.userId, name: review.name, rating: review.rating, comment: review.comment, createdAt: review.createdAt });
      }
      // persist admin notification for audit and UI
      try {
        const adminMsg = `New review submitted by ${review.name || review.userId}`;
        const an = await AdminNotification.create({ actorUserId: review.userId, actorName: review.name || '', action: 'review:submitted', message: adminMsg, details: { reviewId: review._id, rating: review.rating, comment: review.comment }, createdAt: review.createdAt });
        try { const io2 = req.app.get('io'); if (io2) io2.to('admins').emit('admin:notification', an); } catch (e) { /* ignore */ }
      } catch (e) { /* ignore */ }
    } catch (e) { /* ignore */ }

    return res.status(201).json({ message: 'Review submitted and pending approval', review });
  } catch (err) {
    console.error('Submit review error', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/reviews/approved?limit=5 -- public list of approved reviews
router.get('/approved', async (req, res) => {
  try {
    const limit = Math.min(50, parseInt(req.query.limit || '5', 10));
    const reviews = await Review.find({ approved: true }).sort({ createdAt: -1 }).limit(limit).lean();
    const agg = await Review.aggregate([
      { $match: { approved: true } },
      { $group: { _id: null, average: { $avg: '$rating' }, count: { $sum: 1 } } }
    ]);
    const summary = (agg && agg[0]) ? { average: Number(agg[0].average.toFixed(2)), count: agg[0].count } : { average: 0, count: 0 };
    return res.json({ reviews, summary });
  } catch (err) {
    console.error('Fetch approved reviews error', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Admin: GET /api/reviews -- list all reviews (admin only)
router.get('/', auth, requireRole('admin'), async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 }).lean();
    return res.json({ reviews });
  } catch (err) {
    console.error('Admin fetch reviews', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Admin: PATCH /api/reviews/:id/approve -- toggle approval
router.patch('/:id/approve', auth, requireRole('admin'), async (req, res) => {
  try {
    const id = req.params.id;
    const r = await Review.findById(id);
    if (!r) return res.status(404).json({ message: 'Review not found' });
    r.approved = !!req.body.approved;
    await r.save();
    return res.json({ message: 'Review updated', review: r });
  } catch (err) {
    console.error('Approve review error', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/reviews/:id -- admin can delete, or the review owner can delete their own review
router.delete('/:id', auth, async (req, res) => {
  try {
    const id = req.params.id;
    console.log('[reviews:delete] attempt', { userId: req.user?._id, role: req.user?.role, reviewId: id, ip: req.ip });
    const r = await Review.findById(id);
    if (!r) return res.status(404).json({ message: 'Review not found' });
    // allow if admin
    if (req.user.role === 'admin' || String(r.userId) === String(req.user._id)) {
      // Mongoose v7 removed Document.remove(); use deleteOne() instead
      if (typeof r.deleteOne === 'function') {
        await r.deleteOne();
      } else {
        await Review.deleteOne({ _id: r._id });
      }
      return res.json({ message: 'Review deleted' });
    }
    return res.status(403).json({ message: 'Forbidden' });
  } catch (err) {
    console.error('Delete review error', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/reviews/mine -- authenticated user's own reviews
router.get('/mine', auth, async (req, res) => {
  try {
    const reviews = await Review.find({ userId: req.user._id }).sort({ createdAt: -1 }).lean();
    return res.json({ reviews });
  } catch (err) {
    console.error('Fetch my reviews error', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

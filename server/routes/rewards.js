const express = require('express');
const mongoose = require('mongoose');
const { body, validationResult } = require('express-validator');

const User = require('../models/User');
const AdminConfig = require('../models/AdminConfig');
const WithdrawalRequest = require('../models/WithdrawalRequest');
const Transaction = require('../models/Transaction');
const { auth, requireRole } = require('../middleware/auth');

const router = express.Router();

// Awards model (single definition to avoid overwrite errors)
const AwardSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  distributionDate: { type: Date },
  winnerId: mongoose.Schema.Types.ObjectId,
  winnerName: String,
  winnerEmail: String,
  amount: Number,
  totalRevenue: Number,
  reference: String
});
const Awards = mongoose.models.Awards || mongoose.model('Awards', AwardSchema, 'awards');

// Admin: GET /api/admin/awards — list past awards (requires admin)
router.get('/admin/awards', auth, requireRole('admin'), async (req, res, next) => {
  try {
    // awards are recorded when the admin distributes the revenue pool to the top-ranked user
    const list = await Awards.find().sort({ date: -1 }).limit(100);
    return res.json({ awards: list });
  } catch (err) {
    return next(err);
  }
});

// Public: GET /api/rewards/awards — list past awards for all users
router.get('/awards', async (req, res, next) => {
  try {
    const list = await Awards.find().sort({ date: -1 }).limit(100);
    return res.json({ awards: list });
  } catch (err) {
    return next(err);
  }
});

// Admin: POST /api/admin/trigger-award — manually trigger award if milestone reached
router.post('/admin/trigger-award', auth, requireRole('admin'), async (req, res, next) => {
  try {
    const cfg = await AdminConfig.getSingleton();
    const cfgDoc = await AdminConfig.findById(cfg._id);
    console.log('Admin trigger-award attempted by:', req.user?.email, 'totalTeasSold=', cfgDoc.totalTeasSold, 'adminPoolMoney=', cfgDoc.adminPoolMoney, 'transferMilestoneTeas=', cfgDoc.transferMilestoneTeas);
    if (cfgDoc.totalTeasSold < cfgDoc.transferMilestoneTeas) return res.status(400).json({ message: 'Milestone not reached' });
    if (!cfgDoc.adminPoolMoney || cfgDoc.adminPoolMoney <= 0) return res.status(400).json({ message: 'No admin pool to transfer' });

    const amount = cfgDoc.adminPoolMoney;

    // Try to perform distribution in a transaction when supported.
    let awardRecord = null;
    let winner = null;
    let usedTransaction = false;
    const session = await mongoose.startSession();
    try {
      await session.withTransaction(async () => {
        // reload documents in transaction
        const cfgTx = await AdminConfig.findById(cfgDoc._id).session(session);
        if (!cfgTx) throw new Error('AdminConfig not found');
        if (cfgTx.totalTeasSold < cfgTx.transferMilestoneTeas) throw new Error('Milestone not reached in transaction');
        if (!cfgTx.adminPoolMoney || cfgTx.adminPoolMoney <= 0) throw new Error('No admin pool in transaction');

        // choose top-ranked user inside transaction
        winner = await User.findOne({ role: 'user' }).sort({ rankPosition: 1 }).session(session);
        if (!winner) throw new Error('No users available for award');

        // update winner: add claimableRewards and move to last
        const maxPosDoc = await User.findOne({ role: 'user' }).sort({ rankPosition: -1 }).session(session);
        const maxPos = maxPosDoc?.rankPosition || 0;
        // add the revenue pool amount directly to the winner's points balance (rank-based award)
        winner.points = (winner.points || 0) + cfgTx.adminPoolMoney;
        winner.rankPosition = maxPos + 1;
        await winner.save({ session });

        // create award record
        const awardArr = await Awards.create([{ date: new Date(), distributionDate: new Date(), winnerId: winner._id, winnerName: winner.name || '', winnerEmail: winner.email || '', amount: cfgTx.adminPoolMoney, totalRevenue: cfgTx.adminPoolMoney, reference: `manual:${Date.now()}` }], { session });
        awardRecord = awardArr?.[0];

        // reset admin pool and total teas sold and unlock for next cycle
        cfgTx.adminPoolMoney = 0;
        cfgTx.totalTeasSold = 0;
        cfgTx.salesLocked = false;
        cfgTx.updatedAt = new Date();
        await cfgTx.save({ session });

        // compact ranks
        const allUsers = await User.find({ role: 'user' }).sort({ rankPosition: 1 }).session(session);
        let pos = 1;
        for (const u of allUsers) {
          u.rankPosition = pos++;
          await u.save({ session });
        }
      });
      usedTransaction = true;
    } catch (txErr) {
      // transaction failed (likely because standalone Mongo doesn't support transactions)
      console.warn('Transaction failed or unsupported — falling back to non-transactional award:', txErr && txErr.message);
    } finally {
      try { await session.endSession(); } catch (e) { /* ignore */ }
    }

    // Fallback non-transactional flow when transactions are not available or failed
    if (!usedTransaction) {
      // double-check conditions
      const freshCfg = await AdminConfig.findById(cfgDoc._id);
      if (!freshCfg || freshCfg.totalTeasSold < freshCfg.transferMilestoneTeas || !freshCfg.adminPoolMoney) return res.status(400).json({ message: 'Milestone not ready or no pool' });

      // pick top-ranked user and perform updates sequentially
      winner = await User.findOne({ role: 'user' }).sort({ rankPosition: 1 });
      if (!winner) return res.status(400).json({ message: 'No users available for award' });

      // capture amount and update winner
      const transferAmount = freshCfg.adminPoolMoney;
      // add the revenue pool amount directly to the winner's points balance (rank-based award)
      winner.points = (winner.points || 0) + transferAmount;
      const maxPosDoc = await User.findOne({ role: 'user' }).sort({ rankPosition: -1 });
      const maxPos = maxPosDoc?.rankPosition || 0;
      winner.rankPosition = maxPos + 1;
      await winner.save();

      // create award record
      awardRecord = (await Awards.create([{ date: new Date(), distributionDate: new Date(), winnerId: winner._id, winnerName: winner.name || '', winnerEmail: winner.email || '', amount: transferAmount, totalRevenue: transferAmount, reference: `manual-fallback:${Date.now()}` }]))?.[0];

      // reset config
      freshCfg.adminPoolMoney = 0;
      freshCfg.totalTeasSold = 0;
      freshCfg.salesLocked = false;
      freshCfg.updatedAt = new Date();
      await freshCfg.save();

      // compact ranks
      const allUsers = await User.find({ role: 'user' }).sort({ rankPosition: 1 });
      let pos = 1;
      for (const u of allUsers) {
        u.rankPosition = pos++;
        await u.save();
      }
    }

    // emit events
    try {
      const io = req.app.get('io');
      if (io) {
        io.emit('reward:transferred', { winnerId: winner._id, amount, awardId: awardRecord?._id });
        io.emit('dashboard:update', { admin: { totalTeasSold: 0, adminPoolMoney: 0 } });
        try { io.to(String(winner._id)).emit('user:pointsUpdated', { points: winner.points, teasConsumed: winner.teasConsumed }); } catch (e) { /* ignore */ }
      }
    } catch (e) {
      console.error('Socket emit error after manual award', e);
    }

    return res.json({ message: 'Award processed', winnerId: winner._id, amount, awardId: awardRecord?._id, transactional: usedTransaction });
  } catch (err) {
    return next(err);
  }
});

// POST /api/rewards/purchase
router.post(
  '/purchase',
  auth,
  [body('teas').optional().isInt({ min: 1 }).toInt(), body('price').optional().isNumeric()],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const teas = req.body.teas || 1;
    const price = typeof req.body.price === 'number' ? req.body.price : undefined;

    try {
      const cfg = await AdminConfig.getSingleton();
      const cfgDoc = await AdminConfig.findById(cfg._id);
      const rewardPointsPerTea = cfgDoc.rewardPointsPerTea;
      const teaPrice = price || cfgDoc.teaPrice || 1;

      const user = await User.findById(req.user._id);
      if (!user) throw new Error('User not found');

      // enforce sales lock and milestone limits
      if (cfgDoc.salesLocked) return res.status(400).json({ message: 'Sales cycle locked — target reached. Wait for admin distribution.' });

      const remaining = Math.max(0, (cfgDoc.transferMilestoneTeas || 0) - (cfgDoc.totalTeasSold || 0));
      if (teas > remaining) {
        return res.status(400).json({ message: 'Purchase would exceed sales target', remaining });
      }

      const pointsToAdd = teas * rewardPointsPerTea;
      user.points += pointsToAdd;
      user.teasConsumed = (user.teasConsumed || 0) + teas;
      await user.save();

      cfgDoc.totalTeasSold += teas;
      cfgDoc.adminPoolMoney += teas * teaPrice;
      // if we hit the milestone exactly, lock sales — admin will manually distribute
      if (cfgDoc.totalTeasSold >= cfgDoc.transferMilestoneTeas) {
        cfgDoc.totalTeasSold = cfgDoc.transferMilestoneTeas;
        cfgDoc.salesLocked = true;
      }
      cfgDoc.updatedAt = new Date();
      await cfgDoc.save();

      let transferInfo = null;

      // emit real-time updates if socket available
      try {
        const io = req.app.get('io');
        if (io) {
          io.emit('dashboard:update', { user: { id: user._id, points: user.points, rankPosition: user.rankPosition }, admin: { totalTeasSold: cfgDoc.totalTeasSold, adminPoolMoney: cfgDoc.adminPoolMoney } });
          if (transferInfo) io.emit('reward:transferred', transferInfo);
        }
      } catch (e) {
        console.error('Socket emit error', e);
      }

      return res.json({ message: 'Purchase recorded', pointsAdded: pointsToAdd, transfer: transferInfo });
    } catch (err) {
      return next(err);
    }
  }
);

// Admin: add teas to a user (admin-only)
router.post('/admin/users/:id/add-teas', auth, requireRole('admin'), [
  // allow admin to pass positive (add) or negative (remove) teas
  body('teas').isInt().toInt(),
  body('price').optional().isNumeric()
], async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const { teas } = req.body;
  const price = typeof req.body.price === 'number' ? req.body.price : undefined;
  // validate id
  try {
    console.log('add-teas called for id=', req.params.id, 'teas=', teas);
    console.log('Request body:', req.body);
    const uid = req.params.id;
    if (!uid || !mongoose.Types.ObjectId.isValid(uid)) return res.status(400).json({ message: 'Invalid user id' });

    // Perform non-transactional update (safer for local dev standalone MongoDB)
    const cfg = await AdminConfig.getSingleton();
    const cfgDoc = await AdminConfig.findById(cfg._id);
    const rewardPointsPerTea = cfgDoc.rewardPointsPerTea;
    const teaPrice = price || cfgDoc.teaPrice || 1;

    // Allow admin updates while salesLocked, but prevent any increase that would exceed the milestone
    const remaining = Math.max(0, (cfgDoc.transferMilestoneTeas || 0) - (cfgDoc.totalTeasSold || 0));
    // If sales are locked (milestone reached), allow admin to update user counts
    // but do NOT modify the global totals/adminPoolMoney — the pool must reflect exactly the milestone sales.
    if (!cfgDoc.salesLocked && teas > 0 && teas > remaining) return res.status(400).json({ message: 'Adding these teas would exceed sales target', remaining });

    const userDoc = await User.findById(uid);
    if (!userDoc) return res.status(404).json({ message: 'User not found' });

    const pointsDelta = teas * rewardPointsPerTea;
    userDoc.teasConsumed = Math.max(0, (userDoc.teasConsumed || 0) + teas);
    userDoc.points = Math.max(0, (userDoc.points || 0) + pointsDelta);
    await userDoc.save();

    // Update global totals only when sales are not locked. When locked, admin edits affect only the user.
    if (!cfgDoc.salesLocked) {
      cfgDoc.totalTeasSold = Math.max(0, (cfgDoc.totalTeasSold || 0) + teas);
      cfgDoc.adminPoolMoney = Math.max(0, (cfgDoc.adminPoolMoney || 0) + (teas * teaPrice));
      // cap to milestone and set/retain salesLocked; do NOT automatically unlock when totals drop
      if (cfgDoc.totalTeasSold >= cfgDoc.transferMilestoneTeas) {
        cfgDoc.totalTeasSold = cfgDoc.transferMilestoneTeas;
        cfgDoc.salesLocked = true;
      }
    } else {
      // salesLocked: intentionally do not change cfgDoc.totalTeasSold or adminPoolMoney
    }
    cfgDoc.updatedAt = new Date();
    await cfgDoc.save();

    const updatedUser = userDoc;
    const updatedCfg = cfgDoc;

    // emit update to clients
    try {
      const io = req.app.get('io');
      if (io) {
        const u = updatedUser;
        const c = updatedCfg;
        io.emit('dashboard:update', { user: { id: u._id, points: u.points, rankPosition: u.rankPosition }, admin: { totalTeasSold: c.totalTeasSold, adminPoolMoney: c.adminPoolMoney } });
        // optional: emit to user-specific room if joined
        try { io.to(String(u._id)).emit('user:pointsUpdated', { points: u.points, teasConsumed: u.teasConsumed }); } catch (e) { /* ignore */ }
      }
    } catch (e) {
      console.error('Socket emit error', e);
    }

    return res.json({ message: 'User updated', pointsDelta, teasDelta: teas, totalsUnchanged: !!cfgDoc.salesLocked });
  } catch (err) {
    console.error('Add-teas error', err && err.stack ? err.stack : err);
    if (process.env.NODE_ENV === 'production') {
      return res.status(500).json({ error: 'Internal server error' });
    }
    return res.status(500).json({ error: err.message, stack: err.stack });
  }
});

// POST /api/rewards/claim
router.post('/claim', auth, async (req, res, next) => {
  try {
    const cfg = await AdminConfig.getSingleton();
    const cfgDoc = await AdminConfig.findById(cfg._id);
    const user = await User.findById(req.user._id);
    if (!user) throw new Error('User not found');
    if (user.points < cfgDoc.claimThresholdPoints) return res.status(400).json({ message: 'Point threshold not reached' });

    // Determine withdraw amount: prefer explicit claimableRewards (admin-awarded),
    // otherwise convert user's points to equivalent currency using config.
    let amount = user.claimableRewards || 0;
    if (!amount || amount <= 0) {
      const pts = user.points || 0;
      const pointsPerTea = cfgDoc.rewardPointsPerTea || 1;
      const teaPrice = cfgDoc.teaPrice || 1;
      // convert points -> teas -> currency
      const teasEquivalent = Math.floor(pts / pointsPerTea);
      amount = teasEquivalent * teaPrice;
    }
    if (!amount || amount <= 0) return res.status(400).json({ message: 'No claimable rewards' });

    // reset claimable rewards and also clear points and teas as requested
    user.claimableRewards = 0;
    user.points = 0;
    user.teasConsumed = 0;
    await user.save();

    const io = req.app.get('io');
    if (io) {
      try {
        io.emit('user:claimed', { userId: user._id, amount });
        // notify dashboard and user-specific listeners about updated points/teas
        io.emit('dashboard:update', { user: { id: user._id, points: user.points, teasConsumed: user.teasConsumed } });
        try { io.to(String(user._id)).emit('user:pointsUpdated', { points: user.points, teasConsumed: user.teasConsumed }); } catch (e) { /* ignore */ }
      } catch (e) {
        console.error('Socket emit error after claim', e);
      }
    }

    return res.json({ message: 'Claim successful', amount, points: user.points, teasConsumed: user.teasConsumed });
  } catch (err) {
    return next(err);
  }
});

// Admin: GET /api/rewards/config
router.get('/admin/config', auth, requireRole('admin'), async (req, res, next) => {
  try {
    const cfg = await AdminConfig.getSingleton();
    return res.json({ config: cfg });
  } catch (err) {
    return next(err);
  }
});

// Admin: POST /api/rewards/config — update config
router.post('/admin/config', auth, requireRole('admin'), async (req, res, next) => {
  try {
    const cfg = await AdminConfig.getSingleton();
    Object.assign(cfg, req.body, { updatedAt: new Date() });
    await cfg.save();
    const io = req.app.get('io');
    if (io) io.emit('admin:configUpdated', cfg);
    return res.json({ message: 'Config updated', config: cfg });
  } catch (err) {
    return next(err);
  }
});

// Public: GET rankings
router.get('/rankings', async (req, res, next) => {
  try {
    // exclude admins from the public rankings
    const users = await User.find({ role: 'user' }).sort({ rankPosition: 1 }).select('name email points claimableRewards rankPosition teasConsumed profileImage');
    // normalize shape for client: include `id` and `avatar` fields
    const rankings = users.map(u => ({
      id: u._id,
      name: u.name,
      email: u.email,
      points: u.points || 0,
      claimableRewards: u.claimableRewards || 0,
      rankPosition: u.rankPosition,
      teasConsumed: u.teasConsumed || 0,
      avatar: u.profileImage || null
    }));
    return res.json({ rankings });
  } catch (err) {
    return next(err);
  }
});

// Dashboard
router.get('/dashboard', auth, async (req, res, next) => {
  try {
    const cfg = await AdminConfig.getSingleton();
    // exclude admins from dashboard top list
    const topUsers = await User.find({ role: 'user' }).sort({ rankPosition: 1 }).limit(10).select('name points rankPosition claimableRewards profileImage');
    const totalUsers = await User.countDocuments({ role: 'user' });
    // include awards issued count for admin KPIs
    const awardsCount = await Awards.countDocuments();
    const top = topUsers.map(u => ({
      id: u._id,
      name: u.name,
      points: u.points || 0,
      rankPosition: u.rankPosition,
      claimableRewards: u.claimableRewards || 0,
      avatar: u.profileImage || null
    }));
    return res.json({ admin: { ...cfg.toObject(), totalUsers, rewardsIssued: awardsCount }, top });
  } catch (err) {
    return next(err);
  }
});

// User: POST /api/rewards/withdrawals/request — create a withdrawal request (points remain unchanged)
router.post('/withdrawals/request', auth, [ body('points').isInt({ min: 1 }).toInt() ], async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  try {
    const points = req.body.points;
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Require user to currently have at least the requested points to create a request
    if ((user.points || 0) < points) return res.status(400).json({ message: 'Insufficient points to request withdrawal' });

    // Prevent multiple concurrent requests: if user already has a pending or accepted request, block new requests
    const existing = await WithdrawalRequest.findOne({ userId: user._id, status: { $in: ['pending', 'accepted'] } });
    if (existing) return res.status(400).json({ message: 'You already have an open withdrawal request. Wait until it is processed.' });

    const reqDoc = await WithdrawalRequest.create({ userId: user._id, userName: user.name || user.email || '', requestedPoints: points, status: 'pending', requestedAt: new Date(), reference: `req:${Date.now()}` });

    try { const io = req.app.get('io'); if (io) io.emit('withdrawal:created', { id: reqDoc._id, userId: user._id, requestedPoints: points }); } catch (e) { /* ignore */ }

    return res.json({ message: 'Withdrawal request created', request: reqDoc });
  } catch (err) {
    return next(err);
  }
});

// User: GET /api/rewards/withdrawals — list current user's withdrawal requests
router.get('/withdrawals', auth, async (req, res, next) => {
  try {
    const list = await WithdrawalRequest.find({ userId: req.user._id }).sort({ requestedAt: -1 }).limit(100);
    return res.json({ withdrawals: list });
  } catch (err) {
    return next(err);
  }
});

// Admin: GET /api/admin/withdrawals — list withdrawal requests
router.get('/admin/withdrawals', auth, requireRole('admin'), async (req, res, next) => {
  try {
    const list = await WithdrawalRequest.find().sort({ requestedAt: -1 }).limit(200);
    return res.json({ withdrawals: list });
  } catch (err) {
    return next(err);
  }
});

// Admin: POST /api/admin/withdrawals/:id/accept — mark request as accepted (no confirmation yet)
router.post('/admin/withdrawals/:id/accept', auth, requireRole('admin'), async (req, res, next) => {
  try {
    const id = req.params.id;
    console.log('ADMIN ACCEPT called:', { id, by: req.user && (req.user.email || req.user._id) });
    if (!id || !mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid request id' });
    const reqDoc = await WithdrawalRequest.findById(id);
    console.log('Found withdrawal request:', !!reqDoc, reqDoc && { status: reqDoc.status, userId: String(reqDoc.userId) });
    if (!reqDoc) return res.status(404).json({ message: 'Withdrawal request not found' });
    if (reqDoc.status !== 'pending') return res.status(400).json({ message: 'Withdrawal request is not pending' });

    reqDoc.status = 'accepted';
    reqDoc.acceptedAt = new Date();
    reqDoc.acceptedBy = req.user._id;
    await reqDoc.save();
    console.log('Withdrawal request accepted and saved:', reqDoc._id);

    try { const io = req.app.get('io'); if (io) io.emit('withdrawal:accepted', { id: reqDoc._id, userId: reqDoc.userId }); } catch (e) { /* ignore */ }

    return res.json({ message: 'Withdrawal request accepted (pending confirmation)', request: reqDoc });
  } catch (err) {
    return next(err);
  }
});

// Admin: POST /api/admin/withdrawals/:id/confirm — confirm and finalize the withdrawal (deduct points)
router.post('/admin/withdrawals/:id/confirm', auth, requireRole('admin'), async (req, res, next) => {
  try {
    const id = req.params.id;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid request id' });
    const reqDoc = await WithdrawalRequest.findById(id);
    if (!reqDoc) return res.status(404).json({ message: 'Withdrawal request not found' });
    if (reqDoc.status !== 'accepted') return res.status(400).json({ message: 'Withdrawal must be accepted before confirmation' });

    const points = reqDoc.requestedPoints;

    // Try transaction when supported
    let usedTransaction = false;
    const session = await mongoose.startSession();
    try {
      await session.withTransaction(async () => {
        const reqTx = await WithdrawalRequest.findById(id).session(session);
        if (!reqTx) throw new Error('Withdrawal request disappeared');
        if (reqTx.status !== 'accepted') throw new Error('Withdrawal not in accepted state in transaction');

        const user = await User.findById(reqTx.userId).session(session);
        if (!user) throw new Error('User not found');
        if ((user.points || 0) < points) throw new Error('User no longer has sufficient points');

        user.points = (user.points || 0) - points;
        await user.save({ session });

        reqTx.status = 'confirmed';
        reqTx.confirmedAt = new Date();
        reqTx.confirmedBy = req.user._id;
        await reqTx.save({ session });

        await Transaction.create([{ userId: user._id, userName: user.name || user.email || '', type: 'withdrawal', points: points, reference: `withdraw:${reqTx._id}` }], { session });
      });
      usedTransaction = true;
    } catch (txErr) {
      console.warn('Withdrawal confirm transaction failed — falling back to non-transactional path', txErr && txErr.message);
    } finally {
      try { await session.endSession(); } catch (e) { /* ignore */ }
    }

    if (!usedTransaction) {
      // Non-transactional fallback: re-check and apply sequentially
      const freshReq = await WithdrawalRequest.findById(id);
      if (!freshReq || freshReq.status !== 'accepted') return res.status(400).json({ message: 'Withdrawal not available for confirmation' });
      const user = await User.findById(freshReq.userId);
      if (!user) return res.status(404).json({ message: 'User not found' });
      if ((user.points || 0) < points) return res.status(400).json({ message: 'User no longer has sufficient points' });

      user.points = (user.points || 0) - points;
      await user.save();

      freshReq.status = 'confirmed';
      freshReq.confirmedAt = new Date();
      freshReq.confirmedBy = req.user._id;
      await freshReq.save();

      await Transaction.create({ userId: user._id, userName: user.name || user.email || '', type: 'withdrawal', points: points, reference: `withdraw:${freshReq._id}` });
    }

    // Emit events and return
    try {
      const io = req.app.get('io');
      if (io) {
        io.emit('withdrawal:confirmed', { id: id, userId: reqDoc.userId, points });
        const userNow = await User.findById(reqDoc.userId);
        io.emit('dashboard:update', { user: { id: userNow._id, points: userNow.points } });
        try { io.to(String(userNow._id)).emit('user:pointsUpdated', { points: userNow.points }); } catch (e) { /* ignore */ }
      }
    } catch (e) { console.error('Socket emit error after withdrawal confirm', e); }

    return res.json({ message: 'Withdrawal confirmed and processed', requestId: id });
  } catch (err) {
    return next(err);
  }
});

// Admin: POST /api/rewards/admin/withdrawals/:id/paid — mark confirmed withdrawal as paid
router.post('/admin/withdrawals/:id/paid', auth, requireRole('admin'), async (req, res, next) => {
  try {
    const id = req.params.id;
    console.log('ADMIN PAID called:', { id, by: req.user && (req.user.email || req.user._id) });
    if (!id || !mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid request id' });
    const reqDoc = await WithdrawalRequest.findById(id);
    console.log('Found withdrawal request for paid:', !!reqDoc, reqDoc && { status: reqDoc.status, userId: String(reqDoc.userId) });
    if (!reqDoc) return res.status(404).json({ message: 'Withdrawal request not found' });
    if (reqDoc.status !== 'confirmed') return res.status(400).json({ message: 'Only confirmed withdrawals can be marked as paid' });

    reqDoc.status = 'paid';
    reqDoc.paidAt = new Date();
    reqDoc.paidBy = req.user._id;
    await reqDoc.save();

    try {
      const io = req.app.get('io');
      if (io) {
        io.emit('withdrawal:paid', { id: reqDoc._id, userId: reqDoc.userId });
      }
    } catch (e) { console.error('Socket emit error after withdrawal paid', e); }

    return res.json({ message: 'Withdrawal marked as paid', request: reqDoc });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;

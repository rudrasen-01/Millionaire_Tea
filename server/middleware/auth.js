const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    const token = req.cookies?.token;
    if (!token) {
      console.log('[auth] missing token — cookies present:', Object.keys(req.cookies || {}));
      return res.status(401).json({ message: 'Not authenticated' });
    }
    let payload;
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret');
    } catch (err) {
      console.log('[auth] token verify failed:', err && err.message);
      return res.status(401).json({ message: 'Not authenticated' });
    }
    const user = await User.findById(payload.id).select('-password');
    if (!user) {
      console.log('[auth] token valid but user not found:', payload && payload.id);
      return res.status(401).json({ message: 'Not authenticated' });
    }
    req.user = user;
    // Only log successful authentication when DEBUG_AUTH environment flag is enabled
    if (process.env.DEBUG_AUTH === 'true') {
      console.log(`[auth] authenticated user ${user._id} role=${user.role}`);
    }
    next();
  } catch (err) {
    console.log('[auth] unexpected error', err && err.message);
    return res.status(401).json({ message: 'Not authenticated' });
  }
};

const requireRole = (role) => (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: 'Not authenticated' });
  if (req.user.role !== role) return res.status(403).json({ message: 'Forbidden' });
  next();
};

module.exports = { auth, requireRole };

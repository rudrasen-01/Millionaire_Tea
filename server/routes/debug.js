const express = require('express');
const { auth } = require('../middleware/auth');

const router = express.Router();

// TEMP: debug endpoint to show server-side authenticated user info
router.get('/whoami', auth, (req, res) => {
  try {
    const user = req.user;
    return res.json({ id: user._id, role: user.role, email: user.email, name: user.name });
  } catch (e) {
    return res.status(500).json({ message: 'Debug error' });
  }
});

module.exports = router;

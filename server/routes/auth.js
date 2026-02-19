const express = require('express');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { upload, uploadToCloudinary } = require("../middleware/cloudinaryUpload");
const cloudinary = require("../config/cloudinary");
const fs = require('fs');

const User = require('../models/User');
const { auth, requireRole } = require('../middleware/auth');

const router = express.Router();

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000
};


// ================= REGISTER =================
router.post(
  '/register',
  upload.single("image"),
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  ],
  async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    // Require profile image upload
    if (!req.file) {
      return res.status(400).json({ message: 'Profile image is required', errors: [{ msg: 'Profile image is required', param: 'image' }] });
    }

    const { name, email, password } = req.body;

    try {
      const existing = await User.findOne({ email });
      if (existing)
        return res.status(409).json({ message: 'Email already registered' });

      const hash = await bcrypt.hash(password, 10);

      const role =
        process.env.ADMIN_EMAIL === email ? 'admin' : 'user';

      const userData = {
        name,
        email,
        password: hash,
        role,
        profileImage: null,
        profileImageId: null,
        points: 0
      };

      // If a file was uploaded, push it to Cloudinary and set the URL/id
      if (req.file) {
        try {
          const result = await uploadToCloudinary(req.file.path);
          userData.profileImage = result.secure_url;
          userData.profileImageId = result.public_id;
        } catch (e) {
          console.error('Cloudinary upload failed:', e);
          // continue without profile image
        } finally {
          // remove temporary local file if present
          try { fs.unlinkSync(req.file.path); } catch (e) { /* ignore */ }
        }
      }

      // Ranking only for normal users
      if (role === 'user') {
        const maxUser = await User.findOne({ role: 'user' })
          .sort({ rankPosition: -1 })
          .select('rankPosition');

        userData.rankPosition = (maxUser?.rankPosition || 0) + 1;
      }

      const user = await User.create(userData);

      const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.cookie('token', token, cookieOptions);

      return res.status(201).json({
        message: 'Registration successful',
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          rankPosition: user.rankPosition,
          profileImage: user.profileImage,
          points: user.points
        }
      });

    } catch (err) {
      console.error('Register error:', err);
      return res.status(500).json({ message: 'Server error' });
    }
  }
);


// ================= LOGIN =================
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
    body('password').notEmpty().withMessage('Password is required')
  ],
  async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });
      if (!user)
        return res.status(401).json({ message: 'Invalid credentials' });

      const match = await bcrypt.compare(password, user.password);
      if (!match)
        return res.status(401).json({ message: 'Invalid credentials' });

      const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.cookie('token', token, cookieOptions);

      return res.json({
        message: 'Login successful',
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          rankPosition: user.rankPosition,
          points: user.points,
          teasConsumed: user.teasConsumed || 0,
          profileImage: user.profileImage
        }
      });

    } catch (err) {
      console.error('Login error:', err);
      return res.status(500).json({ message: 'Server error' });
    }
  }
);


// ================= CURRENT USER =================
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user)
      return res.status(401).json({ message: 'Not authenticated' });

    return res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        rankPosition: user.rankPosition,
        points: user.points || 0,
        teasConsumed: user.teasConsumed || 0,
        profileImage: user.profileImage,
        avatar: user.profileImage || null,
        createdAt: user.createdAt
      }
    });

  } catch (err) {
    return res.status(401).json({ message: 'Not authenticated' });
  }
});


// ================= LOGOUT =================
router.post('/logout', (req, res) => {
  res.clearCookie('token');
  return res.json({ message: 'Logged out successfully' });
});


// ================= PROMOTE TO ADMIN =================
router.post(
  '/promote',
  auth,
  requireRole('admin'),
  [body('email').isEmail().withMessage('Valid email required').normalizeEmail()],
  async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    try {
      const user = await User.findOne({ email: req.body.email });
      if (!user)
        return res.status(404).json({ message: 'User not found' });

      user.role = 'admin';
      user.rankPosition = null;
      await user.save();

      // Recalculate ranks
      const users = await User.find({ role: 'user' }).sort({ rankPosition: 1 });
      let pos = 1;
      for (const u of users) {
        u.rankPosition = pos++;
        await u.save();
      }

      return res.json({ message: 'User promoted to admin' });

    } catch (err) {
      console.error('Promote error:', err);
      return res.status(500).json({ message: 'Server error' });
    }
  }
);


// ================= UPDATE PROFILE =================
router.put(
  '/update-profile',
  auth,
  upload.single("image"),
  [
    body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
    body('email').optional().isEmail().withMessage('Valid email is required').normalizeEmail(),
    body('phone').optional().trim(),
    body('address').optional().trim(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    try {
      const user = await User.findById(req.user.id);
      if (!user)
        return res.status(404).json({ message: 'User not found' });

      const { name, email, phone, address } = req.body;

      // Update fields if provided
      if (name !== undefined) user.name = name;
      if (phone !== undefined) user.phone = phone;
      if (address !== undefined) user.address = address;

      // Check email uniqueness if changing
      if (email !== undefined && email !== user.email) {
        const existingUser = await User.findOne({ email });
        if (existingUser)
          return res.status(409).json({ message: 'Email already in use' });
        user.email = email;
      }

      // Handle profile image upload
      if (req.file) {
        try {
          // Delete old image if exists
          if (user.profileImageId) {
            try {
              await cloudinary.uploader.destroy(user.profileImageId);
            } catch (e) {
              console.error('Failed to delete old image:', e);
            }
          }

          // Upload new image
          const result = await uploadToCloudinary(req.file.path);
          user.profileImage = result.secure_url;
          user.profileImageId = result.public_id;

          // Clean up temp file
          try { fs.unlinkSync(req.file.path); } catch (e) { /* ignore */ }
        } catch (e) {
          console.error('Cloudinary upload failed:', e);
          return res.status(500).json({ message: 'Failed to upload profile image' });
        }
      }

      await user.save();

      return res.json({
        message: 'Profile updated successfully',
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          address: user.address,
          role: user.role,
          points: user.points,
          profileImage: user.profileImage,
          rank: user.rankPosition,
          rankPosition: user.rankPosition,
          claimableRewards: user.claimableRewards,
          createdAt: user.createdAt
        }
      });

    } catch (err) {
      console.error('Update profile error:', err);
      return res.status(500).json({ message: 'Server error' });
    }
  }
);

module.exports = router;

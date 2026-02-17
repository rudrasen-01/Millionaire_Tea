require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const mongoose = require('mongoose');
const http = require('http');
const { Server } = require('socket.io');

const authRoutes = require('./routes/auth');
const rewardsRoutes = require('./routes/rewards');
const reviewsRoutes = require('./routes/reviews');
const debugRoutes = require('./routes/debug');
const User = require('./models/User');
const bcrypt = require('bcryptjs');
const AdminConfig = require('./models/AdminConfig');
const requestLogger = require('./middleware/requestLogger');

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5001;

app.use(helmet());
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(cookieParser());
app.use(express.json());

// dev request logger for specific endpoints
app.use(requestLogger);

// routes
app.use('/api/auth', authRoutes);
app.use('/api/rewards', rewardsRoutes);
app.use('/api/reviews', reviewsRoutes);
app.use('/api/debug', debugRoutes);

// global error handler
// specific handler for Multer (file upload) errors so clients get clear responses
app.use((err, req, res, next) => {
  if (!err) return next();
  // multer v2 sets code 'LIMIT_FILE_SIZE' for file too large
  if (err.code === 'LIMIT_FILE_SIZE' || (err.name && err.name === 'MulterError')) {
    const msg = err.code === 'LIMIT_FILE_SIZE' ? 'File too large. Max size is 2MB.' : (err.message || 'File upload error');
    return res.status(413).json({ message: msg });
  }
  return next(err);
});

app.use((err, req, res, next) => {
  console.error('GLOBAL ERROR:', err && err.stack ? err.stack : err);
  if (process.env.NODE_ENV === 'production') {
    res.status(500).json({ message: 'Internal server error' });
  } else {
    res.status(500).json({ message: err.message || 'Internal server error', stack: err.stack });
  }
});

async function start() {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/tea-rewards';
    await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB');
    // Seed admin user if ADMIN_EMAIL and ADMIN_PASSWORD provided
    try {
      const adminEmail = process.env.ADMIN_EMAIL;
      const adminPassword = process.env.ADMIN_PASSWORD;
      if (adminEmail && adminPassword) {
        let adminUser = await User.findOne({ email: adminEmail });
        if (!adminUser) {
          const salt = await bcrypt.genSalt(10);
          const hash = await bcrypt.hash(adminPassword, salt);
          // Do not assign a rankPosition to seeded admin so they are excluded from user rankings
          adminUser = new User({ name: 'Admin', email: adminEmail, password: hash, role: 'admin', rankPosition: null });
          await adminUser.save();
          console.log('Seeded admin user:', adminEmail);
        }
      }
    } catch (e) {
      console.error('Admin seed error', e);
    }
    // Ensure admin config defaults are reasonable for dev (set teaPrice to 10 if unset)
    try {
      const cfg = await AdminConfig.getSingleton();
      const oldPrice = cfg.teaPrice || 0;
      if (oldPrice !== 10) {
        // If adminPoolMoney appears to be calculated using the old price (totalTeasSold * oldPrice),
        // update adminPoolMoney to match new price. Otherwise leave adminPoolMoney unchanged.
        const expectedOldPool = (cfg.totalTeasSold || 0) * oldPrice;
        cfg.teaPrice = 10;
        const expectedNewPool = (cfg.totalTeasSold || 0) * cfg.teaPrice;
        if (cfg.adminPoolMoney === expectedOldPool) {
          cfg.adminPoolMoney = expectedNewPool;
          console.log('AdminConfig: updated teaPrice to 10 and adjusted adminPoolMoney');
        } else {
          console.log('AdminConfig: set teaPrice to 10 (adminPoolMoney left unchanged)');
        }
        await cfg.save();
      }
    } catch (e) {
      console.error('AdminConfig init error', e);
    }
    // start socket.io
    const io = new Server(server, { cors: { origin: 'http://localhost:5173', methods: ['GET','POST'], credentials: true } });
    app.set('io', io);
    io.on('connection', (socket) => {
      console.log('Socket connected', socket.id);
      socket.on('disconnect', () => console.log('Socket disconnected', socket.id));
    });

    server.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
  } catch (err) {
    console.error('Failed to start server', err);
    process.exit(1);
  }
}

start();

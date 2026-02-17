const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  userName: { type: String },
  type: { type: String, enum: ['withdrawal', 'award', 'other'], default: 'withdrawal' },
  points: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
  reference: { type: String }
});

module.exports = mongoose.models.Transaction || mongoose.model('Transaction', TransactionSchema, 'transactions');

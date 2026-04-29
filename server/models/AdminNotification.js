const mongoose = require('mongoose');

const AdminNotificationSchema = new mongoose.Schema({
  actorUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  actorName: { type: String },
  action: { type: String },
  message: { type: String, required: true },
  details: { type: Object, default: {} },
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.models.AdminNotification || mongoose.model('AdminNotification', AdminNotificationSchema, 'admin_notifications');

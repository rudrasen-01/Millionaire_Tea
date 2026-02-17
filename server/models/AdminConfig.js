const mongoose = require('mongoose');

const AdminConfigSchema = new mongoose.Schema({
  rewardPointsPerTea: { type: Number, default: 10 },
  claimThresholdPoints: { type: Number, default: 50000 },
  transferMilestoneTeas: { type: Number, default: 5000 },
  totalTeasSold: { type: Number, default: 0 },
  adminPoolMoney: { type: Number, default: 0 },
  teaPrice: { type: Number, default: 1 },
  salesLocked: { type: Boolean, default: false },
  updatedAt: { type: Date, default: Date.now }
});

AdminConfigSchema.statics.getSingleton = async function () {
  let cfg = await this.findOne();
  if (!cfg) {
    cfg = await this.create({});
  }
  return cfg;
};

module.exports = mongoose.model('AdminConfig', AdminConfigSchema);

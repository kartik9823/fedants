const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  competitionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Competition', required: true },
  registeredAt: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ['ACTIVE', 'CANCELLED'],
    default: 'ACTIVE',
  },
  paymentId: { type: String }, // Razorpay ID (future use)
  submissionUrl: { type: String },
  submissionName: { type: String },
  submittedAt: { type: Date },
}, { timestamps: true });

// CRITICAL: Unique compound index — prevents duplicate registration
// This is enforced at the DB level (not just the service layer)
registrationSchema.index(
  { userId: 1, competitionId: 1 },
  { unique: true }
);

module.exports = mongoose.model('Registration', registrationSchema);

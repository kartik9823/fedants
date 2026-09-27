const mongoose = require('mongoose');

const rewardSchema = new mongoose.Schema({
  position: { type: Number, required: true }, // 1, 2, 3...
  label: { type: String, required: true }, // '1st Winner'
  amount: { type: Number, required: true }, // 550
  icon: { type: String }, // emoji or url
}, { _id: false });

const judgeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  title: { type: String },
  experience: { type: String },
  photoUrl: { type: String },
  introVideoUrl: { type: String },
}, { _id: false });

const competitionSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  imageUrl: { type: String },
  category: { type: String, required: true }, // 'Dance'
  type: { type: String }, // 'Multi-Win'
  entryFee: { type: Number, required: true, min: 0 },
  prizePool: { type: Number, required: true, min: 0 },
  maxParticipants: { type: Number, required: true, min: 1 },
  currentParticipants: { type: Number, default: 0, min: 0 },
  registrationStart: { type: Date, required: true },
  registrationEnd: { type: Date, required: true },
  competitionStart: { type: Date, required: true },
  competitionEnd: { type: Date, required: true },
  resultDate: { type: Date },
  status: {
    type: String,
    enum: ['UPCOMING', 'REGISTRATION_OPEN', 'SUBMISSION_OPEN', 'JUDGING', 'COMPLETED', 'CANCELLED'],
    default: 'UPCOMING',
  },
  judge: judgeSchema,
  rewards: [rewardSchema],
  winners: [mongoose.Schema.Types.Mixed],
  winnersGetCertificate: { type: Boolean, default: false },
  refundPolicy: { type: String },
  rulesAndEligibility: { type: String },
  judgeParameters: { type: String },
}, { timestamps: true });

// Index for listing active competitions efficiently
competitionSchema.index({ status: 1, registrationEnd: 1 });

module.exports = mongoose.model('Competition', competitionSchema);

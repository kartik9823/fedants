const Competition = require('../models/Competition');
const Registration = require('../models/Registration');

exports.register = async (competitionId, userId) => {
  const now = new Date();

  // 1. ATOMIC Capacity + Window Check
  // This is the key to concurrency safety.
  // findOneAndUpdate only succeeds if BOTH conditions pass simultaneously.
  // Two parallel requests at 19/20 — only one will get the updated doc;
  // the other gets null and hits the 409 below.
  const updated = await Competition.findOneAndUpdate(
    {
      _id: competitionId,
      $expr: { $lt: ['$currentParticipants', '$maxParticipants'] }, // capacity check
      registrationStart: { $lte: now }, // window open
      registrationEnd: { $gt: now }, // window not closed
      status: { $in: ['REGISTRATION_OPEN', 'UPCOMING'] },
    },
    { $inc: { currentParticipants: 1 } },
    { new: true }
  );

  if (!updated) {
    // Determine why the atomic update failed for a helpful error
    const comp = await Competition.findById(competitionId);
    if (!comp) throwErr(404, 'NOT_FOUND', 'Competition not found.');
    if (now < new Date(comp.registrationStart))
      throwErr(400, 'NOT_OPEN', 'Registration has not started yet.');
    if (now > new Date(comp.registrationEnd))
      throwErr(400, 'CLOSED', 'Registration period has closed.');
    if (comp.currentParticipants >= comp.maxParticipants)
      throwErr(409, 'FULL', 'Competition is full.');
    throwErr(400, 'UNAVAILABLE', 'Registration is currently unavailable.');
  }

  // 2. Duplicate Registration Check
  const existing = await Registration.findOne({
    userId,
    competitionId,
  });

  if (existing && existing.status === 'ACTIVE') {
    // Rollback the $inc since we're not creating a registration
    await Competition.findByIdAndUpdate(competitionId, {
      $inc: { currentParticipants: -1 },
    });
    throwErr(409, 'DUPLICATE_REGISTRATION', 'You are already registered for this competition.');
  }

  // 3. Create or Reactivate Registration Record
  let registration;
  try {
    if (existing) {
      existing.status = 'ACTIVE';
      existing.registeredAt = new Date();
      registration = await existing.save();
    } else {
      registration = await Registration.create({
        userId,
        competitionId,
        status: 'ACTIVE',
      });
    }
  } catch (err) {
    // If DB compound unique index violation happens concurrently
    await Competition.findByIdAndUpdate(competitionId, {
      $inc: { currentParticipants: -1 },
    });
    if (err.code === 11000) {
      throwErr(409, 'DUPLICATE_REGISTRATION', 'You are already registered for this competition.');
    }
    throw err;
  }

  return {
    success: true,
    message: 'Registration successful!',
    registration: { id: registration._id, registeredAt: registration.registeredAt },
    spotsRemaining: updated.maxParticipants - updated.currentParticipants,
  };
};

exports.unregister = async (competitionId, userId) => {
  const existing = await Registration.findOne({
    userId,
    competitionId,
    status: 'ACTIVE',
  });

  if (!existing) {
    throwErr(404, 'NOT_REGISTERED', 'No active registration found to cancel.');
  }

  // Mark registration as CANCELLED (or remove)
  await Registration.findByIdAndUpdate(existing._id, { status: 'CANCELLED' });

  // Decrement currentParticipants count
  await Competition.findByIdAndUpdate(competitionId, {
    $inc: { currentParticipants: -1 },
  });

  return {
    success: true,
    message: 'Registration cancelled successfully.',
  };
};

exports.submitEntry = async (competitionId, userId, { submissionUrl, submissionName }) => {
  const existing = await Registration.findOne({
    userId,
    competitionId,
    status: 'ACTIVE',
  });

  if (!existing) {
    throwErr(404, 'NOT_REGISTERED', 'You must be registered to submit an entry.');
  }

  existing.submissionUrl = submissionUrl || 'kathak_dance_performance.mp4';
  existing.submissionName = submissionName || 'Kathak Classical Performance';
  existing.submittedAt = new Date();

  await existing.save();

  return {
    success: true,
    message: 'Submission uploaded successfully! 🎉',
    submission: {
      submissionUrl: existing.submissionUrl,
      submissionName: existing.submissionName,
      submittedAt: existing.submittedAt,
    },
  };
};

function throwErr(statusCode, code, message) {
  const err = new Error(message);
  err.statusCode = statusCode;
  err.code = code;
  throw err;
}

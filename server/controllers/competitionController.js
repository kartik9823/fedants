const Competition = require('../models/Competition');
const Registration = require('../models/Registration');
const registrationSvc = require('../services/registrationService');

// GET /api/competitions/:id
exports.getCompetition = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.headers['x-user-id'] || process.env.DEMO_USER_ID || 'user_001';

    const competition = await Competition.findById(id).lean();

    if (!competition) {
      return res.status(404).json({
        success: false,
        error: 'NOT_FOUND',
        message: 'Competition not found.',
      });
    }

    // Determine user state
    const existing = await Registration.findOne({
      userId,
      competitionId: id,
      status: 'ACTIVE',
    });

    const userState = existing ? 'REGISTERED' : 'NOT_REGISTERED';
    const submission = existing && existing.submittedAt ? {
      submissionUrl: existing.submissionUrl,
      submissionName: existing.submissionName,
      submittedAt: existing.submittedAt,
    } : null;

    // Compute derived state for frontend convenience
    const now = new Date();
    const computedState = computeCompetitionState(competition, now);

    res.json({
      success: true,
      competition: { ...competition, computedState },
      userState,
      submission,
    });
  } catch (err) {
    next(err);
  }
};

// Derive current lifecycle state from timestamps
function computeCompetitionState(comp, now) {
  if (comp.status === 'COMPLETED' || comp.status === 'CANCELLED')
    return comp.status;
  if (now < new Date(comp.registrationStart)) return 'UPCOMING';
  if (now > new Date(comp.registrationEnd)) return 'REGISTRATION_CLOSED';
  if (comp.currentParticipants >= comp.maxParticipants) return 'FULL';
  return 'REGISTRATION_OPEN';
}

// POST /api/competitions/:id/register
exports.registerForCompetition = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.body.userId || req.headers['x-user-id'] || process.env.DEMO_USER_ID || 'user_001';

    const result = await registrationSvc.register(id, userId);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};

// POST /api/competitions/:id/unregister
exports.unregisterForCompetition = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.body.userId || req.headers['x-user-id'] || process.env.DEMO_USER_ID || 'user_001';

    const result = await registrationSvc.unregister(id, userId);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

// POST /api/competitions/:id/submit
exports.submitForCompetition = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.body.userId || req.headers['x-user-id'] || process.env.DEMO_USER_ID || 'user_001';
    const { submissionUrl, submissionName } = req.body;

    const result = await registrationSvc.submitEntry(id, userId, { submissionUrl, submissionName });
    res.json(result);
  } catch (err) {
    next(err);
  }
};

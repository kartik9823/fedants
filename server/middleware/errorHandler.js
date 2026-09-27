module.exports = (err, req, res, next) => {
  console.error(err);

  // Duplicate key (registration index violation)
  if (err.code === 11000) {
    return res.status(409).json({
      success: false,
      error: 'DUPLICATE_REGISTRATION',
      message: 'You are already registered for this competition.',
    });
  }

  const status = err.statusCode || 500;
  res.status(status).json({
    success: false,
    error: err.code || 'SERVER_ERROR',
    message: err.message || 'An unexpected error occurred.',
  });
};

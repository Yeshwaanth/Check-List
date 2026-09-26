function notFound(req, res) {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
}

function errorHandler(error, req, res, next) {
  console.error(error);

  if (error.name === 'CastError') {
    return res.status(400).json({ message: 'Invalid resource identifier.' });
  }

  return res.status(error.status || 500).json({
    message: error.message || 'An unexpected server error occurred.',
  });
}

module.exports = { notFound, errorHandler };

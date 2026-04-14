// Error handler middleware
export const errorHandler = (error, req, res, next) => {
  console.error('Error:', error.message || error);

  // Validation errors
  if (error.status === 400) {
    return res.status(400).json({
      message: error.message,
      errors: error.errors || [],
    });
  }

  // Authentication errors
  if (error.message?.includes('Invalid') || error.message?.includes('Unauthorized')) {
    return res.status(401).json({ message: error.message });
  }

  // Authorization errors
  if (error.message?.includes('not authorized') || error.message?.includes('access')) {
    return res.status(403).json({ message: error.message });
  }

  // Not found errors
  if (error.status === 404 || error.message?.includes('not found')) {
    return res.status(404).json({ message: error.message || 'Resource not found' });
  }

  // Conflict errors
  if (error.status === 409) {
    return res.status(409).json({ message: error.message });
  }

  // Database errors
  if (error.code?.startsWith('23505')) {
    return res.status(409).json({ message: 'This resource already exists' });
  }

  // Default error
  res.status(error.status || 500).json({
    message: error.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
  });
};

// Async handler wrapper
export const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// Error handler middleware
export const errorHandler = (error, req, res, next) => {
  const isDevelopment = process.env.NODE_ENV === 'development';
  const status = Number(error.status) || 500;

  console.error('Error:', error.message || error);

  if (res.headersSent) {
    return next(error);
  }

  // Validation errors
  if (status === 400) {
    return res.status(400).json({
      message: error.message,
      errors: error.errors || [],
    });
  }

  // Authentication errors
  if (status === 401) {
    return res.status(401).json({ message: error.message || 'Authentication required' });
  }

  // Authorization errors
  if (status === 403) {
    return res.status(403).json({ message: error.message || 'Not authorized' });
  }

  // Not found errors
  if (status === 404) {
    return res.status(404).json({ message: error.message || 'Resource not found' });
  }

  // Conflict errors
  if (status === 409) {
    return res.status(409).json({ message: error.message });
  }

  // PostgreSQL unique violation
  if (error.code === '23505') {
    return res.status(409).json({ message: 'This resource already exists' });
  }

  // Default error: never expose internal details in production.
  res.status(status).json({
    message: status >= 500 && !isDevelopment ? 'Internal server error' : error.message || 'Internal server error',
    ...(isDevelopment && { stack: error.stack }),
  });
};

// Async handler wrapper
export const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

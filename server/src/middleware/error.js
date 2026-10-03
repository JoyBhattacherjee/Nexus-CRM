export function notFound(req, _res, next) {
  const error = new Error(`Route not found: ${req.method} ${req.originalUrl}`);
  error.status = 404;
  next(error);
}

export function errorHandler(error, _req, res, _next) {
  const status = error.status || (error.code === 'P2002' ? 409 : 500);
  const message = error.code === 'P2002' ? 'A record with this unique value already exists' : error.message || 'Internal server error';
  if (process.env.NODE_ENV !== 'production') console.error(error);
  res.status(status).json({ message });
}

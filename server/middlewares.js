const notFound = (req, res, next) => {
  const err = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(err);
};

const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(statusCode).json({
    ok: false,
    message: message,
  });
};

module.exports = { notFound, errorHandler };

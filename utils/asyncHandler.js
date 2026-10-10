// Wraps an async route handler so any thrown error is passed to Express's
// error handler middleware, instead of needing try/catch in every controller.
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;

// Async handler to wrap async functions and catch errors
// This eliminates the need for try-catch blocks in every controller

const asyncHandler = fn => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

module.exports = asyncHandler;

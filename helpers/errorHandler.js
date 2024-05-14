function errorHandler(err, req, res, next) {
  if (err instanceof Zod.error) {
    return res.status(400).json({
      message: err.errors[0].message,
    });
  }
}
module.exports = errorHandler;

const { ZodError } = require("zod");
function errorHandler(err, req, res, next) {
  if (err instanceof ZodError) {
    return res.status(400).json({
      message: err.errors[0].message,
    });
  }
  switch (err.name) {
    case "EmailAlreadyExists":
      return res.status(400).json({
        message: "Email already exists",
      });
    default:
      return res.status(500).json({
        message: "Internal Server Error",
      });
  }
}

module.exports = errorHandler;

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
    case "UsernameAlreadyExists":
      return res.status(400).json({
        message: "Username already exists",
      });
    case "InvalidEmail":
    case "InvalidPassword":
      return res.status(401).json({
        message: "Invalid email or password",
      });
    default:
      return res.status(500).json({
        message: "Internal server error",
      });
  }
}

module.exports = errorHandler;

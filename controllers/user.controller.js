const User = require("../models/user.model");

class UserController {
  static async createUser(req, res, next) {
    try {
      const { email, password } = req.body;
      const user = await User.createUser({ email, password });
      res.status(201).json({message: "User created", user});
    } catch (err) {
      next(err);
    }
  }
}

module.exports = UserController;
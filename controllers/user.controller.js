const User = require("../models/user.model");
/** user input
 * {
    "name": "John Doe",
    "age": 25,
    "gender": "Male",
    "status": "Single",
    "imgUrl": "https://example.com/images/john.jpg",
    "username": "john_doe25",
    "email": "john.doe@example.com",
    "password": "password123",
    "location": "New York, USA",
    "bio": "Software developer with a passion for coding and technology.",
    "preference": ["Hiking", "Reading", "Gaming"]
  }
 */

class UserController {
  static async createUser(req, res, next) {
    try {
      const input = req.body;
      
      const user = await User.createUser(input);
      res.status(201).json({message: "User created", user});
    } catch (err) {
      next(err);
    }
  }
  static async login(req, res, next) {
    try {
      const input = req.body;
      // console.log("🚀 ~ UserController ~ login ~ input:", input)
      const user = await User.loginUser(input);
      res.status(200).json({message: "Login successful", token: user.token});
    } catch (err) {
      next(err);
    }
  }
  static async getAllUsers(req, res, next) {
    try {
      const users = await User.findAllUsers(req.user);
      res.status(200).json(users);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = UserController;
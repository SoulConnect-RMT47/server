const UserController = require("../controllers/user.controller");
/**
 * Middleware for user authentication.
 * @module authentication
 */
const { authentication } = require("../middleware/authentication");

const users = require("express").Router();

users.post("/register", UserController.createUser); // register
users.post("/login", UserController.login); // login

users.use(authentication); // middleware

users.get("/", UserController.getAllUsers); // get all users
users.put("/", UserController.updateUser); // update user
users.post("/swipe/:id", UserController.swipeUser); // swipe user
users.get("/:id", UserController.getUserById); // get by id

module.exports = users;

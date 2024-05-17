const UserController = require("../controllers/user.controller");
const { authentication } = require("../middleware/authentication");

const users = require("express").Router();

users.post("/register", UserController.createUser); // register
users.post("/login", UserController.login); // login

users.use(authentication); // middleware

users.get("/", UserController.getAllUsers); // get all users
users.get("/:id", UserController.getUserById); // get all users

module.exports = users;

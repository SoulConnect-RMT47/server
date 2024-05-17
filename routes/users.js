const UserController = require("../controllers/user.controller");

const users = require("express").Router();

users.get("/", (req, res) => {
  res.send("ini users");
});
users.post("/register", UserController.createUser);
users.post("/login", UserController.login);

module.exports = users;
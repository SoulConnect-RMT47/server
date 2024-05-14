const UserController = require("../controllers/user.controller");

const users = require("express").Router();

users.get("/", (req, res) => {
  res.send("ini users");
});
users.post("/", UserController.createUser);
module.exports = users;
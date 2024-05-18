const connections = require("./connection");
const users = require("./users");

const router = require("express").Router();

router.get("/", (req, res) => {
  res.send("SoulConnect API is running!");
});

router.use("/users", users)
router.use("/connections", connections);


module.exports = router;

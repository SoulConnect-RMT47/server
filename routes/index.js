const connections = require("./connection");
const users = require("./users");

const router = require("express").Router();

router.get("/", (req, res) => {
  res.send("Hello World!");
});

router.use("/users", users)
router.use("/connections", connections);


module.exports = router;

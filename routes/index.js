const connections = require("./connection");
const swipe = require("./swipe");
const users = require("./users");

const router = require("express").Router();

router.get("/", (req, res) => {
  res.status(200).json({ message: "Connected!" });
});

router.use("/users", users)
router.use("/connections", connections);
router.use("/swipe", swipe);


module.exports = router;

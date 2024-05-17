const { ObjectId } = require("mongodb");
const { UserCollection } = require("../connections/collections");
const { verifyToken } = require("../helpers/jwt");

async function authentication(req, res, next) {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = verifyToken(token);
    const user = await UserCollection.findOne({ _id: new ObjectId(decoded.userId) }, { projection: { password: 0 } });
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized" });
  }
}

module.exports = { authentication };

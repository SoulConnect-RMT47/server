const { database } = require("./mongodb");

const UserCollection = database.collection("users");
const SwipeCollection = database.collection("swipes");
const ConnectionCollection = database.collection("connections");

module.exports = { UserCollection, SwipeCollection, ConnectionCollection };

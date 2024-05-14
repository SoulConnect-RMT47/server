const { database } = require("./mongodb");

const UserCollection = database.collection("users");

module.exports = { UserCollection };
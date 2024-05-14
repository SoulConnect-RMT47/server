const { UserCollection } = require("../connections/collections");

class User {
  static async createUser({ email, password }) {
    try {
        const user = await UserCollection.insertOne({ email, password });
        return user;
    } catch (err) {
      throw err;
    }
  }
}
module.exports = User;
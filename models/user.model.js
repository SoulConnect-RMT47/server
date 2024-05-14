const { UserCollection } = require("../connections/collections");
const { userCreaetionSchema } = require("../schema/user.schema");

class User {
  static async createUser({ email, password }) {
    try {
      const data = { email, password };
      const isEmailUnique = await UserCollection.findOne({
        email: data.email,
      });
      if (isEmailUnique) {
        throw { name: "EmailAlreadyExists" };
      }
      userCreaetionSchema.parse(data);
      const user = await UserCollection.insertOne(data);
      return user;
    } catch (err) {
      throw err;
    }
  }
}
module.exports = User;

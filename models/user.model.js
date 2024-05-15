const { UserCollection } = require("../connections/collections");
const { hashPassword } = require("../helpers/bcrypt");
const { userSchema } = require("../schema/user.schema");

class User {
  static async createUser(input) {
    try {
      let data = input;
      userSchema.parse(data);
      const isUsernameUnique = await UserCollection.findOne({
        username: data.username,
      });
      if (isUsernameUnique) {
        throw { name: "UsernameAlreadyExists" };
      }
      const isEmailUnique = await UserCollection.findOne({
        email: data.email,
      });
      if (isEmailUnique) {
        throw { name: "EmailAlreadyExists" };
      }
      const hashedPassword = hashPassword(data.password);
      data.password = hashedPassword;
      const user = await UserCollection.insertOne(data);
      return user;
    } catch (err) {
      throw err;
    }
  }
}

module.exports = User;

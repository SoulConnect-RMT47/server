const { UserCollection } = require("../connections/collections");
const { hashPassword, comparePassword } = require("../helpers/bcrypt");
const { generateToken } = require("../helpers/jwt");
const { userSchema, loginSchema } = require("../schema/user.schema");

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
  static async loginUser(input) {
    try {
      let data = input;
      loginSchema.parse(data);
      const user = await UserCollection.findOne({ email: data.email });
      console.log("🚀 ~ User ~ loginUser ~ user:", user)
      if (!user) {
        throw { name: "InvalidEmail" };
      }
      const isPasswordMatch = comparePassword(data.password, user.password);
      if (!isPasswordMatch) {
        throw { name: "InvalidPassword" };
      } 
      const token = generateToken({ userId: user._id, gender: user.gender });
      return { token };
    } catch (err) {
      throw err;
    }
  }
}

module.exports = User;

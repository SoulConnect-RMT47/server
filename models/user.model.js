const { ObjectId } = require("mongodb");
const { UserCollection, SwipeCollection, ConnectionCollection } = require("../connections/collections");
const { hashPassword, comparePassword } = require("../helpers/bcrypt");
const { generateToken } = require("../helpers/jwt");
const { userSchema, loginSchema, updateSchema } = require("../schema/user.schema");

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
      const user = await UserCollection.insertOne(data, { returnDocument: "after" });
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
      if (!user) {
        throw { name: "InvalidEmail" };
      }
      const isPasswordMatch = comparePassword(data.password, user.password);
      if (!isPasswordMatch) {
        throw { name: "InvalidPassword" };
      }
      const token = generateToken({
        userId: user._id,
        gender: user.gender,
      });
      delete user.password;
      return { token, user };
    } catch (err) {
      throw err;
    }
  }
  static async findAllUsers(loggedInUser) {
    try {
      const gender = loggedInUser.gender === "Male" ? "Female" : "Male";

      const matches = await UserCollection.aggregate([
        {
          $match: {
            gender: gender,
          },
        },
        {
          $addFields: {
            sharedPreferences: {
              $size: {
                $setIntersection: ["$preference", loggedInUser.preference],
              },
            },
          },
        },
        {
          $sort: {
            sharedPreferences: -1,
          },
        },
        {
          $lookup: {
            from: "swipes",
            localField: "_id",
            foreignField: "swipedId",
            as: "swipes",
          },
        },
        {
          $match: {
            "swipes.userId": { $ne: new ObjectId(loggedInUser._id) },
          },
        },
        {
          $project: {
            password: 0,
            swipes: 0,
          },
        },
      ]).toArray();

      return matches;
    } catch (err) {
      throw err;
    }
  }

  static async updateUserById(loggedInUser, input) {
    try {
      let data = input;
      updateSchema.parse(data);
      const isEmailUnique = await UserCollection.findOne({
        email: data.email,
      });
      if (isEmailUnique && isEmailUnique.email !== loggedInUser.email) {
        throw { name: "EmailAlreadyExists" };
      }
      const updatedUser = await UserCollection.findOneAndUpdate({ _id: new ObjectId(loggedInUser._id) }, { $set: data }, { returnDocument: "after" });
      delete updatedUser.password;
      return updatedUser;
    } catch (err) {
      throw err;
    }
  }
  static async getUserById(id) {
    try {
      const user = await UserCollection.findOne({ _id: new ObjectId(id) }, { projection: { password: 0 } });
      if (!user) {
        throw { name: "UserNotFound" };
      }
      return user;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = User;

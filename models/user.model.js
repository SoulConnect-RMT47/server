const { ObjectId } = require("mongodb");
const { UserCollection, SwipeCollection, ConnectionCollection } = require("../connections/collections");
const { hashPassword, comparePassword } = require("../helpers/bcrypt");
const { generateToken } = require("../helpers/jwt");
const { userSchema, loginSchema, updateSchema } = require("../schema/user.schema");
const { swipeSchema } = require("../schema/swipe.schema");

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
      return { token };
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
    // console.log("🚀 ~ User ~ updateUser ~ loggedInUser:", loggedInUser)
    try {
      let data = input;
      // console.log("🚀 ~ User ~ updateUser ~ data:", data)
      updateSchema.parse(data);
      const isEmailUnique = await UserCollection.findOne({
        email: data.email,
      });
      if (isEmailUnique) {
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

  static async addSwipe(id, _id, swipeStatus) {
    try {
      swipeSchema.parse({ id, _id, swipeStatus });
      // console.log(_id, "databody model");
      const swipe = await SwipeCollection.insertOne({
        userId: _id,
        swipedId: new ObjectId(id),
        swipeStatus,
      });
      // console.log(swipe, "swipe mpde;");
      const findSwipe = await SwipeCollection.findOne({
        userId: new ObjectId(id),
        swipedId: _id,
        swipeStatus: "accepted",
      });

      if (!findSwipe) {
        return { message: "Add to swipe has been success" };
      }

      const findUserGender = await this.getUserById(id);

      if (findUserGender.gender === "Male") {
        const createConnection = await ConnectionCollection.insertOne({
          user1: new ObjectId(id),
          user2: new ObjectId(_id),
        });
        return { message: "Congratulations!! You're matched" };
      } else {
        const createConnection = await ConnectionCollection.insertOne({
          user1: new ObjectId(_id),
          user2: new ObjectId(id),
        });
        return { message: "Congratulations!! You're matched" };
      }
    } catch (error) {
      throw error;
    }
  }
}

module.exports = User;

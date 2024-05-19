const { ObjectId } = require("mongodb");
const { SwipeCollection, ConnectionCollection } = require("../connections/collections");
const User = require("./user.model");
const { swipeSchema } = require("../schema/swipe.schema");
const firebaseDB = require("../connections/firebase");
const { collection, addDoc } = require("firebase/firestore");

class Swipe {
  static async findAllSwipes(user) {
    try {
      const swipes = await SwipeCollection.aggregate([
        {
          $match: {
            userId: new ObjectId(user._id),
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "swipedId",
            foreignField: "_id",
            as: "swipedUser",
            pipeline: [
              {
                $project: {
                  password: 0,
                },
              },
            ],
          },
        },
        {
          $unwind: "$swipedUser",
        },
      ]).toArray();

      return swipes;
    } catch (err) {
      throw err;
    }
  }
  static async addSwipe(id, loggedInUser, swipeStatus) {
    console.log("🚀 ~ Swipe ~ addSwipe ~ swipeStatus:", swipeStatus)
    console.log("🚀 ~ Swipe ~ addSwipe ~ loggedInUser:", loggedInUser)
    console.log("🚀 ~ Swipe ~ addSwipe ~ id:", id)
    try {
      const { _id } = loggedInUser;
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

      const user = await User.getUserById(id);
      console.log("🚀 ~ Swipe ~ addSwipe ~ user:", user)
      const gender = user.gender;
      const messageID = await addDoc(collection(firebaseDB, "messages"), {
        user1ID: gender === "Male" ? user.username : loggedInUser.username,
        user2ID: gender === "Male" ? loggedInUser.username : user.username,
        conversations: [],
      });
      const createConnection = await ConnectionCollection.insertOne({
        user1: gender === "Male" ? new ObjectId(id) : new ObjectId(_id),
        user2: gender === "Male" ? new ObjectId(_id) : new ObjectId(id),
        messageID: messageID.id,
      });
      return { message: "Congratulations!! You're matched", createConnection };
    } catch (error) {
      throw error;
    }
  }
}
module.exports = Swipe;

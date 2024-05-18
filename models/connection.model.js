const { ObjectId } = require("mongodb");
const { ConnectionCollection } = require("../connections/collections");

class Connection {
  static async findAllConnecntion(loggedInUser) {
    try {
      const type = loggedInUser.gender === "Male" ? "user1" : "user2";
    //   console.log("🚀 ~ Connection ~ findAllConnecntion ~ gender:", loggedInUser.gender);
    //   console.log("🚀 ~ Connection ~ findAllConnecntion ~ type:", type);
    const connections = await ConnectionCollection.aggregate([
        {
            $match: {
                [type]: new ObjectId(loggedInUser._id),
            },
        },
        {
            $lookup: {
                from: "users",
                let: { userId: type === "user1" ? "$user2" : "$user1" },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $eq: ["$_id", "$$userId"],
                            },
                        },
                    },
                    {
                        $project: {
                            password: 0,
                        },
                    },
                ],
                as: type === "user1" ? "user2" : "user1",
            },
        },
        {
            $unwind: "$user1",
        },
        {
            $unwind: "$user2",
        },
    ]).toArray();

    const result = connections.map((connection) => {
        const user = type === "user1" ? connection.user2 : connection.user1;
        return user;
    });

    return result;
    } catch (err) {
      throw err;
    }
  }
}

module.exports = Connection;

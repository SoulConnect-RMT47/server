const Connection = require("../models/connection.model");

class ConnectionController {
  static async getAllConnections(req, res, next) {
    try {
      const connections = await Connection.findAllConnecntion(req.user);
      res.status(200).json(connections);
    } catch (err) {
      next(err);
    }
  }
}
module.exports = ConnectionController;

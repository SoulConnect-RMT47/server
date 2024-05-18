const ConnectionController = require('../controllers/connection.controller');
/**
 * Middleware for user authentication.
 * @module authentication
 */
const { authentication } = require('../middleware/authentication');
const connections = require('express').Router();
connections.use(authentication); // middleware
connections.get('/', ConnectionController.getAllConnections); // get all connections
module.exports = connections; // export the router
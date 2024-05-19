

const express = require('express');
const SwipeController = require('../controllers/swipe.controller');
const { authentication } = require('../middleware/authentication');
const swipe = express.Router();

swipe.use(authentication);
swipe.get('/', SwipeController.getAllSwipes);
swipe.post("/:id", SwipeController.swipeUser); // swipe user

module.exports = swipe;
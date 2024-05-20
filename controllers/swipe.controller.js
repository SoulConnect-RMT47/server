const Swipe = require("../models/swipe.model");

class SwipeController {
    static async getAllSwipes(req, res, next) {
        try {
            const swipes = await Swipe.findAllSwipes(req.user);
            res.status(200).json(swipes);
        } catch (err) {
            next(err);
        }
    }
    static async swipeUser(req, res, next) {
        try {
            const { swipeStatus } = req.body;
            const { id } = req.params;
            const loggedInUser = req.user;

            const swipe = await Swipe.addSwipe(id, loggedInUser, swipeStatus);
            res.status(200).json(swipe);
        } catch (err) {
            next(err);
        }
    }

}

module.exports = SwipeController;
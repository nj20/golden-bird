/**
 *
 */

var express = require('express');
var router = express.Router();
var db = require("../db/mongoDB");
var verifyHeaders = require("../util/verifyHeaders");
var userController = require("../controllers/user");
var restaurantController = require("../controllers/restaurant");
var ratingController = require("../controllers/rating");
var menuController = require("../controllers/menu");

userController.setDB(db);

restaurantController.setDB(db);
restaurantController.setUserController(userController);

menuController.setDB(db);
menuController.setUserController(userController);
menuController.setRestaurantController(restaurantController);

ratingController.setMenuController(menuController);

router.get('/', function(req, res, next)
{
    if(verifyHeaders(req, ["restaurantid", "userid"]))
    {
        ratingController.getRatings(req.headers["restaurantid"], req.headers["user"]).then(function(ratings)
        {
            res.json(ratings);
        });
    }
    else
    {
        res.json(
        {
            status: 400,
            body: "Missing one or more fields in body"
        });
    }
});

module.exports = router;

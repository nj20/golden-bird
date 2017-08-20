/**
 * This module is used for updating and getting menus
 */

var express = require('express');
var db = require("../db/mongoDB");
var restaurantController = require("../controllers/restaurant");
var userController = require("../controllers/user");
var menuController = require("../controllers/menu");
var router = express.Router();

restaurantController.setDB(db);
userController.setDB(db);
restaurantController.setUserController(userController);
menuController.setDB(db);
menuController.setRestaurantController(restaurantController);
menuController.setUserController(userController);

/**
 * Updates the menu (Look at postman documentation)
 */
router.put('/', function(req, res, next)
{
    if(req.headers.authStatus == 200)
    {
        menuController.update(req.headers.user, req.body).then(function(result)
        {
            res.statusCode = result.status;
            res.json(
            {
                "body": result.body
            });
        });
    }
    else
    {
        res.statusCode = 401;
        res.json(
            {
                "body": "Not Authorized. Please provide valid sessionKey in headers"
            });
    }
});

router.get("/", function(req, res, next)
{
    if(req.headers.authStatus == 200)
    {
        console.log(req.headers);
        menuController.getMenuWithRestaurantId(req.headers.restaurantid).then(function(result)
        {
            res.statusCode = result.status;
            res.json(
                {
                    "body": result.body
                });
        });
    }
    else
    {
        res.statusCode = 401;
        res.json(
            {
                "body": "Not Authorized. Please provide valid sessionKey in headers"
            });
    }
});

module.exports = router;

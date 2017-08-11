/**
 * This module is used for adding and getting orders
 */

var express = require('express');
var db = require("../db/mongoDB");
var router = express.Router();
var userController = require("../controllers/user");
var restaurantController = require("../controllers/restaurant");
var orderController = require("../controllers/order");
userController.setDB(db);
restaurantController.setDB(db);
restaurantController.setUserController(userController);
orderController.setDB(db);
orderController.setRestaurantController(restaurantController);

/**
 * Makes an order
 */
router.post('/', function(req, res, next)
{
    if(req.headers.authStatus == 200)
    {
        orderController.add(req.headers.user, req.body).then(function(result)
        {
            res.statusCode = result.status;
            res.json(
            {
                body: result.body
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

/**
 * Gets the next order in queue
 */
router.get('/next', function (req, res, next)
{
    req.setTimeout(0);
    if(req.headers.authStatus == 200)
    {
        orderController.getNextOrder(req.headers.user, req.headers.restaurantid).then(function(result)
        {
            res.statusCode = result.status;
            //If the connection is lost, we need to add the order back to queue
            if(res.socket.destroyed)
            {
                orderController.addOrderBackToQueue(result.body)
            }
            else
            {
                res.json(
                {
                    body: result.body
                });
            }
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

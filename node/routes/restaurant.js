/**
 * This module is used to work with adding, removing and getting restaurants
 */

var express = require('express');
var db = require("../db/mongoDB");
var restaurantController = require("../controllers/restaurant");
var userController = require("../controllers/user");
var multer = require("multer");
var router = express.Router();

restaurantController.setDB(db);
userController.setDB(db);
restaurantController.setUserController(userController);

/**
 * Adds a restaurant (Look at postman documentation)
 */
router.post('/', function(req, res, next)
{
    if(req.headers.authStatus == 200)
    {
        restaurantController.add(req.headers.user, req.body).then(function(result)
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

/**
 * Gets all restaurants of given user.
 */
router.get('/all', function(req, res, next)
{
    if(req.headers.authStatus == 200)
    {
        restaurantController.getAll(req.headers.user).then(function(result)
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

/**
 * Gets all restaurants of customer.
 */
router.get('/allForCustomer', function(req, res, next)
{
    if(req.headers.authStatus == 200)
    {
        restaurantController.getAllForCustomer().then(function(result)
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

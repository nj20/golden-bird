var express = require('express');
var db = require("../db/mongoDB");
var restaurantController = require("../controllers/restaurant");
var userController = require("../controllers/user");
restaurantController.setDB(db);
userController.setDB(db);
restaurantController.setUserController(userController);
var router = express.Router();

router.post('/', function(req, res, next)
{
    if(req.headers.authStatus == 200)
    {
        req.body.user = req.headers.user;
        restaurantController.add(req.body).then(function(result)
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

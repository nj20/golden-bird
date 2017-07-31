var express = require('express');
var verifyBody = require("../util/verifyBody");
var respondWith = require("../util/response");
var logger = require("../util/logger");
var db = require("../db/mongoDB");
var restaurant = require("../controllers/restaurant");
restaurant.setDB(db);
var router = express.Router();

router.post('/', function(req, res, next)
{
    if(verifyBody(req, ["name", "description", "location", "_id", "password"]))
    {
        restaurant.add(req.body).then(function(result)
        {
            res.statusCode = 201;
            res.json(
            {
                "message": "Added restaurant"
            });
        }, function(err)
        {
            res.statusCode = err.status;
            res.json({message: err.message});
        });
    }
    else
    {
        respondWith.badRequest(res);
    }
});

module.exports = router;

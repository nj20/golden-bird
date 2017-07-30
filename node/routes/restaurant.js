var express = require('express');
var db = require("../db/mongoDB");
var verifyBody = require("../util/verifyBody");
var respondWith = require("../util/response");
var logger = require("../util/logger");
var restaurant = require("../controllers/restaurant");
restaurant.setDB(db);
var router = express.Router();

router.post('/', function(req, res, next)
{
    if(verifyBody(req, ["name", "description"]))
    {
        restaurant.add(req.body["name"], req.body["description"]).then(function(result)
        {
            res.statusCode = 200;
            res.json(
            {
                "message": "Added restaurant"
            });
        }, function(err)
        {
            console.log(err);
            respondWith.internalError(res);
        });
    }
    else
    {
        respondWith.badRequest(res);
    }
});



module.exports = router;

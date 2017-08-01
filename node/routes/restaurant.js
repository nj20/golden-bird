var express = require('express');
var db = require("../db/mongoDB");
var restaurant = require("../controllers/restaurant");
restaurant.setDB(db);
var router = express.Router();

router.post('/', function(req, res, next)
{
    restaurant.add(req.body).then(function(result)
    {
        res.statusCode = result.status;
        res.json(
        {
            "body": result.body
        });
    });
});

module.exports = router;

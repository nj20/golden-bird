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
            "message": result.message
        });
    });
});

module.exports = router;

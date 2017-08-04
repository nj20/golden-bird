var express = require('express');
var router = express.Router();
var db = require("../db/mongoDB");

router.get('/', function(req, res, next)
{
    res.json(
    {
        api: "Golden-Bird",
        available: db.status()
    });
});

module.exports = router;

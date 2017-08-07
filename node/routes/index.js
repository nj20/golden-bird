/**
 * This is the landing page of the API
 * It just shows if the API is ready to be used.
 */

var express = require('express');
var router = express.Router();
var db = require("../db/mongoDB");

router.get('/', function(req, res, next)
{
    res.json(
    {
        api: "Golden-Bird",
        available: db.status(),
        documentation:
        {
            postmanCollection: "https://www.getpostman.com/collections/d32ceaf7946f96963b6a",
            description: "Download postman and import the collection given above"
        }
    });
});

module.exports = router;

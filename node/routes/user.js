var express = require('express');
var db = require("../db/mongoDB");
var user = require("../controllers/user");
var session = require("../controllers/session");

user.setDB(db);
session.setDB(db);
session.setUserController(user);

var router = express.Router();

router.post('/', function(req, res, next)
{
    user.add(req.body).then(function(result)
    {
        res.statusCode = result.status;
        res.json(
        {
            "body": result.body
        });
    });
});

router.post('/login', function(req, res, next)
{
    session.startNewSession(req.body).then(function(result)
    {
        res.statusCode = result.status;
        res.json(
        {
            "body": result.body
        });
    });
});

module.exports = router;

var express = require('express');
var db = require("../db/mongoDB");
var userController = require("../controllers/user");
var sessionController = require("../controllers/session");

userController.setDB(db);
sessionController.setDB(db);
sessionController.setUserController(userController);

var router = express.Router();

router.post('/', function(req, res, next)
{
    userController.add(req.body).then(function(result)
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
    sessionController.startNewSession(req.body).then(function(result)
    {
        res.statusCode = result.status;
        res.json(
        {
            "body": result.body
        });
    });
});

module.exports = router;

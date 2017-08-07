/**
 * This module is used for adding, removing users and logging them in and out
 */

var express = require('express');
var db = require("../db/mongoDB");
var userController = require("../controllers/user");
var sessionController = require("../controllers/session");
var router = express.Router();

userController.setDB(db);
sessionController.setDB(db);
sessionController.setUserController(userController);

/**
 * Updates the menu (Look at postman documentation)
 */
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

/**
 * Logs in a user and returns a session key (Look at postman documentation)
 */
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

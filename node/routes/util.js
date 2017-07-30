var express = require('express');
var router = express.Router();
var db = require("../db/mongoDB");
var respondWith = require("../util/response");

if(process.env.environment != "prod")
{
    router.delete('/database', function (req, res, next)
    {
        db.dropDatabase().then(function()
        {
            res.json({message: "Database deleted"});
        }, function(err)
        {
            console.log(err);
            respondWith.internalError(res);
        });
    });
}
module.exports = router;

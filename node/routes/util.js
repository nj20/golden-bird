var express = require('express');
var router = express.Router();
var db = require("../db/mongoDB");

if(process.env.environment == "qe")
{
    router.delete('/database', function (req, res, next)
    {
        db.dropDatabase().then(function(result)
        {
            res.statusCode = result.status;
            res.json(
            {
                "message": result.message
            });
        });
    });
}
module.exports = router;

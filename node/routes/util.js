/**
 * This module is used for testing. This endpoint will only be available if the software
 * is running on local or qe environment.
 */

var express = require('express');
var db = require("../db/mongoDB");
var router = express.Router();

if(process.env.environment == "qe" || process.env.environment == "local")
{
    /**
     * Deletes the database when this endpoint is called
     */
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

    router.get("/test", function(req, res, next)
    {
        setTimeout(function()
        {
            console.log("HELLO WORLD");
            console.log(res);
            res.json({"data": "what"});
        }, 5000);

    });
}
module.exports = router;

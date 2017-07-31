var express = require('express');
var db = require("../db/mongoDB");
var user = require("../controllers/user");
user.setDB(db);
var router = express.Router();

router.post('/', function(req, res, next)
{
    user.add(req.body).then(function(result)
    {
        res.statusCode = result.status;
        res.json(
        {
            "message": result.message
        });
    });
});

module.exports = router;

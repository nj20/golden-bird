var db = require("../db/mongoDB");
var userController = require("../controllers/user")
userController.setDB(db);
var sessionController = require("../controllers/session");
sessionController.setDB(db);
sessionController.setUserController(userController);

module.exports = function(req, res, next)
{
    if(req.headers["sessionKey"] != undefined)
    {
        sessionController.getUserFromSessionKey(req.headers["sessionKey"]).then(function(result)
        {
            console.log(result);
            if(result.status == 200)
            {
                req.headers["authStatus"] = 200;
                req.headers["user"] = result.body;
            }
            else
            {
                req.headers["authStatus"] = result.status;
                req.headers["userId"] = undefined;
            }
            next();
        });
    }
    else
    {
        //No session key is provided
        req.headers["userId"] = undefined;
        req.headers["authStatus"] = 400;
        next();
    }
}

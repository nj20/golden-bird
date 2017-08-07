/*
 This module is called before making any API calls.
 Takes session key from header and gets the corresponding user.
 The user is assigned to the header and redirected to the endpoint called
*/

var db = require("../db/mongoDB");
var userController = require("../controllers/user")
userController.setDB(db);
var sessionController = require("../controllers/session");
sessionController.setDB(db);
sessionController.setUserController(userController);

/**
 * A Middleware that uses sessionkey in the header to find its corresponding user.
 * It creates a new header called authStatus which describes the result of authentication in HTTP code
 * If authStatus is 200, another header called user will have all the user details corresponding to the sessionkey.
 * @param {object} req - HTTP request
 * @param {object} res - HTTP response
 * @param {function} next - next function that will process the request.
 */
module.exports = function(req, res, next)
{
    if(req.headers["sessionkey"] != undefined)
    {
        sessionController.getUserFromSessionKey(req.headers["sessionkey"]).then(function(result)
        {
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

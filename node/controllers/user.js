var verifyJson = require("../util/verifyJson");
var randomstring = require("randomstring");
var crypto = require('crypto');
var db;
var collection= 'user';

module.exports =
{
    add: function(user)
    {
        return new Promise(function(fulfill, reject)
        {
            if(verifyJson(user, ["_id", "password", "type"]))
            {
                //Creating salt and hashing the password
                user.salt = randomstring.generate(10);
                var secret = process.env.hashSecret;
                user.password = crypto.createHmac('sha256', secret)
                .update(user.password + user.salt)
                .digest('hex');
                db.insertOne(collection, user).then(function(result)
                {
                    fulfill(result);
                });
            }
            else
            {
                fulfill(
                {
                    status: 400,
                    message: "Missing one or more fields in body"
                });
            }
        });
    },

    setDB: function(database)
    {
        db = database;
    }
}
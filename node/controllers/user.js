var verifyJson = require("../util/verifyJson");
var randomstring = require("randomstring");
var crypto = require('crypto');
var db;
var collection = 'user';

module.exports =
{
    add: function(user)
    {
        return new Promise(function(fulfill, reject)
        {
            //Checks is user has _id, password and type field
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

    getUser: function(userId)
    {
        return new Promise(function(fulfill, reject)
        {
            db.find(collection, {"_id": userId}).then(function(result)
            {
                result.body.toArray(function(err, user)
                {
                    if(user.length > 0)
                    {
                        fulfill(
                        {
                            status: 200,
                            body: user[0]
                        })
                    }
                    else
                    {
                        fulfill(
                            {
                                status: 404,
                                body: "user not found"
                            })
                    }
                });
            }, function(err)
            {
                console.log(err);
                fulfill(
                {
                    status: 500,
                    body: "internal server error"
                })
            })
        });
    },

    setDB: function(database)
    {
        db = database;
    },

    collectionName: function()
    {
        return collection;
    }
}
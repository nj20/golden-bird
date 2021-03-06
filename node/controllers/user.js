/*
Before using user, you need to set DB
User can be a customer or restaurant owner

 External User Structure (Structure of user when using the interface):
 {
    _id: string,
    password: string,
    type: string (0 = customer, 1 = owner)
 }

 Internal User Structure (Structure of user when using the interface):
 {
     _id: string,
     password: string (hashed),
     salt: string,
     type: string (0 = customer, 1 = owner)
 }

*/

var verifyJson = require("../util/verifyJson");
var randomstring = require("randomstring");
var crypto = require('crypto');
var db;
var collection = 'user';

module.exports =
{
    /**
     *
     * @param user
     * @returns {Promise}
     */
    add: function(user)
    {
        var userController = this;
        //Cloning the user since it will be manipulated later
        var user = Object.assign({}, user);
        return new Promise(function(fulfill, reject)
        {
            //Checks is user has _id, password and type field
            if(verifyJson(user, ["_id", "password", "type"]))
            {
                if(user.type == userController.customer() || user.type == userController.restaurantOwner())
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
                        body: "type can be 0 (customer) or 1 (restaurant manager)"
                    })
                }
            }
            else
            {
                fulfill(
                {
                    status: 400,
                    body: "Missing one or more fields in body"
                });
            }
        });
    },

    /**
     *
     * @param userId
     * @returns {Promise}
     */
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
    },

    /**
     * Represents a customer. If the user type is equal to this, its a customer.
     * @returns {string}
     */
    customer: function()
    {
        return "0";
    },

    /**
     * Represents a restaurant owner. If the user type is equal to this, its a restaurant owner
     * @returns {string}
     */
    restaurantOwner: function()
    {
        return "1";
    }
}
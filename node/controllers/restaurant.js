//Before using restaurant, you need to set DB

var verifyJson = require("../util/verifyJson");
var ObjectID = require('mongodb').ObjectID;
var db;
var userController;
var collection= 'restaurant';

module.exports =
{
    add: function(user, restaurant)
    {
        return new Promise(function(fulfill, reject)
        {
            //Checking if restaurant has name, description and location
            if(verifyJson(restaurant, ["name", "description", "location"]))
            {
                //If user is restaurant manager
                if(user.type == userController.restaurantOwner())
                {
                    //Creating new ID
                    var objectId = new ObjectID();
                    restaurant._id = objectId.toHexString();
                    restaurant.userId = user._id;
                    db.insertOne(collection, restaurant).then(function(result)
                    {
                        fulfill(result);
                    });
                }
                else
                {
                    fulfill(
                    {
                        status: 401,
                        body: "Not Authorized"
                    });
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

    getAll: function(user)
    {
        return new Promise(function(fulfill, reject)
        {
            db.find(collection, {"userId": user._id}).then(function(result)
            {
                if(result.status == 200)
                {
                    result.body.toArray().then(function(restaurants)
                    {
                        fulfill(
                        {
                            status: 200,
                            body: restaurants
                        })
                    });
                }
                else
                {
                    fulfill(result);
                }
            });
        });
    },

    setDB: function(database)
    {
        db = database;
    },

    setUserController: function(userContr)
    {
        userController = userContr;
    },

    collectionName: function()
    {
        return collection;
    }
}
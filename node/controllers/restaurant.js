//Before using restaurant, you need to set DB

var verifyJson = require("../util/verifyJson");
var ObjectID = require('mongodb').ObjectID;
var db;
var userController;
var collection= 'restaurant';

module.exports =
{
    add: function(restaurant)
    {
        return new Promise(function(fulfill, reject)
        {
            //Checking if restaurant has name, description and location
            if(verifyJson(restaurant, ["name", "description", "location", "user"]))
            {
                //If user is restaurant manager
                if(restaurant.user.type == userController.restaurantOwner())
                {
                    //Creating new ID
                    var objectId = new ObjectID();
                    restaurant._id = objectId.toHexString();
                    db.insertOne(collection, restaurant).then(function(result)
                    {
                        console.log(result);
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
var verifyJson = require("../util/verifyJson");
var ObjectID = require('mongodb').ObjectID;
var db;
var collection= 'restaurant';

module.exports =
{
    add: function(restaurant)
    {
        return new Promise(function(fulfill, reject)
        {
            //Checking if restaurant has name, description and location
            if(verifyJson(restaurant, ["name", "description", "location"]))
            {
                //Creating new ID
                var objectId = new ObjectID();
                restaurant._id = objectId.toHexString();
                db.insertOne(collection, restaurant).then(function(result)
                {
                    fulfill(result);
                });
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

    collectionName: function()
    {
        return collection;
    }
}
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
            if(verifyJson(restaurant, ["name", "description", "location"]))
            {
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
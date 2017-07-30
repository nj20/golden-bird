//This module is used to manipulate data in database
var mongoDriver = require('./mongoDriver');

//Gets the database connection
var db;
mongoDriver.connect().then(function (database)
{
    db = database;
    fulfill(
    {
        "message": "connected with mongoDB"
    })
}, function (err)
{
    reject(err);
});

module.exports =
{
    insertOne: function(collection, json)
    {
        return new Promise(function(fulfill, reject)
        {
            db.collection(collection).insertOne(json, function(err, result)
            {
                if(err)
                {
                    reject(err);
                }
                else
                {
                    fulfill(result);
                }
            });
        });
    }
}
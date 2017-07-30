//This module is used to manipulate data in database
var mongoDriver = require('./mongoDriver');

//Gets the database connection
var db;

mongoDriver.connect().then(function (database)
{
    db = database;
}, function (err)
{
    console.log(err);
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
    },

    dropDatabase: function()
    {
        return new Promise(function(fulfill, reject)
        {
            db.dropDatabase(function(err)
            {
                if(err)
                {
                    reject(err);
                }
                else
                {
                    fulfill();
                }
            });
        });
    },

    //Returns true if ready, returns false if not ready
    status: function()
    {
        return db != null;
    }
}
//This module is used to manipulate data in database
var mongoDriver = require('./mongoDriver');
var ObjectID = require('mongodb').ObjectID;

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
            console.log(json._id)
            db.collection(collection).find({"_id": json._id}, function(err, res)
            {
                res.count().then(function(count)
                {
                    if(count > 0)
                    {
                        reject(
                        {
                            status: 409,
                            message: "id already exists"
                        })
                    }
                    else
                    {
                        db.collection(collection).insertOne(json, function (err, result)
                        {
                            if (err)
                            {
                                console.log(err);
                                reject(
                                    {
                                        status: 500,
                                        message: "internal server error"
                                    })
                            }
                            else
                            {
                                fulfill(result);
                            }
                        });
                    }
                });
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
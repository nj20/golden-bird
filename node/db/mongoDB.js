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
            db.collection(collection).find({"_id": json._id}, function(err, res)
            {
                res.count().then(function(count)
                {
                    if(count > 0)
                    {
                        fulfill(
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
                                fulfill(
                                {
                                    status: 500,
                                    message: "internal server error"
                                })
                            }
                            else
                            {
                                fulfill(
                                {
                                    status: 201,
                                    message: "Added entity"
                                });
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
                    console.log(err);
                    fulfill(
                    {
                        status: 500,
                        message: "internal server error"
                    });
                }
                else
                {
                    fulfill(
                    {
                        status: 200,
                        message: "deleted database"
                    });
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
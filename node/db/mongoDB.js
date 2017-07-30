//This module is used to manipulate data in database

var mongoDriver = require('./mongoDriver');
var db;

module.exports =
{
    //Needs to be called at least once before making any other request
    connect: function()
    {
        return new Promise(function(fulfill, reject)
        {
            if(db != null)
            {
                fulfill(
                {
                    "message": "Already connected with mongoDB"
                })
            }
            else
            {
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
            }
        });
    }
}
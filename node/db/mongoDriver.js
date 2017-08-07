/*
 This module connects to the mongodb and returns the database.
 */


var MongoClient = require('mongodb').MongoClient;
var url = process.env.mongodbHost;
module.exports =
{
    /**
     * Connects to the database and fulfills with the connection
     * @returns {Promise}
     */
    connect: function()
    {
        return new Promise(function(fulfill, reject)
        {
            MongoClient.connect(url, function(err, db)
            {
                if(err)
                {
                    reject(err);
                }
                else
                {
                    fulfill(db);
                }
            });
        });
    }
}
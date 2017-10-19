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
                    process.exit(1);
                }
                else
                {
                    db.on("close", function()
                    {
                        console.error("Disconnected from Mongodb");
                        process.exit(1);
                    });
                    fulfill(db);
                }
            });
        });
    }
}
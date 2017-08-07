/*
 This module is used to manipulate data in database.
 Call the status method to make sure that this module is ready for use. If it returns false, wait for it to become true.
*/
var mongoDriver = require('./mongoDriver');
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
    /**
     *
     * @param {string} collection - Name of the collection
     * @param {*} json - Document to be added
     * @returns {Promise}
     */
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
                            body: "id already exists"
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
                                    body: "internal server error"
                                })
                            }
                            else
                            {
                                fulfill(
                                {
                                    status: 201,
                                    body: "Added entity"
                                });
                            }
                        });
                    }
                });
            });
        });
    },

    /**
     *
     * @param {string} collection - Name of the collection
     * @param {object} query - Filter. (Check Mongodb documentation)
     * @returns {Promise}
     */
    find: function(collection, query)
    {
        return new Promise(function(fulfill, reject)
        {
            db.collection(collection).find(query, function(err, result)
            {
                if(err)
                {
                    console.log(err);
                    fulfill(
                    {
                        status: 500,
                        body: "internal server error"
                    });
                }
                else
                {
                    fulfill(
                    {
                        status: 200,
                        body: result
                    });
                }
            });
        });
    },

    /**
     *
     * @param {string} collection - Name of the collection
     * @param {object} query - Filter. (Check Mongodb documentation)
     * @returns {Promise}
     */
    delete: function(collection, query)
    {
        return new Promise(function(fulfill, reject)
        {
            db.collection(collection).deleteMany(query, function(err, result)
            {
                if(err)
                {
                    console.log(err);
                    fulfill(
                    {
                        status: 500,
                        body: "internal server error"
                    });
                }
                else
                {
                    fulfill(
                    {
                        status: 200,
                        body: result
                    });
                }
            });
        });
    },

    /**
     *
     * @param {string} collection - Name of the collection
     * @param {object} query - Filter. (Check Mongodb documentation)
     * @param {object} update - update query including operators (Check Mongodb documentation)
     * @returns {Promise}
     */
    updateOne: function(collection, query, update)
    {
        return new Promise(function(fulfill, reject)
        {
            db.collection(collection).updateOne(query, update, {"upsert": true}, function(err, result)
            {
                if(err)
                {
                    console.log(err);
                    fulfill(
                        {
                            status: 500,
                            body: "internal server error"
                        });
                }
                else
                {
                    fulfill(
                        {
                            status: 200,
                            body: result
                        });
                }
            });
        });
    },

    /**
     * Deletes the whole database
     * @returns {Promise}
     */
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
                        body: "internal server error"
                    });
                }
                else
                {
                    fulfill(
                    {
                        status: 200,
                        body: "deleted database"
                    });
                }
            });
        });
    },

    /**
     * Returns true if ready, returns false if not ready
     * @returns {boolean}
     */
    status: function()
    {
        return db != null;
    }
}
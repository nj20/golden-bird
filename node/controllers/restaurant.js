/*
This module is used to manipulate restaurant in database.
Each restaurant owner (user) can add restaurants. They cannot see/manipulate restaurants they did not create.
Before using restaurant, you need to set db and userController

 Restaurant External Structure: (when using the interface)
 {
 name: string,
 description: string,
 location: string
 }

Restaurant Internal Structure: (How it is represented within the module)
{
    _id: string,
    name: string,
    description: string,
    location: string
}
*/
var verifyJson = require("../util/verifyJson");
var ObjectID = require('mongodb').ObjectID;
var db;
var userController;
var collection= 'restaurant';

module.exports =
{
    /**
     *
     * @param {Object} user - Restaurant owner that is creating the restaurant
     * @param restaurant
     * @returns {Promise}
     */
    add: function(user, restaurant)
    {
        return new Promise(function(fulfill, reject)
        {
            //Checking if restaurant has name, description and location
            if(verifyJson(restaurant, ["name", "description", "location"]))
            {
                //If user is restaurant manager
                if(user.type == userController.restaurantOwner())
                {
                    //Creating new ID
                    var objectId = new ObjectID();
                    restaurant._id = objectId.toHexString();
                    restaurant.userId = user._id;
                    db.insertOne(collection, restaurant).then(function(result)
                    {
                        fulfill(result);
                    });
                }
                else
                {
                    fulfill(
                    {
                        status: 401,
                        body: "Not Authorized"
                    });
                }
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

    /**
     * Gets all the restaurants owned by given user
     * @param {Object} user
     * @returns {Promise}
     */
    getAll: function(user)
    {
        return new Promise(function(fulfill, reject)
        {
            db.find(collection, {"userId": user._id}).then(function(result)
            {
                if(result.status == 200)
                {
                    result.body.toArray().then(function(restaurants)
                    {
                        fulfill(
                        {
                            status: 200,
                            body: restaurants
                        })
                    });
                }
                else
                {
                    fulfill(result);
                }
            });
        });
    },

    /**
     *
     * @param {Object} user
     * @param {string} restaurantId
     * @returns {Promise}
     */
    doesUserOwnRestaurant: function(user, restaurantId)
    {
        return new Promise(function(fulfill, reject)
        {
            db.find(collection, {"userId": user._id, "_id": restaurantId}).then(function(result)
            {
                if(result.status == 200)
                {
                    result.body.toArray().then(function(restaurants)
                    {
                        fulfill(
                        {
                            status: 200,
                            body: (restaurants.length == 1)
                        })
                    });
                }
                else
                {
                    fulfill(result);
                }
            });
        });
    },

    /**
     * Returns restaurant that corresponds to given id. Return 404 if no restaurant is found.
     * @param restaurantId
     * @returns {Promise}
     */
    getRestaurantWithId: function(restaurantId)
    {
        return new Promise(function(fulfill, reject)
        {
            db.find(collection, {_id: restaurantId}).then(function(result)
            {
                if(result.status == 200)
                {
                    result.body.toArray().then(function(restaurants)
                    {
                        if(restaurants.length > 0)
                        {
                            fulfill(
                            {
                                status: 200,
                                body: restaurants[0]
                            });
                        }
                        else
                        {
                            fulfill(
                            {
                                status: 404,
                                body: "restaurant not found"
                            });
                        }
                    });
                }
                else{fulfill(result);}
            });
        });
    },

    setDB: function(database)
    {
        db = database;
    },

    setUserController: function(userContr)
    {
        userController = userContr;
    },

    collectionName: function()
    {
        return collection;
    }
}
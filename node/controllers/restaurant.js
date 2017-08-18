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
     * Returns a list of ALL the restaurants
     */
    getAllForCustomer: function()
    {
        return new Promise(function(fulfill, reject)
        {
            db.getAll(collection).then(function(result)
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
     * Returns a list of restaurants within the range of give lat and long
     * @param long Longitude (Degrees)
     * @param lat Latitude (Degrees)
     * @param accuracy Accuracy of the give point (in meters)
     * @param range Radius in meters
     * @returns {Promise}
     */
    getRestaurantsByLocation: function(lat, long, accuracy, range)
    {
        return new Promise(function(fulfill, reject)
        {
            db.getAll(collection).then(function(result)
            {
                if(result.status == 200)
                {
                    result.body.toArray().then(function(restaurants)
                    {
                        var filteredRestaurants = [];
                        for(var count = 0; count < restaurants.length; count++)
                        {
                            var distance = calculateDistance(lat, long, restaurants[count].latitude, restaurants[count].longitude);

                            if(distance <= range)
                            {
                                restaurants[count].distance = distance;
                                filteredRestaurants.push(restaurants[count]);
                            }
                        }
                        fulfill(
                        {
                            status: 200,
                            body: filteredRestaurants
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

var calculateDistance = function(lat1, lon1, lat2, lon2)
{
    var R = 6371e3; // metres
    var φ1 = toRadians(lat1);
    var φ2 = toRadians(lat2);
    var Δφ = toRadians(lat2-lat1);
    var Δλ = toRadians(lon2-lon1);

    var a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c;
}

var toRadians = function(degrees)
{
    return degrees * (Math.PI / 180);
}
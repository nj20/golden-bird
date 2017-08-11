/*
 This module is used to manipulate orders from users in database.

 Order External Structure (How order is represented when using this interface):
 {
     restaurantId: string,
     tableId: string,
     items:
     [{
         itemId: string,
         quantity: number
     }],
     time: long
 }

 Order Internal Structure (How order is represented internally):
 {
    _id: string,
    userId: string,
    restaurantId: string,
    tableId: string,
    items:
    [{
        itemId: string,
        quantity: number
    }],
    time: long
 }

 */

var verifyJson = require("../util/verifyJson");
var ObjectID = require('mongodb').ObjectID;
var db;
var restaurantController;
var collection = "order";

module.exports =
{
    /**
     * Adds a order to the collection and then adds it to a queue.
     * @param user - customer
     * @param order
     * @returns {Promise}
     */
    add: function(user, order)
    {
        return new Promise(function(fulfill, reject)
        {
            if(verifyOrder(order))
            {
                restaurantController.getRestaurantWithId(order.restaurantId).then(function(result)
                {
                    if(result.status == 200)
                    {
                        order.userId = user._id;

                        //Adding to database for record
                        db.insertOne(collection, order).then(function(result)
                        {
                            if(result.status == 201)
                            {
                                //Enqueues a job to notify that a order has been made in the restaurant
                                db.enqueueJob(order.restaurantId, "order", order).then(function(result)
                                {
                                    if(result.status == 201)
                                    {
                                        fulfill(
                                        {
                                            status: 201,
                                            body: "order received"
                                        });
                                    }else {fulfill(result);}
                                });
                            }else{fulfill(result);}
                        });
                    }else{fulfill(result);}
                });
            }
            else
            {
                fulfill(
                {
                    status: 400,
                    body: "Invalid order structure"
                })
            }
        });
    },

    /**
     * Gets the next order in queue and removes it from the queue
     * @param user - The restaurant manager of the restaurant
     * @param restaurantId
     * @returns {Promise}
     */
    getNextOrder: function(user, restaurantId)
    {
        return new Promise(function(fulfill, reject)
        {
            restaurantController.doesUserOwnRestaurant(user, restaurantId).then(function(result)
            {
                if(result.status == 200)
                {
                    var isOwner = result.body;
                    if(isOwner)
                    {
                        var worker = db.registerToJobName(restaurantId, "order", function(order, callback)
                        {
                            fulfill(
                            {
                                status: 200,
                                body: order
                            });
                            worker.stop();
                            callback();
                        });
                    }
                    else
                    {
                        fulfill(
                        {
                            status: 401,
                            body: "User does not own restaurant"
                        });
                    }
                }else{fulfill(result);}
            });
        });
    },

    /**
     * Used when order is popped from queue but the connection from client is broken.
     * Hence, we need to put the order back in queue.
     * @param order
     */
    addOrderBackToQueue: function(order)
    {
        db.enqueueJob(order.restaurantId, "order", order).then(function(result) {});
    },

    setDB: function(database)
    {
        db = database;
    },

    setRestaurantController: function(controller)
    {
        restaurantController = controller;
    },

    collectionName: function()
    {
        return collection;
    }
}

var verifyOrder = function(order)
{
    if(verifyJson(order, ["restaurantId", "tableId", "items", "time"]))
    {
        for(var count = 0; count < order.items.length; count++)
        {
            if(!verifyJson(order.items[count], ["itemId", "quantity"]))
            {
                return false;
            }
        }
    }
    else
    {
        return false;
    }
    return true;
}
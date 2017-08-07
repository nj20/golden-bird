/*
A session represents a login session for a user.
Each session has an expiry date.
Before using session, you need to set DB and UserController

Session Structure:
{
    _id: string,
    startTime: date,
    endTime: date,
    userId: string
}
*/

var verifyJson = require("../util/verifyJson");
var randomstring = require("randomstring");
var crypto = require('crypto');
var userController;
var db;
var collection = 'session';
var ObjectID = require('mongodb').ObjectID;

module.exports =
{
    startNewSession: function(userCredentials)
    {
        return new Promise(function(fulfill, reject)
        {
            //Checking if userCredentials have _id and password field
            if(verifyJson(userCredentials, ["_id", "password"]))
            {
                userController.getUser(userCredentials._id).then(function(result)
                {
                    if(result.status == 200)
                    {
                        var user = result.body;
                        // Checking weather the userCredentials are correct
                        if(verifyCredentials(user, userCredentials))
                        {
                            var sessionTime = process.env.defaultLogInSessionTime;
                            addSession(Date.now(), sessionTime,user._id).then(function(result)
                            {
                                fulfill(result);
                            });
                        }
                        else
                        {
                            fulfill(
                            {
                                status: 401,
                                body: "Invalid password"
                            });
                        }
                    }
                    else
                    {
                        //returns the error
                        fulfill(result);
                    }
                })
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

    getUserFromSessionKey: function(sessionKey)
    {
        return new Promise(function(fulfill, reject)
        {
            db.find(collection, {"_id": sessionKey}).then(function(result)
            {
                result.body.toArray().then(function(session)
                {
                    if(session.length != 0)
                    {
                        if(session[0].endTime <= Date.now())
                        {
                            fulfill(
                            {
                                status: 401,
                                body: "Session expired"
                            });
                        }
                        else
                        {
                            userController.getUser(session[0].userId).then(function(userSearchResult)
                            {
                                fulfill(userSearchResult);
                            });
                        }
                    }
                    else
                    {
                        fulfill(
                        {
                            status: 401,
                            body: "invalid token"
                        });
                    }
                });
            });
        });
    },

    setDB: function(database)
    {
        db = database;
    },

    setUserController: function(controller)
    {
        userController = controller;
    },

    collectionName: function()
    {
        return collection;
    }
}

//Checks if userCredentials match the userData
var verifyCredentials = function(userData, userCredentials)
{
    var secret = process.env.hashSecret;
    var password = crypto.createHmac('sha256', secret)
    .update(userCredentials.password + userData.salt)
    .digest('hex');
    return password == userData.password && userData._id == userCredentials._id;
}

//start time is in unix timestamp and duration is in seconds
var addSession = function(startTime, duration, userId)
{
    return new Promise(function(fulfill, reject)
    {
        db.delete(collection, {"userId": userId}).then(function(result)
        {
            var id = (new ObjectID()).toHexString();
            db.insertOne(collection,
            {
                _id: id,
                startTime: startTime,
                endTime: parseInt(startTime) + parseInt(duration),
                userId: userId
            }).then(function(result)
            {
                if(result.status == 201)
                {
                    fulfill(
                    {
                        status: 201,
                        body:
                        {
                            sessionKey: id
                        }
                    })
                }
                else
                {
                    fulfill(result)
                }
            });
        });
    });
}
var db = require("../../db/mongoDB")
var restaurantController = require("../../controllers/restaurant")
var userController = require("../../controllers/user");
var chai = require("chai");
var expect = chai.expect;

describe('Restaurant', function()
{
    this.timeout(5000);
    before(function(done)
    {
        //Waiting for db to get connected
        var interval = setInterval(function()
        {
            if(db.status())
            {
                userController.setDB(db);
                restaurantController.setDB(db);
                restaurantController.setUserController(userController);
                restaurantController.setDB(db);
                clearInterval(interval);
                done();
            }
        }, 300)
    });

    beforeEach(function(done)
    {
        db.dropDatabase().then(function(){done();});
    });

    it('can be added', function(done)
    {

        var userData =
        {
            "_id": "nj20",
            "password": "1234",
            "type": "1"
        }

        var restaurantData =
        {
            "name": "Nandos",
            "description": "Tasty",
            "location": "St. Andrews"
        }

        userController.add(userData).then(function(addResult)
        {
            restaurantController.add(userData, restaurantData).then(function(addResult)
            {
                db.find(restaurantController.collectionName(), {"name": restaurantData.name}).then(function(searchResult)
                {
                    searchResult.body.toArray().then(function(searchResult)
                    {
                        try
                        {
                            expect(addResult.status).to.equal(201);
                            expect(searchResult.length).to.equal(1);
                            expect(searchResult[0]).to.deep.include(restaurantData);
                            done();
                        }
                        catch(e)
                        {
                            done(e);
                        }
                    });
                })
            })
        });
    });

    it('cannot be added if user is customer', function(done)
    {

        var userData =
        {
            "_id": "nj20",
            "password": "1234",
            "type": "0"
        }

        var restaurantData =
        {
            "name": "Nandos",
            "description": "Tasty",
            "location": "St. Andrews"
        }

        userController.add(userData).then(function(addResult)
        {
            restaurantController.add(userData, restaurantData).then(function(addResult)
            {
                db.find(restaurantController.collectionName(), {"name": restaurantData.name}).then(function(searchResult)
                {
                    searchResult.body.toArray().then(function(searchResult)
                    {
                        try
                        {
                            expect(addResult.status).to.equal(401);
                            expect(searchResult.length).to.equal(0);
                            done();
                        }
                        catch(e)
                        {
                            done(e);
                        }
                    });
                })
            })
        });
    });

    it('can be checked if its owned by a given user', function(done)
    {
        var userData =
        {
            "_id": "nj20",
            "password": "1234",
            "type": "1"
        }

        var userData2 =
        {
            "_id": "c20",
            "password": "1234",
            "type": "1"
        }

        var restaurantData =
        {
            "name": "Nandos",
            "description": "Tasty",
            "location": "St. Andrews"
        }

        userController.add(userData).then(function(addResult)
        {
            userController.add(userData2).then(function(addResult)
            {
                restaurantController.add(userData, restaurantData).then(function(addResult)
                {
                    db.find(restaurantController.collectionName(), {"name": restaurantData.name}).then(function(searchResult)
                    {
                        searchResult.body.toArray().then(function(searchResult)
                        {
                            restaurantController.doesUserOwnRestaurant(userData, searchResult[0]._id).then(function(result1)
                            {
                                restaurantController.doesUserOwnRestaurant(userData2, searchResult[0]._id).then(function(result2)
                                {
                                    try
                                    {
                                        expect(result1.body).to.equal(true);
                                        expect(result2.body).to.equal(false);
                                        done();
                                    }
                                    catch(e)
                                    {
                                        done(e);
                                    }
                                })
                            })
                        });
                    })
                })
            });
        });
    });
});


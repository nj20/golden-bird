var db = require("../../db/mongoDB")
var restaurant = require("../../controllers/restaurant")
var userController = require("../../controllers/user");
userController.setDB(db);
restaurant.setDB(db);
restaurant.setUserController(userController);
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
                restaurant.setDB(db);
                clearInterval(interval);
                done();
            }
        }, 300)
    });

    beforeEach(function(done)
    {
        db.dropDatabase().then(function()
        {
            done();
        });
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
            "location": "St. Andrews",
            "user": userData
        }

        userController.add(userData).then(function(addResult)
        {
            restaurant.add(restaurantData).then(function(addResult)
            {
                db.find(restaurant.collectionName(), {"name": restaurantData.name}).then(function(searchResult)
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
});


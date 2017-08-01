var db = require("../../db/mongoDB")
var user = require("../../controllers/user")
var session = require("../../controllers/session")
var chai = require("chai");
var expect = chai.expect;

describe('User', function()
{
    this.timeout(5000);
    before(function(done)
    {
        //Waiting for db to get connected
        var interval = setInterval(function()
        {
            if(db.status())
            {
                user.setDB(db);
                session.setDB(db);
                session.setUserController(user);
                clearInterval(interval);
                done();
            }
        }, 300)
    });

    beforeEach(function(done)
    {
        db.dropDatabase().then(function(){done();});
    });

    it('can login', function(done)
    {
        var userData =
        {
            "_id": "nj20",
            "password": "1234",
            "type": "customer"
        }

        user.add(userData).then(function(addResult)
        {
            session.startNewSession({"_id": "nj20", "password": "1234"}).then(function(sessionKey)
            {
                try
                {
                    expect(addResult.status).to.equal(201);
                    expect(sessionKey.body).to.have.property("sessionKey");
                    done();
                }catch(e){done(e)}
            });
        });
    });

    it('can relogin', function(done)
    {
        var userData =
        {
            "_id": "nj20",
            "password": "1234",
            "type": "customer"
        }

        user.add(userData).then(function(addResult)
        {
            session.startNewSession({"_id": "nj20", "password": "1234"}).then(function(sessionKey)
            {
                session.startNewSession({"_id": "nj20", "password": "1234"}).then(function(newSessionKey)
                {
                    db.find(session.collectionName(), {}).then(function(searchResult)
                    {
                       searchResult.body.toArray().then(function(searchResultArray)
                       {
                           try
                           {
                               expect(sessionKey.body).to.not.deep.equal(newSessionKey.body);
                               expect(searchResultArray.length).to.equal(1);
                               expect(searchResultArray[0]).to.include({"userId": userData._id});
                               done();
                           }
                           catch(e){done(e)}
                       })
                    });
                });
            });
        });
    });

    it('cannot login with invalid username', function(done)
    {
        var userData =
        {
            "_id": "nj20",
            "password": "1234",
            "type": "customer"
        }

        user.add(userData).then(function(addResult)
        {
            session.startNewSession({"_id": "nj201", "password": "1234"}).then(function(error)
            {
                db.find(session.collectionName(), {}).then(function(searchResult)
                {
                    searchResult.body.toArray().then(function(searchResultArray)
                    {
                        try
                        {
                            expect(error.status).to.equal(404);
                            expect(searchResultArray.length).to.equal(0);
                            done();
                        }catch(e){done(e)}
                    })
                });
            });
        });
    });

    it('cannot login with invalid password', function(done)
    {
        var userData =
        {
            "_id": "nj20",
            "password": "1234",
            "type": "customer"
        }

        user.add(userData).then(function(addResult)
        {
            session.startNewSession({"_id": "nj20", "password": "12345"}).then(function(error)
            {
                db.find(session.collectionName(), {}).then(function(searchResult)
                {
                    searchResult.body.toArray().then(function(searchResultArray)
                    {
                        try
                        {
                            expect(error.status).to.equal(401);
                            expect(searchResultArray.length).to.equal(0);
                            done();
                        }catch(e){done(e)}
                    })
                });
            });
        });
    });

});


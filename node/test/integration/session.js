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
            "type": "0"
        }

        user.add(userData).then(function(addResult)
        {
            session.startNewSession({"_id": userData._id, "password": userData.password}).then(function(sessionKey)
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
            "type": "0"
        }

        user.add(userData).then(function(addResult)
        {
            session.startNewSession({"_id": userData._id, "password": userData.password}).then(function(sessionKey)
            {
                session.startNewSession({"_id": userData._id, "password": userData.password}).then(function(newSessionKey)
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
            "type": "0"
        }

        user.add(userData).then(function(addResult)
        {
            session.startNewSession({"_id": userData._id + "2342", "password": userData.password}).then(function(error)
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
            "type": "0"
        }

        user.add(userData).then(function(addResult)
        {
            session.startNewSession({"_id": userData._id, "password": userData.password + "werdsf"}).then(function(error)
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

    it('can be retrieved from session key', function(done)
    {
        var userData =
        {
            "_id": "nj20",
            "password": "1234",
            "type": "0"
        }
        var userData2 =
        {
            "_id": "nj204",
            "password": "1234",
            "type": "0"
        }

        user.add(userData).then(function(addResult)
        {
            user.add(userData2).then(function(addResult2)
            {
                session.startNewSession({"_id": userData._id, "password": userData.password}).then(function (sessionKey)
                {
                    session.getUserFromSessionKey(sessionKey.body.sessionKey).then(function (searchedUser)
                    {
                        try
                        {
                            expect(searchedUser.body).to.include({"_id": userData._id});
                            done();
                        }catch(e){done(e)}
                    });
                });
            });
        });
    });

    it('cannot be retrieved from expired session key', function(done)
    {
        var userData =
        {
            "_id": "nj20",
            "password": "1234",
            "type": "0"
        }
        //Setting the login session time to 1 second
        var defaultSessionTime = process.env.defaultLogInSessionTime;
        process.env.defaultLogInSessionTime = 1;

        user.add(userData).then(function(addResult)
        {
            session.startNewSession({"_id": userData._id, "password": userData.password}).then(function (sessionKey)
            {
                setTimeout(function()
                {
                    session.getUserFromSessionKey(sessionKey.body.sessionKey).then(function (searchedUser)
                    {
                        try
                        {
                            process.env.defaultLogInSessionTime = defaultSessionTime;
                            expect(searchedUser.status).to.equal(401);
                            done();
                        }catch(e)
                        {
                            process.env.defaultLogInSessionTime = defaultSessionTime;
                            done(e);
                        }
                    });
                }, (process.env.defaultLogInSessionTime) * 1000)
            });
        });
    });

    it('cannot be retrieved from invalid sessionkey', function(done)
    {
        var userData =
        {
            "_id": "nj20",
            "password": "1234",
            "type": "0"
        }

        user.add(userData).then(function(addResult)
        {
            session.startNewSession({"_id": userData._id, "password": userData.password}).then(function (sessionKey)
            {
                session.getUserFromSessionKey("54545").then(function (searchedUser)
                {
                    try
                    {
                        expect(searchedUser.status).to.equal(401);
                        done();
                    }catch(e){done(e)}
                });
            });
        });
    });

    it('cannot be retrieved from sessionkey if user got deleted', function(done)
    {
        var userData =
        {
            "_id": "nj20",
            "password": "1234",
            "type": "0"
        }

        user.add(userData).then(function(addResult)
        {
            session.startNewSession({"_id": userData._id, "password": userData.password}).then(function (sessionKey)
            {
                db.delete(user.collectionName(), {"_id": userData._id}).then(function(res)
                {
                    session.getUserFromSessionKey(sessionKey.body.sessionKey).then(function (searchedUser)
                    {
                        try
                        {
                            expect(searchedUser.status).to.equal(404);
                            done();
                        }catch(e){done(e)}
                    });
                });
            });
        });
    });

});


var db = require("../../db/mongoDB")
var user = require("../../controllers/user");
var session = require("../../controllers/session")
var authentication = require("../../middleware/authentication")
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

    it('can be authenticated', function(done)
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
                    var request =
                    {
                        headers:
                        {
                            sessionkey: sessionKey.body.sessionKey
                        }
                    };
                    authentication(request, {}, function()
                    {
                        try
                        {
                            expect(request.headers.user._id).to.equal(userData._id);
                            expect(request.headers.authStatus).to.equal(200);
                            done();
                        }catch(e){done(e)}
                    });
                });
            });
        });
    });

    it('cannot be authenticated from expired session key', function(done)
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
                    var request =
                    {
                        headers:
                        {
                            sessionkey: sessionKey.body.sessionKey
                        }
                    };
                    authentication(request, {}, function()
                    {
                        try
                        {
                            process.env.defaultLogInSessionTime = defaultSessionTime;
                            expect(request.headers.authStatus).to.equal(401);
                            done();
                        }catch(e)
                        {
                            process.env.defaultLogInSessionTime = defaultSessionTime;
                            done(e)
                        }
                    });
                }, (process.env.defaultLogInSessionTime) * 1000)
            });
        });
    });

    it('cannot be authenticated from invalid sessionkey', function(done)
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
                var request =
                {
                    headers:
                    {
                        sessionkey: "54545454"
                    }
                };
                authentication(request, {}, function()
                {
                    try
                    {
                        expect(request.headers.authStatus).to.equal(401);
                        done();
                    }catch(e)
                    {
                        done(e)
                    }
                });
            });
        });
    });

    it('cannot be authenticated if user got deleted', function(done)
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
                    var request =
                    {
                        headers:
                        {
                            sessionkey: sessionKey.body.sessionKey
                        }
                    };
                    authentication(request, {}, function()
                    {
                        try
                        {
                            expect(request.headers.authStatus).to.equal(404);
                            done();
                        }catch(e){done(e)}
                    });
                });
            });
        });
    });

});


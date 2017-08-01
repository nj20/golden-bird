var db = require("../../db/mongoDB")
var user = require("../../controllers/user")
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
            "type": "customer"
        }

        user.add(userData).then(function(addResult)
        {
            db.find(user.collectionName(), {"_id": userData._id}).then(function(searchResult)
            {
                searchResult.body.toArray().then(function(searchResultArray)
                {
                    try
                    {
                        expect(addResult.status).to.equal(201);
                        expect(searchResultArray.length).to.equal(1);
                        expect(searchResultArray[0]).to.deep.include(userData);
                        done();
                    }catch(e){done(e)}
                });
            });
        });
    });
});


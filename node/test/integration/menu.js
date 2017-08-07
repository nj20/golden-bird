var db = require("../../db/mongoDB")
var restaurantController = require("../../controllers/restaurant")
var userController = require("../../controllers/user");
var menuController = require("../../controllers/menu");
var chai = require("chai");
var expect = chai.expect;
var menu;

describe('Menu', function()
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
                menuController.setDB(db);
                menuController.setUserController(userController);
                menuController.setRestaurantController(restaurantController);
                clearInterval(interval);
                done();
            }
        }, 300)
    });

    beforeEach(function(done)
    {
        db.dropDatabase().then(function()
        {
            menu =
            {
                sections:
                    [
                        {
                            name: "starters",
                            menuItems:
                                [
                                    {
                                        name: "dish one",
                                        description: "This is the first starter",
                                        price: "10"
                                    },
                                    {
                                        name: "dish two",
                                        description: "This is the second starter",
                                        price: "15"
                                    }
                                ]
                        },
                        {
                            name: "mains",
                            menuItems:
                                [
                                    {
                                        name: "dish three",
                                        description: "This is the first main",
                                        price: "20"
                                    }
                                ]
                        }
                    ]
            }
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
                        var restaurantId = searchResult[0]._id;
                        menu.restaurantId = restaurantId;
                        menuController.update(userData, menu).then(function(result)
                        {
                            db.find(menuController.collectionName(), {_id: menu.restaurantId}).then(function(result)
                            {
                                result.body.toArray().then(function(menuResult)
                                {
                                    try
                                    {
                                        expect(menuResult.length).to.equal(1);
                                        expect(menuResult[0]._id).to.equal(menu.restaurantId);
                                        done();
                                    }catch(e){done(e)}
                                });
                            });
                        });
                    });
                })
            })
        });
    });

    it('cannot be added if user does not own the restaurant', function(done)
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
                            var restaurantId = searchResult[0]._id;
                            menu.restaurantId = restaurantId;
                            menuController.update(userData2, menu).then(function(addMenuResult)
                            {
                                db.find(menuController.collectionName(), {_id: menu.restaurantId}).then(function(result)
                                {
                                    result.body.toArray().then(function(menuResult)
                                    {
                                        try
                                        {
                                            expect(addMenuResult.status).to.equal(401);
                                            expect(menuResult.length).to.equal(0);
                                            done();
                                        }catch(e){done(e)}
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    });

    it('cannot be added if menu is invalid', function(done)
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
                        var restaurantId = searchResult[0]._id;
                        //Adding with no restaurant ID
                        menuController.update(userData, menu).then(function(addMenuResult)
                        {
                            menu.restaurantId = restaurantId;
                            menu.sections[0].menuItems[1].name = "";
                            //Adding with invalid menu item
                            menuController.update(userData, menu).then(function(addMenuResult2)
                            {
                                menu.sections[0].menuItems[1].name = "name";
                                menu.sections[1].name = "";
                                //Adding with invalid section
                                menuController.update(userData, menu).then(function(addMenuResult2)
                                {
                                    menu.sections[1].name = "section";
                                    menu.sections = undefined;
                                    //Adding with invalid section
                                    menuController.update(userData, menu).then(function(addMenuResult2)
                                    {
                                        db.find(menuController.collectionName(), {_id: menu.restaurantId}).then(function(result)
                                        {
                                            result.body.toArray().then(function(menuResult)
                                            {
                                                try
                                                {
                                                    expect(menuResult.length).to.equal(0);
                                                    expect(addMenuResult.status).to.equal(400);
                                                    done();
                                                }catch(e){done(e)}
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    });
                })
            })
        });
    });

    it('can be updated', function(done)
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
                        var restaurantId = searchResult[0]._id;
                        menu.restaurantId = restaurantId;
                        menuController.update(userData, menu).then(function(result)
                        {
                            menu.sections[0].name = "updated";
                            menu.sections.splice(-1, 1);
                            menuController.update(userData, menu).then(function(result)
                            {
                                db.find(menuController.collectionName(), {_id: menu.restaurantId}).then(function(result)
                                {
                                    result.body.toArray().then(function(menuResult)
                                    {
                                        try
                                        {
                                            expect(menuResult.length).to.equal(1);
                                            expect(menuResult[0]._id).to.equal(menu.restaurantId);
                                            expect(menu.sections[0].name).to.equal("updated");
                                            expect(menu.sections.length).to.equal(1);
                                            done();
                                        }catch(e){done(e)}
                                    });
                                });
                            });

                        });
                    });
                })
            })
        });
    });
});


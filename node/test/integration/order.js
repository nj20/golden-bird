var db = require("../../db/mongoDB")
var user = require("../../controllers/user")
var chai = require("chai");
var expect = chai.expect;
var orderController = require("../../controllers/order");
var restaurantController = require("../../controllers/restaurant");
var userController = require("../../controllers/user");

var restaurantOwner;
var restaurant;
var customer;
var order;

describe('Order', function()
{
    this.timeout(15000);
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
                orderController.setDB(db);
                orderController.setRestaurantController(restaurantController);
                clearInterval(interval);
                done();
            }
        }, 300)
    });

    beforeEach(function(done)
    {
        db.dropDatabase().then(function()
        {
            restaurantOwner =
            {
                _id: "owner",
                password: "1234",
                type: "1"
            }
            customer =
            {
                _id: "customer",
                password: "1234",
                type: "0"
            }
            restaurant =
            {
                name: "restaurant",
                description: "Its a place to eat!",
                location: "St. Andrews"
            }
            order =
            {
                restaurantId: "",
                tableId: "24",
                items:
                    [{
                        itemId: "34235",
                        quantity: "2"
                    },
                    {
                        itemId: "1054",
                        quantity: "1"
                    }],
                time: "34325424634"
            }
            done();
        });
    });

    it('can be made', function(done)
    {
        userController.add(restaurantOwner).then(function ()
        {
            userController.add(customer).then(function ()
            {
                restaurantController.add(restaurantOwner, restaurant).then(function ()
                {
                    order.restaurantId = restaurant._id;
                    orderController.add(customer, order).then(function(result)
                    {
                        db.registerToJobName(restaurant._id, "order", function(receivedOrder, callback)
                        {
                            try
                            {
                                expect(receivedOrder).to.deep.include(order);
                                callback();
                                done();
                            }catch(e){done(e)}
                        });
                    });
                });
            });
        });
    });

    it('cannot be made with invalid restaurantId', function(done)
    {
        userController.add(restaurantOwner).then(function ()
        {
            userController.add(customer).then(function ()
            {
                restaurantController.add(restaurantOwner, restaurant).then(function ()
                {
                    order.restaurantId = restaurant._id + "234234";
                    orderController.add(customer, order).then(function(result)
                    {
                        try
                        {
                            expect(result.status).to.equal(404);
                            done();
                        }catch(e){done(e)}
                    });
                });
            });
        });
    });

    it('cannot be made with no table id', function(done)
    {
        userController.add(restaurantOwner).then(function ()
        {
            userController.add(customer).then(function ()
            {
                restaurantController.add(restaurantOwner, restaurant).then(function ()
                {
                    order.restaurantId = restaurant._id;
                    order.tableId = "";
                    orderController.add(customer, order).then(function(result)
                    {
                        try
                        {
                            expect(result.status).to.equal(400);
                            done();
                        }catch(e){done(e)}
                    });
                });
            });
        });
    });

    it('cannot be made with no itemId given', function(done)
    {
        userController.add(restaurantOwner).then(function ()
        {
            userController.add(customer).then(function ()
            {
                restaurantController.add(restaurantOwner, restaurant).then(function ()
                {
                    order.restaurantId = restaurant._id;
                    order.items[0].itemId = "";
                    orderController.add(customer, order).then(function(result)
                    {
                        try
                        {
                            expect(result.status).to.equal(400);
                            done();
                        }catch(e){done(e)}
                    });
                });
            });
        });
    });

    it('can be made and then received', function(done)
    {
        userController.add(restaurantOwner).then(function ()
        {
            userController.add(customer).then(function ()
            {
                restaurantController.add(restaurantOwner, restaurant).then(function ()
                {
                    order.restaurantId = restaurant._id;
                    orderController.add(customer, order).then(function(result)
                    {
                        orderController.getNextOrder(restaurantOwner, restaurant._id).then(function(result)
                        {
                            try
                            {
                                expect(result.body).to.deep.equal(order);
                                done();
                            }catch(e){done(e)}
                        });
                    });
                });
            });
        });
    });

    it('can be made and then received multiple times', function(done)
    {
        var secondOrder =
        {
            restaurantId: "",
            tableId: "14",
            items:
                [{
                    itemId: "34235",
                    quantity: "2"
                },
                    {
                        itemId: "1054",
                        quantity: "1"
                    }],
            time: "234"
        }
        userController.add(restaurantOwner).then(function ()
        {
            userController.add(customer).then(function ()
            {
                restaurantController.add(restaurantOwner, restaurant).then(function ()
                {
                    order.restaurantId = restaurant._id;
                    secondOrder.restaurantId = restaurant._id;
                    orderController.add(customer, order).then(function(result)
                    {
                        orderController.add(customer, secondOrder).then(function(result)
                        {
                            orderController.getNextOrder(restaurantOwner, restaurant._id).then(function(firstOrder)
                            {
                                setTimeout(function()
                                {
                                    orderController.getNextOrder(restaurantOwner, restaurant._id).then(function(secondOrder)
                                    {
                                        done();
                                    });
                                }, 1000);
                            });
                        });
                    });
                });
            });
        });
    });

    it('can be received even if the order is made after requesting for next order in queue', function(done)
    {
        userController.add(restaurantOwner).then(function ()
        {
            userController.add(customer).then(function ()
            {
                restaurantController.add(restaurantOwner, restaurant).then(function ()
                {
                    order.restaurantId = restaurant._id;
                    orderController.getNextOrder(restaurantOwner, restaurant._id).then(function(result)
                    {
                        expect(result.body).to.deep.equal(order);
                        done();
                    });
                    orderController.add(customer, order).then(function(result){});
                });
            });
        });
    });
});


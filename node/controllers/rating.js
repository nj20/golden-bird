var menuController;
var rand = require("random-seed");

module.exports =
{
    getRatings: function(restaurantId, user)
    {
        return new Promise(function(fulfill, reject)
        {
            menuController.getMenuWithRestaurantId(restaurantId).then(function(menu)
            {
                var randomGenerator = new rand(menu.body._id);
                for(var sectionCount = 0; sectionCount < menu.body["sections"].length; sectionCount++)
                {
                    var menuItems = menu.body["sections"][sectionCount]["menuItems"];
                    for(var itemCount = 0; itemCount < menuItems.length; itemCount++)
                    {
                        var menuItem = menuItems[itemCount];
                        menuItem.rating = 2 + (randomGenerator(100) / 33);
                        menuItem.numberOfOrders = 100 + randomGenerator(300);
                        console.log(menuItem);
                    }
                }
                fulfill(menu);
            });
        });
    },

    setMenuController: function(controller)
    {
        menuController = controller;
    }

}

function getFoodRating(restaurantId, itemId)
{

}
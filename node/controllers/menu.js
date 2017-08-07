/*
Module:
This module is used to manipulate menus in database
Each restaurant has only one menu. The id of each menu is equal to the restaurant id that owns it.
To use this controller. you need to set db, userController and restaurantController

 External Menu Structure (Structure of menu when using the interface):
 {
     restaurantId: string
     sections:
     [{
         name: string
         menuItems:
         [{
             name: string,
             description: string,
             price: string
         }]
     }]
 }

Internal Menu Structure (How the menu is actually represented):
{
    _id: string, (When sending menu object to menuController.update, replace this field with restaurantId)
    sections:
    [{
        name: string
        menuItems:
        [{
            name: string,
            description: string,
            price: string
        }]
    }]
}
*/

var verifyJson = require("../util/verifyJson");
var ObjectID = require('mongodb').ObjectID;
var db;
var userController;
var restaurantController;
var collection= 'menu';

module.exports =
{
    /**
     *
     * @param {Object} User - The user that is updating the menu
     * @param {Object} Menu
     * @returns {Promise} - fulfills with confirmation or error.
     */
    update: function(user, menu)
    {
        return new Promise(function(fulfill, reject)
        {
            if(verifyMenu(menu))
            {
                restaurantController.doesUserOwnRestaurant(user, menu.restaurantId).then(function(result)
                {
                    if(result.status == 200)
                    {
                        var isOwner = result.body;
                        if(isOwner)
                        {
                            //If menu does not exist, it will add it.
                            //If it already exists, it will update it
                            db.updateOne(collection, {"_id": menu.restaurantId},
                            {
                               $set:
                               {
                                   "_id": menu.restaurantId,
                                    "sections": menu.sections
                               }
                            }).then(function(result)
                            {
                                if(result.status == 200)
                                {
                                    fulfill(
                                    {
                                        status: 200,
                                        body: "Updated menu"
                                    })
                                }
                                else
                                {
                                    fulfill(result);
                                }
                            });
                        }
                        else
                        {
                            fulfill(
                            {
                                status: 401,
                                body: "User is not owner of the restaurant"
                            });
                        }
                    }
                    else
                    {
                        fulfill(result)
                    }
                });
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

    setDB: function(database)
    {
        db = database;
    },

    setUserController: function(userContr)
    {
        userController = userContr;
    },

    setRestaurantController: function(restaurantContr)
    {
        restaurantController = restaurantContr;
    },

    collectionName: function()
    {
        return collection;
    }
}

/**
 *
 * @param Menu
 * @returns {boolean} - If menu has valid structure
 */
var verifyMenu = function(menu)
{
    if(verifyJson(menu, ["sections", "restaurantId"]))
    {
        for(var sectionIndex = 0; sectionIndex < menu.sections.length; sectionIndex++)
        {
            var section = menu.sections[sectionIndex];
            if(verifyJson(section, ["name", "menuItems"]))
            {
                for(var menuItemIndex = 0; menuItemIndex < section.menuItems.length; menuItemIndex++)
                {
                    var menuItem = section.menuItems[menuItemIndex];
                    if(!verifyMenuItem(menuItem))
                    {
                        return false
                    }
                    var id = new ObjectID();
                    menu.sections[sectionIndex].menuItems[menuItemIndex]._id = id.toHexString();
                }
            }
            else
            {
                return false;
            }
        }
    }
    else
    {
        return false
    }
    return true;
}

/**
 *
 * @param {Object} menuItem - A food item in menu. It must consist of name, description and price.
 * @returns {boolean} - If menu has valid structure
 */
var verifyMenuItem = function(menuItem)
{
    return verifyJson(menuItem, ["name", "description", "price"]);
}
var db;
var collection= 'restaurant';

module.exports =
{
    add: function(restaurant)
    {
        return  db.insertOne(collection, restaurant);
    },

    setDB: function(database)
    {
        db = database;
    }
}
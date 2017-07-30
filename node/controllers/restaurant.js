var db;
var collection= 'restaurant';

module.exports =
{
    add: function(name, description)
    {
        return  db.insertOne(collection, {"name": name, "description": description});
    },

    setDB: function(database)
    {
        db = database;
    }
}
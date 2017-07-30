//This module is used for responding to http requests

module.exports =
{
    badRequest: function(res)
    {
        res.statusCode = 400;
        res.json(
        {
            "message": "Bad Request"
        });
    },

    internalError: function(res)
    {
        res.statusCode = 500;
        res.json(
        {
            "message": "Internal server error"
        })
    }
}
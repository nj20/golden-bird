//this module is used for checking if headers have required data

module.exports = function(req, requiredHeaders)
{
    for(var count = 0; count < requiredHeaders.length; count++)
    {
        if(!req.headers[requiredHeaders[count]])
        {
            return false;
        }
        return true;
    }
}
//this module is used for checking if body have required data

module.exports = function(req, requiredData)
{
    for(var count = 0; count < requiredData.length; count++)
    {
        var entry = req.body[requiredData[count]];
        if(entry == undefined || entry == "")
        {
            return false;
        }
    }
    return true;
}
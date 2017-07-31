//this module is used for checking if body have required data

module.exports = function(json, requiredFields)
{
    for(var count = 0; count < requiredFields.length; count++)
    {
        var entry = json[requiredFields[count]];
        if(entry == undefined || entry == "")
        {
            return false;
        }
    }
    return true;
}
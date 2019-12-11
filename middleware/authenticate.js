var {Player} = require('./../models/player');
var {mongoose} = require('./../db/mongoose');
var path = require('path');

var authenticate = async(req, res, next)=>{
    console.log("Authentication - Start")

    console.log(req.body.playerID);

    let result = await Player.findById(req.body.playerID);
    console.log(result);

    if(result == null)
    {
        res.status(404).sendFile(path.join(__dirname, '../login.html'));
    }
    else{
        next();
    }
    
    
    

};

module.exports = {authenticate};
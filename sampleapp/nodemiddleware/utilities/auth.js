const jwt = require("jsonwebtoken");
const app = require('express')();
//const config = require("config");
app.set('jwtPrivateKey', '12345')
module.exports = function (req,res,next){
    const token = req.header('x-auth-token');
    if(!token)return res.status(401).send('Access denied. No token provided.');
    try{
        const decoded = jwt.verify(token,app.get("jwtPrivateKey"));
        req.cardName = decoded.cardName;
        req.pType = decoded.pType;
        next();
    }catch(ex){
        res.status(400).send('Invalid token');
    }

}

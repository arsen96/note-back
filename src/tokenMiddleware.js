const jwt = require('jsonwebtoken');
require('dotenv').config({path:'./config.env'})
const secretKeyToken = "dev"

const verifyJWTToken = (req,res,next) => {
    const token = req.cookies.note_user
    if(token){
        jwt.verify(token,secretKeyToken,(err,decodedToken) => {
            if(err){
                console.log("token verification failed",err.message);
            }else{
                req.user_id = decodedToken.id;
                 console.log("token",req.user_id)
                next();
            }
        })
    }
}

module.exports = verifyJWTToken;
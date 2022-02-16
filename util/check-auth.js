const {AuthenticationError} = require('apollo-server')
const jwt = require("jsonwebtoken");
require("dotenv").config();
const SECRET_KEY = process.env.SECRET_KEY;


module.exports = (context) => {
    const authHeader = context.req.headers.authorization
    if(authHeader){
        const token = authHeader.split('Bearer')[1]
        if(token){
            try{
                const user = jwt.verify(token,SECRET_KEY)
                return user 

            }catch(err){
                throw new AuthenticationError('Invalid')
            }
        }
        throw new Error('Auth token expired')
    }
     throw new Error('Auth header missing')
};

const jwt = require("jsonwebtoken");

const jwtSecret = process.env.JWT_SECRET || "c96a3981a9834dad5ef2961e976ab5d3";

module.exports = {
    createToken: (payload)=>{
        return jwt.sign(payload, jwtSecret)
    },
    validateToken: (token)=>{
        return jwt.verify(token, jwtSecret)
    }
}
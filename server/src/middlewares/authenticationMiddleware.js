const { validateToken } = require("../services/jwt")

module.exports = {
    validateJWT: (token)=>{
        try{
            const data = validateToken(token)
            if(!data){
                return false
            }
            return data
        }
        catch(err){
            console.log("err", err)
            return false
        }
    },
    validateJWTMiddleware: (req, res, next)=>{
        try{
            const token = req.headers.authorization?.split(' ')[1];
            if (!token) return res.status(401).json({ message: 'Unauthorized' });
            const data = validateToken(token)
            console.log("data", data)
            if(data){
               req.user = data;
               next()
            }
            else{
                return res.status(401).send({message:"Unauthorized user"})
            }
        }
        catch(err){
            console.log("er", err)
            res.status(500).send("Invalid user")
        }
    }
}
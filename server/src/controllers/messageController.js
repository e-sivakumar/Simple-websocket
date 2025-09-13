const messageCollection = require("../models/messageModel");
const {v4: uuidv4} = require("uuid");

module.exports = {
    storeMessage: async(msg, from, to)=>{
        try{
            const id = uuidv4();
            await messageCollection.create({
                _id: id,
                sender: from,
                receiver: to,
                content: msg,
            });
            return
        }
        catch(err){
            console.log("err",err)
            throw err
        }
    },
    listMessage: async (req, res)=>{
        try{
            const userId = req?.user?.id;
            if(!userId) {
                return res.status(401).send("Unauthorised user")
            }
            const {id} = req.params;
            if(!id){
                return res.status(400).send("Invalid arguments")
            }
            const messages = await messageCollection.find({
                $and:[
                    {
                        $or:[
                            {sender: userId},
                            {sender: id}
                        ]
                    },
                    {
                        $or:[
                            {receiver: userId},
                            { receiver: id}
                        ]
                    }
                ]
            },
        ).sort({createdAt: 1});
        res.status(200).send({messages})
        }
        catch (err) {
            console.log("err", err);
            return res.status(500).send("Server error");
          }
    }
}
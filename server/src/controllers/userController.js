const { v4: uuidv4 } = require("uuid");
const userCollection = require("../models/userModel");
const messageCollection = require("../models/messageModel");
const bcryptFunctions = require("../services/bcrypt");
const { createToken } = require("../services/jwt");

module.exports = {
  signUp: async (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).send("Invalid arguments");
          }
      const { userName, password, name } = req.body;
      if (!userName || !password || !name) {
        return res.status(400).send("Invalid arguments");
      }
      const existingUser = await userCollection.findOne({ userName });
      if (existingUser) {
        return res.status(400).send("Username already exists");
      }
      const hashedPassword = await bcryptFunctions.hashPassword(password);
      if(!hashedPassword) {
        return res.status(400).send("Invalid password");
      }
      const id = uuidv4();
      await userCollection.create({
        _id: id,
        name,
        userName,
        password: hashedPassword
      });
      res.status(201).send("Created successfully")
    } catch (err) {
      console.log("err", err);
      return res.status(500).send("Server error");
    }
  },
  login: async (req, res)=>{
    try{
        const {userName, password} = req.body;
        if (!userName || !password) {
            return res.status(400).send("Invalid arguments");
          }
          const user = await userCollection.findOne({ userName });
          if (!user) {
            return res.status(400).send("Invalid Username");
          }
          const isValidPassword = await bcryptFunctions.comparePassword(password, user.password)
          if(!isValidPassword){
            return res.status(400).send("Invalid Password");
          }
          const token = createToken({id: user._id});
          res.status(200).send({token})
    }
    catch(err){
        console.log("err", err)
        return res.status(500).send("Server error");
    }
  },
  list: async (req, res)=>{
    try{
        const user = req.user;
        if(!user.id){
            return res.status(401).send("Unauthorised user")
        }
        const users = await userCollection.find(
          {_id:{$ne: user.id}},
          {
            name:1,
            userName:1,
            socketId: 1
          }
        );

        const latestMessages = await messageCollection.aggregate([
          {
            $match: {
              $or: [
                { sender: user.id },
                { receiver: user.id }
              ]
            }
          },
          { $sort: { createdAt: -1 } },
          {
            $group: {
              _id: {
                $cond: [
                  { $eq: ["$sender", user.id] },
                  "$receiver", 
                  "$sender"
                ]
              },
              latestMessage: { $first: "$content" }, 
              latestMessageTime: { $first: "$createdAt" }
            }
          }
        ]);
    
        // Convert aggregation to a map for quick lookup
        const messageMap = {};
        latestMessages.forEach(m => {
          messageMap[m._id] = {
            content: m.latestMessage,
            createdAt: m.latestMessageTime
          };
        });
        
        const userNames = users.map(user=> (
          {
            name: user.name, 
            id: user._id, 
            isOnline: !!user.socketId, 
            latestMessage: messageMap[user._id]?.content || null,
            latestMessageTime: messageMap[user._id]?.createdAt || null
          }
          ));
        
        res.status(200).send({users:userNames})
    }
    catch(err){
        console.log("err", err)
        return res.status(500).send("Server error");
    }
  },
  updateSocket: async (id, socketId)=>{
    try{
       await userCollection.findOneAndUpdate({_id: id}, {
            $set:{
                socketId,
                updatedAt: new Date()
            }
        });
    }
    catch(err){
        console.log("err", err)
        return false
    }
  },
  findUserSocketId: async (id)=>{
    try{
        const user = await userCollection.findOne({_id: id});
        if(user.socketId){
            return user.socketId
        }
        else{
            return false
        }
    }
    catch(err){
        console.log("err", err)
        return false
    }
  },
  disconnectUser: async (id) =>{
    try{
        await userCollection.updateOne({_id: id},{
            $unset: {socketId:""}
        })
    }
    catch(err){
        console.log("err", err)
        return false
    }
  },
  getUserData: async (req, res)=>{
    try{
        const user = req.user;
        if(!user.id){
            return res.status(401).send("Unauthorised user")
        }
        const userData = await userCollection.findOne({_id: user.id});
        res.status(200).send({name: userData.name, id: userData._id, userName: userData.userName})
    }
    catch(err){
        console.log("err", err)
        return res.status(500).send("Server error");
    }
  }
};

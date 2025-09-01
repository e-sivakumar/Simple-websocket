const mongoose = require("mongoose")
require("dotenv").config();

mongoose.Promise = global.Promise;
const uri = process.env.MONGODB_URI;

async function db(){
    try{
        console.log("db", uri)
        await mongoose.connect(uri);
        console.log("db connected");
    }
    catch(err){
        console.log(" db err", err);
    }
}

module.exports = db;
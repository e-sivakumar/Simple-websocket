const mongoose = require ("mongoose");

const userSchema = new mongoose.Schema({
    _id: {type: String, required: true },
    name: {type: String, required: true },
    userName: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    socketId: {type: String, default: null}
}, {collection:"user", versionKey: false, timestamps: true});

module.exports = mongoose.model("user", userSchema);
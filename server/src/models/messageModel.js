const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    sender: {type: String, ref: "User", required: true},
    receiver: {type: String, ref: "User", required: true},
    content: {type: String, required: true },
    isDeleted : {type: Boolean, default: false}
}, {collection:"message", versionKey: false, timestamps: true});

module.exports = mongoose.model("message", messageSchema);
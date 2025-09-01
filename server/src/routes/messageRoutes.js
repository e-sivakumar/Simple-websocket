const express = require("express");
const { listMessage } = require("../controllers/messageController");
const { validateJWTMiddleware } = require("../middlewares/authenticationMiddleware");

const messageRouter = express.Router();

messageRouter.get("/list/:id", validateJWTMiddleware, listMessage)

module.exports = messageRouter;
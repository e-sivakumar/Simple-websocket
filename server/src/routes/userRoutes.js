const express = require("express");
const { signUp, login, list, getUserData } = require("../controllers/userController");
const { validateJWTMiddleware } = require("../middlewares/authenticationMiddleware");

const userRouter = express.Router();

userRouter.post("/sign-up", signUp);
userRouter.post("/login", login)
userRouter.get("/list", validateJWTMiddleware, list)
userRouter.get("/", validateJWTMiddleware, getUserData)

module.exports = userRouter;
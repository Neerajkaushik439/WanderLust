const express=require("express");
const router = express.Router();
const WrapAsync=require("../utils/asyncwrap.js");
const User= require("../models/user.js")
const passport= require("passport");
const {saveRedirectUrl}= require("../middleware.js")
const userController = require("../controllers/users.js")


router.get("/signup",userController.renderSignup)

router.post("/signup",WrapAsync(userController.signup))

router.get("/login",userController.renderLogin)


router.post('/login',saveRedirectUrl, passport.authenticate('local', { failureRedirect: '/login' , failureFlash:true }),WrapAsync(userController.login ));

//logout 
router.get("/logout",userController.logout)

module.exports=router;
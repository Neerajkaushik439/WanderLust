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


router.post('/login',saveRedirectUrl, passport.authenticate('local', { failureRedirect: '/login' , failureFlash:"Wrong credential" }),WrapAsync(userController.login ));

// Google Auth routes
router.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get("/auth/google/callback",
  saveRedirectUrl,
  passport.authenticate("google", { failureRedirect: "/login", failureFlash: "Google sign-in failed." }),
  WrapAsync(userController.googleLoginCallback)
);

//logout 
router.get("/logout",userController.logout)


module.exports=router;
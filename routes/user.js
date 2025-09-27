const express = require("express");
const router = express.Router({ mergeParams: true });
const User = require("../models/user.js"); // Fixed: Capital U for User
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveredirectUrl } = require("../middleware.js");

const usercontroller = require("../controllers/users.js");
//Signup GET request.
router.get("/signup", usercontroller.accesssignup);

//Signup POST request
router.post("/signup", wrapAsync(usercontroller.gettingsignup));

//LOGIN get request
router.get("/login",usercontroller.loggingin );

//LOGIN post request - Fixed the middleware order
router.post("/login", 
    saveredirectUrl, // Put middleware before passport.authenticate
    passport.authenticate("local", {
        failureRedirect: '/login', 
        failureFlash: true
    }),usercontroller.loggedin
);

//LOGOUT GET request 
router.get("/logout",usercontroller.logoutfunction );

module.exports = router;
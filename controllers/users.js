const User = require("../models/user.js");

module.exports.accesssignup = (req, res) => {
    res.render("users/signup.ejs");
}

module.exports.gettingsignup = async (req, res, next) => { // Added 'next' parameter
    try {
        let { username, email, password } = req.body;
        const newuser = new User({ email, username }); // Fixed: Added 'new' keyword
        const registereduser = await User.register(newuser, password); // Fixed: Capital U
        
        req.login(registereduser, (err) => { // Fixed: req.login not res.login
            if (err) {
                return next(err);
            }
            req.flash("success", "Welcome to wanderlust");
            res.redirect("/listings");
        });
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
};

module.exports.loggingin = (req, res) => {
    res.render("users/login.ejs");
};

module.exports.loggedin = async (req, res) => {
        let redirectUrl = res.locals.redirectUrl || "/listings";
        delete req.session.redirectUrl; // Clean up the session
        res.redirect(redirectUrl);
        req.flash("success", "Welcome to wanderlust, you are logged in");
};

module.exports.logoutfunction = (req, res, next) => { // Added 'next' parameter
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "You've successfully logged out!!");
        res.redirect("/listings");
    });
}


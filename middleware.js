const Listing = require("./models/listing");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema} = require("./schema.js");
const {reviewSchema} = require("./schema.js");
const Review = require("./models/review.js");

// this is looged in middle ware is used to check if the user already exists so then it is always not possible 
// to add it for all users hence we create it in a middle ware and addin between each routes
module.exports.isLoggedIn = (req,res,next) =>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl= req.originalUrl;
        req.flash("error", "you must be logged in to create listing");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveredirectUrl = (req,res,next)=>{
    if( req.session && req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner = async (req,res,next)=>{
    try {
        let {id} = req.params;
        let listing = await Listing.findById(id);
        if (!listing) {
            req.flash("error", "Listing not found");
            return res.redirect("/listings");
        }
        if (res.locals.currUser && !listing.owner.equals(res.locals.currUser._id)) {
            req.flash("error", "You don't have permission to edit this listing");
            return res.redirect(`/listings/${id}`);
        }
        next();
    } catch (err) {
        // FIXED: Choose ONE approach - either pass to error handler OR redirect
        req.flash("error", "Something went wrong");
        return res.redirect("/listings");
        // OR just: return next(err);
    }
}

module.exports.validateListing = (req, res, next) => {
    // Create a copy of req.body for validation
    let validationData = {...req.body};
    
    // If this is an update (PUT request) and no file is uploaded, 
    // don't validate the image field
    if (req.method === 'PUT' && !req.file) {
        // Remove image from validation for updates without new image
        delete validationData.listing.image;
    }
    
    let {error} = listingSchema.validate(validationData);
    if(error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

module.exports.validateReview = (req,res,next) =>{
    let{error} = reviewSchema.validate(req.body);
    if(error){
        let errMessage = error.details.map((el)=> el.message).join(",");
        throw new ExpressError(400,errMessage);
    }
    else{
        next();
    }
}
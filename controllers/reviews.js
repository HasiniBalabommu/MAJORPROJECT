const Review = require("../models/review.js");
const Listing = require("../models/listing.js");

module.exports. createreview = async (req,res)=>{
    let listing = await Listing.findById(req.params.id);
    let newReview = await new Review(req.body.review);// the name you have given in forms to show.ejs name=review[]

    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();

    res.redirect(`/listings/${listing._id}`); // learn meaning 
};

module.exports.deletereview = async(req,res)=>{
    let {id, reviewId} = req.params;
    await Listing.findByIdAndUpdate(id ,{$pull:{reviews: reviewId}});
    // to find out afterdeleting the reviews from the list again you need to delete it from the arrays also 
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
};


const express = require("express");
const router = express.Router({ mergeParams: true }); //It instructs Express to pass the route parameters from the parent into the child router.
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {reviewSchema} = require("../schema.js");
const {validateReview} = require("../middleware.js")

const reviewcontroller = require("../controllers/reviews.js");
router.post("/",
    validateReview,
    wrapAsync(reviewcontroller.createreview));

//Reviews Delete route
router.delete("/:reviewId" , wrapAsync(reviewcontroller.deletereview)
);

module.exports = router;

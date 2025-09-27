const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema} = require("../schema.js");
const Listing = require("../models/listing.js");
const {isLoggedIn, isOwner}  = require("../middleware.js");
const {validateListing} = require("../middleware.js");
const multer  = require('multer');
const {storage} = require("../cloudconfig.js")
const upload = multer({ storage });

const listingcontroller = require("../controllers/listings.js");

//Create new list (writing above show route because if you write below then new is considered as an id not a new route)
router.get("/new", isLoggedIn, listingcontroller.rendernewForm);

router.route("/")
.get(listingcontroller.index) //index route 
.post(isLoggedIn,
    upload.single('listing[image]'),
    validateListing,  // Move validation after upload
    wrapAsync(listingcontroller.create)
);

router.route("/:id")
.get(wrapAsync(listingcontroller.show)) // show individual listing
.put(isLoggedIn, 
    upload.single('listing[image]'),  // Upload first
    validateListing,  // Then validate
    wrapAsync(listingcontroller.update))
.delete(isLoggedIn, isOwner,
     wrapAsync(listingcontroller.delete));

//Edit route
router.get("/:id/edit", isLoggedIn, wrapAsync(listingcontroller.edit));

module.exports = router;
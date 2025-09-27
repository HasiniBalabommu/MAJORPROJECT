const Listing = require("../models/listing");
const ExpressError = require("../utils/ExpressError.js");

module.exports.index = async (req,res)=>{
    const alllistings = await Listing.find({});
    res.render("index.ejs",{alllistings});
};

module.exports.rendernewForm = (req,res)=>{
    res.render("new.ejs");
};

module.exports.create = async (req,res,next)=>{ 
    // Check if file was uploaded
    if (!req.file) {
        req.flash("error", "Image is required for new listings!");
        return res.redirect("/listings/new");
    }
    
    let url = req.file.path;
    let filename = req.file.filename;
    console.log(url,filename);
    
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url, filename};
    await newListing.save();
    
    req.flash("success","New listing created!!");
    res.redirect("/listings");
};

module.exports.show = async (req, res) => {
    try {
        let { id } = req.params;
        const list = await Listing.findById(id)
            .populate({
                path: "reviews",
                populate: {
                    path: "author"
                }
            })
            .populate("owner");
        
        if (!list) {
            req.flash("error", "Listing you requested for does not exist!");
            return res.redirect("/listings");
        }
        
        res.render("show.ejs", { list });
    } catch (err) {
        req.flash("error", "Something went wrong!");
        res.redirect("/listings");
    }
};

module.exports.edit = async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error", "Listing you requested for doesn't exist!");
        return res.redirect("/listings");
    }
    let orginalImageurl = listing.image.url;
    orginalImageurl = orginalImageurl.replace("/upload","/upload/w_250");
    res.render("edit.ejs", {listing,orginalImageurl});
};

module.exports.update = async (req,res)=>{
    let {id} = req.params;
    
    let listing = await Listing.findByIdAndUpdate(
        id,
        { $set: req.body.listing },
        { new: true, runValidators: true }
    );
    
    // Only update image if new file was uploaded
    if(typeof(req.file) !== "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url, filename};
        await listing.save();
    }
    
    req.flash("success", "Listing updated!");
    res.redirect(`/listings/${id}`);
};

module.exports.delete = async (req, res) => {
    let {id} = req.params;
    let deletedlist = await Listing.findByIdAndDelete(id);
    console.log(deletedlist);
    req.flash("success", "Listing deleted!");
    res.redirect("/listings");
};
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const ListingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    filename: {
      type: String,
      default: "listingimage",
    },
    url: {
      type: String,
      default:
        "https://images.unsplash.com/photo-1756452442348-36fbd4260a33?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0",
      set: (v) =>
        v === " "
          ? "https://images.unsplash.com/photo-1756452442348-36fbd4260a33?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0"
          : v,
    },
  },
  price: String,
  location: String,
  country: String,
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

// Cascade delete reviews if listing is deleted
ListingSchema.post("findOneAndDelete", async function (listing) {
  if (listing) {
    await Review.deleteMany({ _id: { $in: listing.reviews } });
  }
});

const Listing = mongoose.model("Listing", ListingSchema); // ✅ Capitalized
module.exports = Listing;

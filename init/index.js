const mongoose = require("mongoose");
const initdata = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

async function main() {
    try {
        await mongoose.connect(MONGO_URL);
        console.log("✅ Connected to MongoDB");
    } catch (err) {
        console.error("❌ MongoDB connection error:", err);
    }
}
main();

const initDb = async()=>{
    await Listing.deleteMany({});//initially clearing the entire database
    initdata.data = initdata.data.map((obj)=>({
        ...obj,
        owner:"652d0081ae547c5d37e56b5",// this is where the id of anyone object from the databse is set here and Iam not able acces mongo shell thats why 
    }));
    await Listing.insertMany(initdata.data);
    console.log("data saved successfully");
};

initDb();
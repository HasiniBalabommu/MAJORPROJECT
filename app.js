if(process.env.NODE_ENV != 'production'){
    require('dotenv').config(); // the reason of writing this is when we deploy the project the .NODE_ENV that time important passworsds from env environment shpuld get leaked 
}
console.log(process.env.SECRET);
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate"); // helps to create multiple layouts (boilerplate code)
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const localstrategy = require("passport-local");
const user = require("./models/user.js");

const listingrouter = require("./routes/listing.js");
const reviewrouter = require("./routes/review.js"); // requiring their individual routes from router functions 
const userrouter = require("./routes/user.js");

// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

const dburl = process.env.ATLASDB_URL;
console.log("Mongo URI from env:", process.env.ATLASDB_URL);
async function main() {
    try {
        await mongoose.connect(dburl);
        console.log("✅ Connected to MongoDB");
    } catch (err) {
        console.error("❌ MongoDB connection error:", err);
    }
}
main();
app.set ("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,"/public")));// this allows to linl the styling through a single public folder for all file 
app.use(methodOverride('_method'));
app.engine('ejs',ejsMate);
app.use(express.static('public'));

const store = MongoStore.create({
    mongoUrl: dburl,
    crypto:{
        secret: process.env.SECRET,
    },
    touchAfter: 24*3600,
});

store.on("error",()=>{
    console.log("ERROR in mongo session store",err);
})

const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie:{
        expires: Date.now() + 1000*60*60*24*3,
        maxAge:1000*60*60*24*3,
        httpOnly: true,
    }
}


app.use(session(sessionOptions));
app.use(flash());
// alwys flash() must be used before routes beacause insid these we need to use them right 

app.use(passport.initialize());// this is mainly used so that all routes pass through this passport middleware
app.use(passport.session());
passport.use(new localstrategy(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

//middlewares for success and  failure reactions 
app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error  = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

// app.get("/demouser", async(req,res)=>{
//     let fakeuser = new user({
//         email: "delta@getMaxListeners.com",
//         username:"delta-students",
//     });
//     let registered = await user.register(fakeuser,"hello");
//     res.send(registered);
// });

app.use("/listings/:id/reviews", reviewrouter);
app.use("/listings",listingrouter);// requiring the routes file in the above name litsings and require
app.use("/",userrouter);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () =>{
    console.log(`Server is listening to port ${PORT}`);
});

// app.get("/", (req,res) =>{
//     res.send("Hi Iam root");
// });

app.use((err,req,res,next) =>{ // now we will set some default status and messgae if for 
    let{status = 500,message ="something went wrong"} = err;
    res.render("error.ejs",{message});
});


//Delete listing route and we need to make sure that if the listing is deleted 
//you must make sure that the reviews of that listing should also be deleted if the listing itself is not present 







// app.get("/testlisting", async (req,res)=>{
//     let sample = new listing({
//     title: "Cozy Beachfront Cottage",
//     description:"Escape to this charming beachfront cottage for a relaxing getaway. Enjoy stunning ocean views and easy access to the beach.",
//     price: 1500,
//     location: "Malibu",
//     country: "United States",
//     });
//     await sample.save()
//     console.log("Sample successfully saved");
//     res.send("Successful testing");
// });

// app.all("*",(req,res,next)=>{
//     next (new ExpressError(404, "Page not Found"));
// }); // if none of the routes is found then this middle ware is executed 



// we will download a npm package called joi it defines schema not for moongose
//it defines schema for validation of mongoose schema (severside validation)

if(process.env.NODE_ENV!="production"){
    require('dotenv').config()
}


const rateLimit = require("express-rate-limit");

const express=require("express");
const app=express();

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 60, // Limit each IP to 60 requests per minute
  standardHeaders: true,
  legacyHeaders: false,
  message: "Too many requests", // This is what you're seeing in browser
});

app.use(limiter); // Apply to all routes



const mongoose=require("mongoose");
const Listing =require('./models/listing.js');
const path = require('path');
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
const methodOverride = require('method-override');
app.use(methodOverride('_method'));
app.use(express.urlencoded({ extended: true }));
const ejsMate=require("ejs-mate")
app.engine('ejs', ejsMate);
const WrapAsync=require("./utils/asyncwrap.js");
const expresserror=require("./utils/expresserror.js")
const {listingschema,reviewschema}=require("./schema.js")
const Review=require("./models/review.js")

const session=require("express-session");
const MongoStore = require('connect-mongo');
const flash=require("connect-flash");
app.use(express.urlencoded({extended:true}))
app.use(express.static(path.join(__dirname,"/public")));
const passport= require("passport");
const localStrategy = require("passport-local");
const User = require("./models/user.js");


const listingsroute = require("./routes/listing.js");
const reviewsroute= require("./routes/review.js");
const userroute = require("./routes/user.js");





const { STATUS_CODES } = require("http");

const PORT = Number(process.env.PORT) || 8080;
const server = app.listen(PORT, () => {
    console.log(`App is listening on port ${PORT}`);
});
server.on("error", (err) => {
    if (err.code === "EADDRINUSE") {
        console.error(
            `Port ${PORT} is already in use (another node app or terminal). ` +
                `Stop that process, or set PORT in .env to a free port (e.g. 3000). ` +
                `Find PID: netstat -ano | findstr ":${PORT}"`
        );
        process.exit(1);
    }
    throw err;
});


const dbUrl = process.env.ATLASDB_URL

main().then((res)=>{
    console.log("connected to DB");
})
.catch(err => console.log(err));

async function main() {
   
  await mongoose.connect(dbUrl);
  

}

const store = MongoStore.create({
    mongoUrl: dbUrl,
   crypto: {
       secret: process.env.SECRET
     },
     touchAfter: 24*3600  

})

store.on("error",()=>{
    console.log("error in mongo session store"+ err)
})

const sessionOpts={
    store,
    secret:process.env.SECRET,
    resave: false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true
    }
}




app.use(session(sessionOpts));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success=req.flash("success");
    res.locals.error = req.flash("error");
    console.log(req.user)
    res.locals.currentUser = req.user;

    console.log(`📢 Received ${req.method} request for ${req.url}`);
    next();
});








app.use("/listings/:id/reviews",reviewsroute);
app.use("/listings",listingsroute);
app.use("/",userroute) ;



app.all("*",(req,res,next)=>{
    next(new expresserror(404,"page not found"))
})


app.use((err,req,res,next)=>{
    let {status=500,message="Something went Wrong"}=err;
    console.log(message);
    res.status(status).render("error.ejs",{message})
    
    
})




